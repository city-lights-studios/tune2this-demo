#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Tune2This demo — static site generator.
#
# Every page lives in src/<name>.html as a body fragment with a small metadata
# block at the top. This script wraps each fragment in the shared <head>,
# header, persistent player and footer, and writes <name>.html to the repo
# root so GitHub Pages can serve it directly.
#
#   bash build.sh
#
# Edit src/*.html and assets/*, never the generated root .html files.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"

SITE_NAME="Tune2This"
SITE_TAG="Brought to you by City Lights Recording Studio"
SITE_URL="https://example.github.io/tune2this-demo"   # replace once the domain is live

# --- nav definition: slug|label -------------------------------------------
NAV_ITEMS=(
  "artists|Artists"
  "videos|Videos"
  "radio|Radio"
  "news|News"
  "studio|The Studio"
  "membership|Membership"
)

logo_svg() {
cat <<'SVG'
<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
  <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="7" fill="#111114" stroke="#F5C518" stroke-width="1.5"/>
  <path d="M20 6 L33 34 H7 Z" fill="#1A1A1F"/>
  <g fill="#F5C518">
    <rect x="19" y="10" width="2" height="5" rx="1"/>
    <rect x="18.6" y="17.5" width="2.8" height="6" rx="1.2"/>
    <rect x="18.1" y="26" width="3.8" height="7" rx="1.5"/>
  </g>
  <circle cx="20" cy="6.5" r="2.6" fill="#E2552F"/>
</svg>
SVG
}

nav_html() {
  local current="$1" out="" slug label aria
  for item in "${NAV_ITEMS[@]}"; do
    slug="${item%%|*}"; label="${item##*|}"
    aria=""
    [ "$slug" = "$current" ] && aria=' aria-current="page"'
    out+="        <a href=\"${slug}.html\"${aria}>${label}</a>"$'\n'
  done
  printf '%s' "$out"
}

footer_nav_html() {
  local out="" slug label
  for item in "${NAV_ITEMS[@]}"; do
    slug="${item%%|*}"; label="${item##*|}"
    out+="            <li><a href=\"${slug}.html\">${label}</a></li>"$'\n'
  done
  printf '%s' "$out"
}

build_page() {
  local src="$1"
  local slug; slug="$(basename "$src" .html)"

  # metadata block: lines of KEY: value, terminated by ---
  local title desc current hero_class
  title="$(sed -n 's/^TITLE: //p' "$src" | head -1)"
  desc="$(sed -n 's/^DESC: //p' "$src" | head -1)"
  current="$(sed -n 's/^NAV: //p' "$src" | head -1)"
  [ -z "$current" ] && current="$slug"

  local body; body="$(sed '1,/^---$/d' "$src")"

  {
  cat <<HEAD
<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE_URL}/${slug}.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE_URL}/img/city-lights-recording-studio-led-sign-route-33-farmingdale-nj-1024w.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A0A0B">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<script>document.documentElement.className = document.documentElement.className.replace('no-js','js');</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="index.html">
      $(logo_svg)
      <span class="brand__text">
        <span class="brand__name">Tune<span class="brand__two">2</span>This</span>
        <span class="brand__sub">A City Lights label</span>
      </span>
    </a>

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>

    <nav class="nav" id="primary-nav" aria-label="Primary">
$(nav_html "$current")    </nav>

    <div class="header-cta">
      <a class="btn btn--sm" href="membership.html">Join free</a>
    </div>
  </div>
</header>

<main id="main">
HEAD

  printf '%s\n' "$body"

  cat <<FOOT
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html">
          $(logo_svg)
          <span class="brand__text">
            <span class="brand__name">Tune<span class="brand__two">2</span>This</span>
            <span class="brand__sub">A City Lights label</span>
          </span>
        </a>
        <p class="footer-blurb">A record label, artist platform and fan club built on Route 33 in Farmingdale, New Jersey &mdash; out of a room that has been recording since 1989.</p>
        <p class="footer-note">${SITE_TAG}</p>
      </div>

      <div>
        <p class="footer-h">Explore</p>
        <ul class="footer-list">
$(footer_nav_html)            <li><a href="for-artists.html">For artists</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <div>
        <p class="footer-h">The studio</p>
        <address class="footer-addr">
          City Lights Recording Studio<br>
          1299 Highway 33 West<br>
          Farmingdale, NJ 07727<br>
          <a href="tel:+17329384565">(732) 938-4565</a><br>
          <a href="mailto:CityLightsRecordingStudio@gmail.com">CityLightsRecordingStudio@gmail.com</a>
        </address>
        <p class="footer-h" style="margin-top:1.75rem">Follow</p>
        <ul class="footer-list footer-list--inline">
          <li><a href="https://www.facebook.com/CityLightsRecordingStudio/" rel="noopener">Facebook</a></li>
          <li><a href="https://www.instagram.com/guy_daniel_city_lights/" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> Tune2This &middot; City Lights Recording Studio Inc.</span>
      <span class="footer-demo">Demo build &mdash; not a live storefront. No payments are processed.</span>
    </div>
  </div>
</footer>

<!-- Persistent transport. Stays docked while you move around the site. -->
<div class="player" id="player" hidden>
  <div class="player__inner">
    <button class="player__art" type="button" data-player-open aria-label="Open artist page">
      <img id="player-art" src="img/city-lights-recording-studio-neve-vr60-console-with-daw-480w.webp" alt="">
    </button>
    <div class="player__meta">
      <span class="player__title" id="player-title">Nothing queued</span>
      <span class="player__artist" id="player-artist">Tune2This Radio</span>
    </div>
    <div class="player__transport">
      <button class="player__btn" type="button" data-player-prev aria-label="Previous track">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14h2V5H7zm3 7l9 7V5l-9 7z" fill="currentColor"/></svg>
      </button>
      <button class="player__btn player__btn--play" type="button" data-player-toggle aria-label="Play" aria-pressed="false">
        <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg>
        <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" fill="currentColor"/></svg>
      </button>
      <button class="player__btn" type="button" data-player-next aria-label="Next track">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5v14h2V5h-2zM5 19l9-7-9-7v14z" fill="currentColor"/></svg>
      </button>
    </div>
    <div class="player__scrub">
      <span class="player__time" id="player-elapsed">0:00</span>
      <div class="player__bar" role="progressbar" aria-label="Track progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <span class="player__fill" id="player-fill"></span>
      </div>
      <span class="player__time" id="player-duration">0:00</span>
    </div>
    <a class="player__out" id="player-out" href="#" rel="noopener" target="_blank">Listen in full</a>
    <button class="player__btn player__btn--close" type="button" data-player-close aria-label="Close player">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
  </div>
</div>

<script src="data/catalog.js"></script>
<script src="assets/player.js"></script>
<script src="assets/site.js"></script>
</body>
</html>
FOOT
  } > "${slug}.html"

  echo "  built ${slug}.html"
}

echo "Building Tune2This demo…"
for f in src/*.html; do build_page "$f"; done
echo "Done. Open index.html"
