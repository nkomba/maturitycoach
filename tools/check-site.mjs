#!/usr/bin/env node
/**
 * check-site.mjs — pre-commit validator for maturity.coach
 *
 * Read-only. Never modifies files. Exits 1 if any error is found,
 * which makes it safe to wire into a git pre-commit hook or CI.
 *
 *   node tools/check-site.mjs
 *
 * Checks:
 *   1. Leftover template placeholders ([coach2], [Name], [Title], ...)
 *   2. Visible TODO text outside HTML comments
 *   3. Retired single-coach wording ("About Eugene", "Meet Eugene", ...)
 *   4. CTA label drift — every nav CTA must use the canonical label
 *   5. Internal links that point at files which do not exist
 *   6. Case mismatches that break on Linux hosts (GitHub Pages)
 *   7. Wrong email domain
 *   8. Coach lists that have drifted out of sync with data/coaches.json
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CANONICAL_CTA = 'Request a Consultation';
const EMAIL_DOMAIN = 'maturity.coach';

/** Directories we never walk into. */
const SKIP_DIRS = new Set(['.git', 'node_modules', 'tools', '_templates']);

/** Files that are documentation/scratch, not shipped pages. */
const SKIP_FILES = new Set(['nav-preview.html']);

/**
 * Client-facing document templates (contracts, proposals, NDAs).
 * These legitimately contain fill-in fields like [Title] and
 * [AUTHORIZED SIGNATORY NAME] in their signature blocks, so the
 * placeholder check is skipped for them. All other checks still apply.
 */
const DOCUMENT_TEMPLATES = new Set([
  'engagement-letter.html',
  'proposal-templates.html',
  'nda-mutual.html',
]);

const errors = [];
const warnings = [];

const err = (file, line, msg) => errors.push({ file, line, msg });
const warn = (file, line, msg) => warnings.push({ file, line, msg });

// ── Collect every .html file ────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(ROOT);

// ── Build a case-exact index of what actually exists on disk ────────────
// GitHub Pages serves from a case-sensitive filesystem. Windows does not,
// so a link like profiles/patrice.html can work locally and 404 in prod.
const onDisk = new Set();
function indexDisk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    onDisk.add(relative(ROOT, full).split(sep).join('/'));
    if (statSync(full).isDirectory()) indexDisk(full);
  }
}
indexDisk(ROOT);

const onDiskLower = new Map();
for (const p of onDisk) onDiskLower.set(p.toLowerCase(), p);

// ── Load coach data ─────────────────────────────────────────────────────
let coaches = [];
const coachesPath = join(ROOT, 'data', 'coaches.json');
if (existsSync(coachesPath)) {
  try {
    coaches = JSON.parse(readFileSync(coachesPath, 'utf8')).coaches ?? [];
  } catch (e) {
    err('data/coaches.json', 0, `invalid JSON: ${e.message}`);
  }
} else {
  err('data/coaches.json', 0, 'missing');
}

const coachSlugs = coaches.map((c) => c.id.toLowerCase());

// ── Patterns ────────────────────────────────────────────────────────────
const PLACEHOLDER = /\[(coach\d+|Coach Name|Name|Title)\]/;
const RETIRED_WORDING = [
  'About Eugene',
  'Meet Eugene',
  'Talk to Eugene',
  'Book Eugene',
  'Work with Eugene',
  'Tell Eugene about yourself',
];
const RETIRED_CTAS = [
  'Request Confidential Consultation',
  'Request Confidential Conversation',
  'Book a Conversation',
  'Book a Free Conversation',
];

/** Strip HTML comments so we only inspect what actually renders. */
function stripComments(html) {
  // Replace comment bodies with equal-length blanks to keep line numbers intact.
  return html.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
}

// ── Per-file checks ─────────────────────────────────────────────────────
for (const full of files) {
  const rel = relative(ROOT, full).split(sep).join('/');
  const base = rel.split('/').pop();
  if (SKIP_FILES.has(base)) continue;

  const raw = readFileSync(full, 'utf8');
  const visible = stripComments(raw);
  const rawLines = raw.split('\n');
  const visLines = visible.split('\n');

  visLines.forEach((line, i) => {
    const n = i + 1;

    if (PLACEHOLDER.test(line) && !DOCUMENT_TEMPLATES.has(base)) {
      err(rel, n, `template placeholder: ${line.match(PLACEHOLDER)[0]}`);
    }

    if (/\bTODO\b/.test(line)) {
      err(rel, n, 'visible TODO outside an HTML comment');
    }

    for (const phrase of RETIRED_WORDING) {
      if (line.includes(phrase)) err(rel, n, `retired single-coach wording: "${phrase}"`);
    }

    for (const cta of RETIRED_CTAS) {
      if (line.includes(cta)) err(rel, n, `retired CTA label: "${cta}"`);
    }

    if (/@maturitycoach\.com/.test(line)) {
      err(rel, n, `wrong email domain — use @${EMAIL_DOMAIN}`);
    }
  });

  // Nav CTA must carry the canonical label.
  rawLines.forEach((line, i) => {
    if (/class="(nav-cta|m-cta)"/.test(line) && line.includes('contact')) {
      if (!line.includes(CANONICAL_CTA)) {
        warn(rel, i + 1, `nav CTA label is not "${CANONICAL_CTA}"`);
      }
    }
  });

  // ── Internal link resolution + case sensitivity ──
  const depth = rel.includes('/') ? rel.split('/').length - 1 : 0;
  const baseDir = depth === 0 ? ROOT : dirname(full);

  for (const m of visible.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = m[1];
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('data:') ||
      href.startsWith('//')
    ) continue;

    // Root-absolute paths (/app/, /workshop/) are directory routes; skip.
    if (href.startsWith('/')) continue;

    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;

    const target = resolve(baseDir, clean);
    const targetRel = relative(ROOT, target).split(sep).join('/');

    if (existsSync(target)) {
      // Exists on Windows — but is the casing exact?
      const exact = onDiskLower.get(targetRel.toLowerCase());
      if (exact && exact !== targetRel) {
        err(rel, 0, `case mismatch — link "${href}" resolves to "${exact}" (404s on GitHub Pages)`);
      }
    } else if (onDiskLower.has(targetRel.toLowerCase())) {
      err(rel, 0, `case mismatch — link "${href}" vs on-disk "${onDiskLower.get(targetRel.toLowerCase())}"`);
    } else {
      err(rel, 0, `broken link: ${href}`);
    }
  }

  // ── Coach list drift ──
  // Any page carrying the Our Coaches nav must link every active coach.
  if (visible.includes('Our Coaches') && visible.includes('nav-dropdown')) {
    for (const slug of coachSlugs) {
      if (!visible.toLowerCase().includes(`profiles/${slug}.html`)) {
        err(rel, 0, `nav is missing coach "${slug}" — run: node tools/sync-coaches.mjs`);
      }
    }
  }
}

// ── Orphaned profile pages ──────────────────────────────────────────────
// A page sitting in profiles/ that no coach entry points at is almost
// always a half-finished duplicate of someone else's profile. Those have
// shipped before. Draft profiles belong in _templates/, not here.
const claimedPages = new Set(
  coaches.map((c) => c.profilePage.toLowerCase().split('/').pop())
);

for (const dirName of ['profiles', 'Profiles']) {
  const dir = join(ROOT, dirName);
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.html')) continue;
    if (!claimedPages.has(entry.toLowerCase())) {
      // Warning, not an error: an unreferenced draft is untidy but harmless —
      // nothing links to it. Kept visible so it doesn't get forgotten, but it
      // won't block a commit.
      warn(
        `${dirName}/${entry}`,
        0,
        'orphaned profile page — not in data/coaches.json, not linked from any nav'
      );
    }
  }
  break; // only inspect whichever casing actually exists
}

// ── Coach data integrity ────────────────────────────────────────────────
for (const c of coaches) {
  const page = join(ROOT, ...c.profilePage.split('/'));
  if (!existsSync(page)) err('data/coaches.json', 0, `${c.id}: profilePage not found — ${c.profilePage}`);

  const photo = join(ROOT, ...c.photo.split('/'));
  if (!existsSync(photo)) warn('data/coaches.json', 0, `${c.id}: photo not found — ${c.photo}`);

  if (!c.name || /\[/.test(c.name)) err('data/coaches.json', 0, `${c.id}: placeholder name`);
  if (!c.credentials) warn('data/coaches.json', 0, `${c.id}: empty credentials`);
  if (!c.shortBio) warn('data/coaches.json', 0, `${c.id}: empty shortBio`);
}

// ── Report ──────────────────────────────────────────────────────────────
const fmt = (list) =>
  list
    .map((e) => `  ${e.file}${e.line ? `:${e.line}` : ''}  ${e.msg}`)
    .sort()
    .join('\n');

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  console.log(fmt(warnings));
}

if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  console.log(fmt(errors));
  console.log(`\nFAILED — ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  process.exit(1);
}

console.log(`\nPASSED — ${files.length} files checked, ${warnings.length} warning(s)\n`);
