#!/usr/bin/env python3
"""
apply-unified-nav.py — Give the maturity.coach site one consistent, C-suite-friendly
navigation across every content page.

WHAT IT DOES
  For every eligible .html page in this folder it:
    1. Replaces the contents of <div class="nav-links"> with the unified desktop menu
       (Approach / Services / Insights dropdowns + About + Free Resources + CTA).
    2. Replaces the contents of <div class="mobile-menu"> with the matching grouped
       mobile menu.
    3. Injects the dropdown / featured / mobile-group CSS + active-highlight script
       before </head> (the base .nav styles already live in style.css; this only
       adds what's missing).

  It is IDEMPOTENT — safe to run repeatedly. It makes a one-time .bak backup of each
  file the first time it changes it.

WHAT IT LEAVES ALONE (see EXCLUDE)
  The conversion landing pages (workshop, ai-ready-leader) keep their own lean,
  single-goal headers on purpose — a full menu would leak conversions. They are
  reached FROM the main nav's "Free Resources" menu instead.
  tracking.html (internal dashboard) is skipped too.

HOW TO RUN
    1. Put this file in the same folder as your site (index.html, services.html, …).
    2. Open a terminal there and run:   python apply-unified-nav.py
    3. Review the pages, then delete the *.bak files once happy.

URL NOTE
  The funnel links use canonical paths /workshop/ , /ai-ready-leader/ , /app/
  (matching those pages' own og:url tags). If you deploy them as flat files,
  find/replace them with workshop.html / ai-ready-leader.html below.

No third-party packages required — standard library only.
"""

import re
import sys
import shutil
from pathlib import Path

# Pages that should NOT get the full public nav.
EXCLUDE = {
    "tracking.html",            # internal dashboard
    "workshop.html",            # conversion landing page — keep its lean header
    "ai-ready-leader.html",     # conversion landing page — keep its lean header
    "nav.html", "footer.html", "nav-preview.html",
}

# ── The unified desktop menu (goes inside <div class="nav-links"> … </div>) ──
NAV_LINKS = '''
      <!-- APPROACH: the why + the framework -->
      <div class="nav-group">
        <a href="philosophy.html" class="nav-group-trigger">Approach
          <svg class="nav-caret" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 1l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="nav-dropdown">
          <a href="philosophy.html">Philosophy<span class="dropdown-desc">The Maturity Method &mdash; wisdom, neuroscience &amp; AI</span></a>
          <a href="framework.html">Ubuntu Roots Coaching&trade;<span class="dropdown-desc">The proprietary coaching framework</span></a>
        </div>
      </div>

      <!-- SERVICES: overview + specialised track -->
      <div class="nav-group">
        <a href="services.html" class="nav-group-trigger">Services
          <svg class="nav-caret" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 1l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="nav-dropdown">
          <a href="services.html">All Services<span class="dropdown-desc">1:1, cohorts, teams &amp; keynotes</span></a>
          <a href="coaching-for-technical-leaders.html">Coaching for Technical Leaders<span class="dropdown-desc">CISOs, CIOs, CTOs &amp; federal tech leaders</span></a>
        </div>
      </div>

      <!-- INSIGHTS: thought leadership hub + featured essays + blog -->
      <div class="nav-group">
        <a href="perspectives.html" class="nav-group-trigger">Insights
          <svg class="nav-caret" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 1l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="nav-dropdown">
          <a href="perspectives.html">Perspectives<span class="dropdown-desc">Essays on leadership &amp; maturity</span></a>
          <a href="perspectives-human-maturity.html">Why AI Raises the Premium on Human Maturity</a>
          <a href="perspectives-sacrificial-leader.html">The Myth of the Sacrificial Leader</a>
          <a href="blog.html">From the Blog<span class="dropdown-desc">Latest notes &amp; articles</span></a>
        </div>
      </div>

      <a href="about.html">About Eugene</a>

      <!-- QUICK VALUE: standalone assessment CTA (2-minute quick check) -->
      <a href="assessment-teaser.html" class="nav-assess">Take the 2-Minute Maturity Assessment</a>

      <!-- PRIMARY CONVERSION -->
      <a href="contact.html" class="nav-cta">Request Confidential Conversation</a>
    '''

# ── The unified mobile menu (goes inside <div class="mobile-menu"> … </div>) ──
MOBILE_LINKS = '''
  <span class="m-label">Approach</span>
  <a href="philosophy.html" onclick="toggleMenu()">Philosophy</a>
  <a href="framework.html" onclick="toggleMenu()">Ubuntu Roots Coaching&trade;</a>

  <span class="m-label">Services</span>
  <a href="services.html" onclick="toggleMenu()">All Services</a>
  <a href="coaching-for-technical-leaders.html" onclick="toggleMenu()">For Technical Leaders</a>

  <span class="m-label">Insights</span>
  <a href="perspectives.html" onclick="toggleMenu()">Perspectives</a>
  <a href="blog.html" onclick="toggleMenu()">From the Blog</a>

  <span class="m-label">Assessment</span>
  <a href="assessment-teaser.html" class="m-assess" onclick="toggleMenu()">Take the 2-Minute Maturity Assessment</a>
  <a href="assessment.html" onclick="toggleMenu()">Full Maturity Assessment</a>

  <span class="m-label">More</span>
  <a href="/workshop/" onclick="toggleMenu()">Free Leadership Workshop</a>
  <a href="/ai-ready-leader/" onclick="toggleMenu()">AI-Ready Leader Guide</a>
  <a href="/app/" onclick="toggleMenu()">Get the App</a>
  <a href="about.html" onclick="toggleMenu()">About Eugene</a>
  <a href="contact.html" class="m-cta" onclick="toggleMenu()">Request Confidential Conversation</a>
'''

# ── CSS added once per page (only the pieces style.css lacks) ──
NAV_CSS = '''<style id="unified-nav-styles">
  /* Full-width submenu bar: opens ACROSS THE TOP, under the nav */
  .nav-links .nav-group { position: static; align-self: stretch; display: flex; align-items: center; }
  .nav-links .nav-group > .nav-group-trigger { display: inline-flex; align-items: center; gap: 6px; height: 100%; position: relative; }
  .nav-links .nav-group > .nav-group-trigger::after { display: none; }
  .nav-caret { width: 9px; height: 9px; opacity: .65; transition: transform .3s cubic-bezier(.4,0,.2,1); }
  .nav-group:hover .nav-caret { transform: rotate(180deg); }
  .nav-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; box-sizing: border-box;
    display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch; gap: 6px;
    padding: 16px 32px;
    background: var(--white, #fff);
    border-top: 1px solid var(--border, rgba(0,0,0,.08));
    border-bottom: 1px solid var(--border, rgba(0,0,0,.08));
    box-shadow: 0 24px 50px rgba(28,28,30,.10);
    opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(-8px);
    transition: opacity .24s ease, transform .24s cubic-bezier(.4,0,.2,1), visibility .24s; z-index: 9998;
  }
  .nav-dropdown::before { content: ''; position: absolute; left: 0; right: 0; top: -26px; height: 26px; }
  .nav-group:hover .nav-dropdown, .nav-group:focus-within .nav-dropdown {
    opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0);
  }
  .nav-dropdown a {
    display: block; padding: 12px 18px; border-radius: var(--radius-sm, 8px);
    font-size: 14px; line-height: 1.35; color: var(--text-primary, #1a1a1a);
    min-width: 180px; white-space: nowrap;
  }
  .nav-dropdown a::after { display: none; }
  .nav-dropdown a:hover { background: var(--cream, #f7f3ec); color: var(--gold-dark, #8b6e3a); }
  .nav-dropdown .dropdown-desc {
    display: block; margin-top: 3px; font-size: 12px; font-weight: 400;
    color: var(--text-secondary, #6b6b76); white-space: nowrap;
  }
  .nav-dropdown .tag {
    display: inline-block; margin-left: 8px; font-size: 10px; letter-spacing: .06em;
    text-transform: uppercase; color: var(--gold-dark, #8b6e3a);
    background: rgba(184,151,90,.14); padding: 2px 8px; border-radius: 100px; vertical-align: middle;
  }
  /* Assessment button (secondary gold CTA) */
  .nav-links a.nav-assess { border: 1.5px solid var(--gold, #b8975a); color: var(--gold-dark, #8b6e3a); padding: 9px 18px; border-radius: 100px; font-size: 14px; font-weight: 500; white-space: nowrap; }
  .nav-links a.nav-assess::after { display: none; }
  .nav-links a.nav-assess:hover { background: var(--gold, #b8975a); color: var(--white, #fff); }
  .nav-links a.nav-assess.active { background: var(--gold, #b8975a); color: var(--white, #fff); }
  /* Active page state (set automatically by the injected script) */
  .nav-links > a.active { color: var(--text-primary, #1a1a1a); }
  .nav-links > a.active::after { transform: scaleX(1); }
  .nav-links > a.nav-cta.active { background: var(--gold, #b8975a); }
  .nav-links .nav-group.active > .nav-group-trigger { color: var(--gold-dark, #8b6e3a); font-weight: 600; }
  .nav-links .nav-group.active > .nav-group-trigger::before {
    content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
    background: var(--gold, #b8975a); border-radius: 3px 3px 0 0;
  }
  .nav-dropdown a.active { background: var(--cream, #f7f3ec); color: var(--gold-dark, #8b6e3a); font-weight: 600; }
  .mobile-menu a.active { color: var(--gold-dark, #8b6e3a); font-weight: 600; }
  /* Mobile grouped menu */
  .mobile-menu .m-label {
    display: block; padding: 20px 32px 2px; text-align: center;
    font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
    color: var(--gold, #b8975a); border: none;
    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
  }
  .mobile-menu .m-label:first-child { padding-top: 10px; }
  .mobile-menu a.m-assess { color: var(--gold-dark, #8b6e3a); }
  .mobile-menu a.m-cta { color: var(--white, #fff); background: var(--charcoal, #1c1c1e); }
  #mainNav .nav-links { gap: 22px; }
  @media (max-width: 1120px) { #mainNav .nav-links { display: none; } #mainNav .nav-hamburger { display: flex; } }
</style>
'''

# ── Script added once per page: highlights the current page + its parent group ──
NAV_JS = '''<script id="unified-nav-script">
document.addEventListener('DOMContentLoaded', function () {
  function seg(url) {
    try {
      var a = document.createElement('a'); a.href = url;
      var s = a.pathname.split('/').filter(Boolean).pop();
      return (s || 'index.html').toLowerCase();
    } catch (e) { return ''; }
  }
  var here = seg(window.location.href) || 'index.html';
  var links = document.querySelectorAll('#mainNav .nav-links a, #mobileMenu a');
  Array.prototype.forEach.call(links, function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) return;
    if (seg(href) === here) {
      link.classList.add('active');
      var g = link.closest && link.closest('.nav-group');
      if (g) g.classList.add('active');
    }
  });
});
</script>
'''

RE_NAVLINKS  = re.compile(r'(<div class="nav-links">).*?(\s*<div class="nav-hamburger")', re.DOTALL)
RE_MOBILE    = re.compile(r'(<div class="mobile-menu" id="mobileMenu">).*?(</div>)', re.DOTALL)
RE_HEAD      = re.compile(r'</head>', re.IGNORECASE)
RE_OLD_STYLE = re.compile(r'[ \t]*<style id="unified-nav-styles">.*?</style>\n?', re.DOTALL)
RE_OLD_SCRIPT = re.compile(r'[ \t]*<script id="unified-nav-script">.*?</script>\n?', re.DOTALL)


def transform(html: str):
    changed = False
    before = html

    if RE_NAVLINKS.search(html):
        # Note: the '.*?' also swallows the </div> that closes .nav-links,
        # so we re-add it before the captured hamburger div (group 2).
        repl = lambda m: m.group(1) + NAV_LINKS.rstrip() + "\n    </div>" + m.group(2)
        html = RE_NAVLINKS.sub(repl, html)

    if RE_MOBILE.search(html):
        mob = lambda m: m.group(1) + MOBILE_LINKS + m.group(2)
        html = RE_MOBILE.sub(mob, html)

    # Drop any previously-injected style/script, then re-inject the current ones.
    # This makes re-runs refresh the CSS/JS (not just skip when already present).
    html = RE_OLD_STYLE.sub('', html)
    html = RE_OLD_SCRIPT.sub('', html)
    if RE_HEAD.search(html):
        html = RE_HEAD.sub(NAV_CSS + NAV_JS + '</head>', html, count=1)

    changed = html != before
    return html, changed


def main():
    folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent
    pages = sorted(p for p in folder.glob("*.html") if p.name.lower() not in EXCLUDE)

    if not pages:
        print(f"No .html pages found in {folder}"); return

    updated = skipped = 0
    for p in pages:
        original = p.read_text(encoding="utf-8")
        if '<div class="nav-links">' not in original and '<div class="mobile-menu"' not in original:
            print(f"  ·  {p.name:<38} no standard nav found — skipped")
            skipped += 1
            continue
        new, changed = transform(original)
        if changed and new != original:
            bak = p.with_suffix(p.suffix + ".bak")
            if not bak.exists():
                shutil.copy2(p, bak)
            p.write_text(new, encoding="utf-8")
            print(f"  ✓  {p.name:<38} unified")
            updated += 1
        else:
            print(f"  =  {p.name:<38} already current")
            skipped += 1

    print(f"\nDone. {updated} updated, {skipped} unchanged.")
    print("Left alone on purpose: workshop.html, ai-ready-leader.html (lean funnel headers), "
          "tracking.html (internal).")
    print("Backups saved as *.bak — delete them once you're happy.")


if __name__ == "__main__":
    main()
