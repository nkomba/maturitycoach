# Maturity.coach — Unified Navigation

A single, consistent navigation across every page, shaped for a **C-suite visitor who wants quick value**: prove relevance fast, hand them a no-cost "quick win," then convert.

Open **`nav-preview.html`** in any browser to see it working (hover Approach / Services / Insights / **Free Resources** for the submenus).

---

## The navigation

**Desktop bar (left → right)**

| Item | Type | Contains |
|------|------|----------|
| **Approach ▾** | submenu | Philosophy · Ubuntu Roots Coaching™ (framework) |
| **Services ▾** | submenu | All Services · Coaching for Technical Leaders |
| **Insights ▾** | submenu | Perspectives · *Why AI Raises the Premium…* · *The Myth of the Sacrificial Leader* · From the Blog |
| **About Eugene** | link | about.html |
| **Free Resources ▾** | submenu *(gold, featured)* | Quick Leadership Check `2 min` · Full Maturity Assessment · Free Leadership Workshop · AI-Ready Leader Guide · Get the App |
| **Request a Consultation** | dark button | contact.html |

The gold **Free Resources** menu is the quick-value engine: it gathers every no-cost entry point in one place and leads with the **Quick Leadership Check** — the fast, low-commitment hook you chose to lead with. **Request a Consultation** stays visible top-right as the single conversion action.

**Submenus open as a full-width bar across the top**, directly under the nav, with the links laid out in a horizontal row (a "mega-menu" strip) rather than a small box hanging off one item.

**Mobile** collapses to the hamburger with the same items grouped under Approach / Services / Insights / Free Resources / More.

**Active-page highlight.** A small script reads the current URL and lights up the matching item — plus its parent group — with a gold underline (desktop) / gold text (mobile). It's automatic: no per-page editing, and it works for sub-items too (e.g. on *framework.html* the **Approach** group is highlighted). See it on **Insights** in the preview.

---

## When a submenu is (and isn't) used

A dropdown earns its place **only when a top-level item has more than one genuine destination** — that keeps the bar scannable for a senior visitor who won't hunt.

- **Approach, Services, Insights, Free Resources** each have 2–5 real children → submenu.
- **About Eugene** and **Request a Consultation** are single destinations → no submenu, one click away.

---

## Quick-value flow for the exec

1. **Land** → the bar signals credibility (About) and substance (Insights) at a glance.
2. **Fast win** → *Free Resources* → *Quick Leadership Check* (2 min), the free Workshop, or the AI-Ready guide — value with no commitment.
3. **Go deeper** → Approach / Services explain the how and the fit.
4. **Convert** → *Request a Consultation*, always visible.

---

## The full page picture (after your latest uploads)

Your later uploads revealed three pages that were **not** in the first batch, which is why my first pass wrongly flagged them as dead links. They are real and now wired in:

| Was named | Actually is | Linked as |
|-----------|-------------|-----------|
| `index-07ee8340.html` | Free Leadership Workshop funnel | `/workshop/` |
| `index-0372e83b.html` | AI-Ready Leader guide landing page | `/ai-ready-leader/` |
| `index-f4731b9a.html` | The app itself (PWA: self-assessment, journaling) | `/app/` |

`website-snippets.html` also asked for a **"Get the App"** link in the nav — now present in Free Resources (desktop) and the mobile menu.

**Landing pages stay lean.** The Workshop and AI-Ready Leader pages keep their own single-goal headers on purpose — a full site menu would leak conversions. They're reached *from* the main nav, not rebuilt with it.

---

## What was inconsistent before (now fixed)

- **Two different nav systems** (a purple `.nav-main` component vs. the real gold/charcoal `.nav`) → **one system**, using the real theme tokens.
- **CTA label flip-flopped** between "Request Confidential Consultation" and "Book a Conversation" → standardized to **"Request a Consultation."**
- **Dropdown was unstyled** — `services.html` had Services-dropdown markup but the CSS existed nowhere, so it rendered broken → dropdown CSS now ships with the nav.
- **Orphan pages connected:** framework, blog, both essays, and the funnel pages all have a path in now.
- **`blog.html`** had a stray extra "Insights" link no other page carried → normalized.
- **Funnel pages were unreachable** from the main site → now surfaced via Free Resources.

---

## Files in this folder

| File | What it is |
|------|-----------|
| `nav-preview.html` | Standalone visual preview — open it to see the finished nav. |
| `nav.html` | A finished, self-styled demo page you can open directly — with a clearly marked "START COPY … END COPY" block to paste into your real pages. |
| `footer.html` | Updated footer with corrected links + Free Resources column. |
| `apply-unified-nav.py` | Applies the unified nav to every content page automatically. |
| `README-navigation.md` | This file. |

---

## How to apply it to the whole site

### Option A — automatic (recommended)
1. Copy your site's `.html` files into this folder (`C:\maturitycoach-nav`) alongside `apply-unified-nav.py`.
   Name the funnel pages `workshop.html`, `ai-ready-leader.html` if you keep them flat (or leave them as `/workshop/index.html` etc.).
2. In a terminal here, run:
   ```
   python apply-unified-nav.py
   ```
3. It rewrites the nav on every content page, makes `*.bak` backups, and prints a summary. Review, then delete the `.bak` files.

The script is **idempotent** (safe to re-run) and **skips** `workshop.html`, `ai-ready-leader.html` (lean funnel headers) and `tracking.html` (internal dashboard).

### Option B — manual
Open **`nav.html`** in a browser to preview it, then in the file copy the block between the **`▼▼▼ START COPY`** and **`▲▲▲ END COPY`** markers (that's the `<style id="unified-nav-styles">`, the `<nav>`, the mobile menu, and the `<script>`). Paste it in place of the old `<nav>…</nav>` + mobile-menu on each page. The base `.nav` styling already lives in your `style.css`; the copied block only adds the full-width submenu + active styles that were missing. (Don't copy the first `<style>` block in `nav.html` — that's demo-only base styling your site already has.)

---

## URL assumption & easy tweaks

- **Funnel URLs:** the nav links `/workshop/`, `/ai-ready-leader/`, `/app/` (matching those pages' own `og:url` canonicals). If you deploy them as flat files, find/replace with `workshop.html` / `ai-ready-leader.html` in `nav.html`, `footer.html`, and the script's `NAV_LINKS` / `MOBILE_LINKS`.
- **Technical Leaders:** points to the file you have, `coaching-for-technical-leaders.html`. If your canonical is `/technical-leaders/`, swap it.
- **CTA wording:** change "Request a Consultation" in `nav.html` (and the script) for the longer "Request Confidential Consultation" if you prefer.
- **Menu label:** prefer "Start Here" or "Tools" over "Free Resources"? One string to change in each of the three files.
