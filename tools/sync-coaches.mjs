#!/usr/bin/env node
/**
 * sync-coaches.mjs — regenerate coach navigation from data/coaches.json
 *
 *   node tools/sync-coaches.mjs           apply changes
 *   node tools/sync-coaches.mjs --dry-run show the diff, write nothing
 *
 * Why this exists
 * ---------------
 * The coach list appears in three places on every page: the desktop nav
 * dropdown, the mobile menu, and (indirectly) the team grid. Hand-editing
 * 19 files every time a coach joins is how the site ended up shipping
 * "[Name]" placeholders into production. This makes data/coaches.json the
 * single source of truth and rewrites the rest.
 *
 * It only touches text between these markers:
 *
 *   <!-- COACHES:START --> ... <!-- COACHES:END -->        desktop dropdown
 *   <!-- COACHES-MOBILE:START --> ... <!-- COACHES-MOBILE:END -->   mobile
 *
 * Files without markers are skipped with a notice — nothing is clobbered.
 * Relative path depth (./ vs ../) is derived per file, so pages inside
 * profiles/ get the correct prefix automatically.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY_RUN = process.argv.includes('--dry-run');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'tools', '_templates']);

const START = '<!-- COACHES:START -->';
const END = '<!-- COACHES:END -->';
const M_START = '<!-- COACHES-MOBILE:START -->';
const M_END = '<!-- COACHES-MOBILE:END -->';

// ── Load coaches ────────────────────────────────────────────────────────
const { coaches } = JSON.parse(readFileSync(join(ROOT, 'data', 'coaches.json'), 'utf8'));

if (!coaches?.length) {
  console.error('No coaches found in data/coaches.json — aborting.');
  process.exit(1);
}

for (const c of coaches) {
  if (/\[/.test(c.name)) {
    console.error(`Refusing to sync: coach "${c.id}" still has a placeholder name (${c.name}).`);
    process.exit(1);
  }
}

/** Escape text destined for HTML content. */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// ── Markup builders ─────────────────────────────────────────────────────
function desktopBlock(prefix, indent) {
  const pad = ' '.repeat(indent);
  const lines = [
    `${pad}<a href="${prefix}about.html">All Coaches<span class="dropdown-desc">Filter by specialization</span></a>`,
  ];
  for (const c of coaches) {
    lines.push(
      `${pad}<a href="${prefix}${c.profilePage}">${esc(c.name)}<span class="dropdown-desc">${esc(c.title)}</span></a>`
    );
  }
  return lines.join('\n');
}

function mobileBlock(prefix, indent) {
  const pad = ' '.repeat(indent);
  const lines = [`${pad}<a href="${prefix}about.html" onclick="toggleMenu()">All Coaches</a>`];
  for (const c of coaches) {
    lines.push(`${pad}<a href="${prefix}${c.profilePage}" onclick="toggleMenu()">${esc(c.name)}</a>`);
  }
  return lines.join('\n');
}

/** Replace the region between two markers, preserving the markers. */
function replaceRegion(html, start, end, build) {
  const s = html.indexOf(start);
  if (s === -1) return { html, found: false };
  const e = html.indexOf(end, s);
  if (e === -1) return { html, found: false };

  // Infer indentation from the marker's own line.
  const lineStart = html.lastIndexOf('\n', s) + 1;
  const indent = s - lineStart;

  const before = html.slice(0, s + start.length);
  const after = html.slice(e);
  return { html: `${before}\n${build(indent)}\n${' '.repeat(indent)}${after}`, found: true };
}

// ── Walk ────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

let changed = 0;
let skipped = 0;

for (const full of walk(ROOT)) {
  const rel = relative(ROOT, full).split(sep).join('/');
  const depth = rel.split('/').length - 1;
  const prefix = '../'.repeat(depth);

  const original = readFileSync(full, 'utf8');
  let html = original;
  let touched = false;

  const d = replaceRegion(html, START, END, (i) => desktopBlock(prefix, i));
  if (d.found) {
    html = d.html;
    touched = true;
  }

  const m = replaceRegion(html, M_START, M_END, (i) => mobileBlock(prefix, i));
  if (m.found) {
    html = m.html;
    touched = true;
  }

  if (!touched) {
    skipped++;
    continue;
  }

  if (html !== original) {
    if (!DRY_RUN) writeFileSync(full, html, 'utf8');
    console.log(`${DRY_RUN ? 'would update' : 'updated'}  ${rel}`);
    changed++;
  }
}

console.log(
  `\n${DRY_RUN ? 'Dry run: ' : ''}${changed} file(s) ${DRY_RUN ? 'would change' : 'updated'}, ` +
    `${skipped} without markers.\n` +
    `Coaches synced: ${coaches.map((c) => c.name).join(', ')}\n`
);
