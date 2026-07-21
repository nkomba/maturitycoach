# _templates

Scaffolding that is **not** part of the published site.

Files here may contain `[placeholder]` syntax. Nothing in this folder is
deployed, linked, or scanned by `tools/check-site.mjs`.

## Why this exists

Placeholder markup (`profiles/[coach2].html`, `[Name]`, `[Title]`) was
previously left inside live pages in the site root. It shipped, and
visitors saw "[Name]" in the navigation menu with links that went nowhere.

Keep drafts and skeletons here. Once a file is real, move it to the root
and run:

```bash
node tools/check-site.mjs
```

## Adding a coach

Use `profiles/catherine.html` as the working reference — it is complete and
correct. Copy it, replace the content, then follow the checklist in
`tools/README.md`.

Points that are easy to get wrong in a profile page:

- Stylesheets are `../style.css` and `../components.css`
- Every nav and footer link needs the `../` prefix
- Keep the `<!-- COACHES:START -->` / `<!-- COACHES-MOBILE:START -->`
  markers so `sync-coaches.mjs` can maintain the coach list
- Filenames are lowercase: `profiles/jordan.html`, not `profiles/Jordan.html`
