# Site maintenance tools

Two small Node scripts. No dependencies, no build step, no install.
You need Node 18 or newer — check with `node --version`.

Run both from the project root (`C:\maturitycoach-nav`), not from inside `tools/`.

---

## Before you commit

```bash
node tools/check-site.mjs
```

Read-only. It never edits anything. It fails loudly on the mistakes that
have actually bitten this site before:

| Check | Why it exists |
|---|---|
| Template placeholders (`[coach2]`, `[Name]`, `[Title]`) | These shipped live and showed "[Name]" in the menu |
| Visible `TODO` outside comments | Draft text reaching visitors |
| Retired wording ("About Eugene", "Meet Eugene") | Single-coach voice creeping back |
| CTA drift | Four competing labels existed at once |
| Broken internal links | Typos and moved files |
| **Case mismatches** | `profiles/` vs `Profiles/` works on Windows, 404s on GitHub Pages |
| Wrong email domain | `@maturitycoach.com` instead of `@maturity.coach` |
| Coach list drift | A coach in `coaches.json` missing from some page's nav |

Exit code is 0 on pass, 1 on failure, so it works in CI or a git hook.

---

## After changing the coaching team

```bash
node tools/sync-coaches.mjs --dry-run   # preview
node tools/sync-coaches.mjs             # apply
```

`data/coaches.json` is the single source of truth for who the coaches are.
This script pushes that list into every page's nav dropdown and mobile menu.

It only rewrites text between these markers, so the rest of each page is
untouched:

```html
<!-- COACHES:START -->        ... desktop dropdown ...   <!-- COACHES:END -->
<!-- COACHES-MOBILE:START --> ... mobile menu ...        <!-- COACHES-MOBILE:END -->
```

Files without markers are skipped and reported — nothing gets clobbered.
Relative paths (`./` vs `../`) are worked out per file, so pages inside
`profiles/` get the right prefix automatically.

The script refuses to run if any coach still has a placeholder name.

---

## Adding a coach — the order matters

1. **Profile page** — copy `profiles/catherine.html`, replace the content.
   Keep `../style.css` and `../components.css`; keep `../` on every nav link.
2. **Photo** — add `assets/coaches/<slug>.jpg`. Portrait, roughly 3:4.
3. **`data/coaches.json`** — add the entry. `id` and the filename must match:
   `id: "jordan"` → `profiles/jordan.html` → `assets/coaches/jordan.jpg`.
4. **Sync** — `node tools/sync-coaches.mjs`
5. **Check** — `node tools/check-site.mjs`

Do not hand-edit nav dropdowns. That is what caused the drift this tooling
exists to prevent.

---

## Conventions worth keeping

- **Lowercase filenames and folders, always.** GitHub Pages is case-sensitive;
  Windows is not, so a broken link looks fine locally and 404s in production.
- **One CTA label:** "Request a Consultation". Change it in `nav.html` and
  `footer.html`, then search for stragglers.
- **Voice:** "we" and "our coaches" for anything the practice does. First
  person is correct in exactly three places — coach profile bios, the
  "A Personal Word" sections, and bylined essays.
- **Never put draft copy in a live file.** Comment the section out instead;
  an empty section beats a visible `TODO`.

---

## Stylesheets

`style.css` and `components.css` at the root are one-line shims that
`@import` the real files from `css/`. They exist so pages can link
`style.css` and still resolve when opened directly from disk. If you add a
new stylesheet, follow the same pattern rather than changing every page.

---

## Optional: run the check automatically

```bash
printf '#!/bin/sh\nnode tools/check-site.mjs\n' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

A copy lives at `tools/pre-commit` if you would rather copy it in.
