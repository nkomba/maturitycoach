# Maturity Coach — Installable App (PWA)

A branded, installable app for your coaching practice, aligned to **maturity.coach**.
It works on iPhone and Android, installs to the home screen, and runs offline —
**no app store, no developer accounts, no fees.**

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | The entire app (Today, Assess, Journal, Progress, Coaching) |
| `manifest.webmanifest` | Makes it installable; name, colours, icons |
| `sw.js` | Service worker — offline support |
| `icon.svg` / `icon-maskable.svg` | App icon (monogram matching your logo) |

Everything is self-contained. Client data (journal entries, assessment results)
is stored **privately on the user's own device** — nothing is uploaded anywhere.

## Features

- **Today** — a daily piece of wisdom drawn from the traditions on your site
  (Stoicism, Ubuntu, Proverbs, Laozi, Confucius) with a reflection prompt, plus a streak.
- **Assess** — a 15-question Maturity Self-Assessment across five dimensions
  (Self-Knowledge, Agency & Clarity, Relationships & Ubuntu, Wise Use of Technology,
  Sustainable Living) with a scored profile and tailored guidance.
- **Journal** — private journaling with a mood check.
- **Progress** — streak, reflection count, and a growth curve of maturity scores over time.
- **Coaching** — a "Book a Free Conversation" button and your services (both link to
  maturity.coach), plus a small library of wisdom practices.

---

## How to preview it right now (on your computer)

Double-click `index.html` to open it in your browser. Everything works except
"install to home screen" and offline mode — those need the app to be served from a
website (next section). This is just a quick look.

## How to publish it to your site (recommended)

Your site maturity.coach is a set of static pages, so this drops right in.

1. Upload the whole `maturity-coach-app` folder to your website host, e.g. as a folder
   named **`app`**, so it lives at **`https://maturity.coach/app/`**.
   - If your site is on Cloudflare Pages / Netlify / similar: add these files to your
     project (an `app/` directory) and deploy as you normally do.
2. Visit **`https://maturity.coach/app/`** on your phone.
3. Optionally, add a link/button on your website: `Get the App → /app/`.

> It must be served over **https** (which maturity.coach already is) for install and
> offline to work. Opening the file directly won't enable those.

## How your clients install it

**iPhone / iPad (Safari):** open `https://maturity.coach/app/` → tap the **Share**
icon → **Add to Home Screen** → Add. It now opens like a native app, full screen.

**Android (Chrome):** open the same link → tap the **Install app** / **Add to Home
screen** prompt (or the ⋮ menu → Install app).

---

## Notes & options

- **Icons:** the app uses SVG icons, which display well on Android and modern iOS.
  For the sharpest icon on **older iPhones**, drop a 180×180 PNG named
  `apple-touch-icon.png` into this folder — I can generate that for you on request.
- **Booking:** the "Book a Free Conversation" button points to
  `https://maturity.coach/contact.html`. If you later add a scheduler (Calendly,
  TidyCal, etc.), we can point it straight there.
- **This is a v1.** Natural next steps: push notifications for the daily wisdom,
  audio practices/meditations, syncing journal across devices (needs a small backend),
  and content pulled from your site. Say the word and we'll add them.

_"Ancient wisdom, modern intelligence, and the courage to live fully."_
