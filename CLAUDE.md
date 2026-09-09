# CLAUDE.md — start here

This file is auto-loaded as context by Claude Code. If you're a fresh session
(including **Guy's Claude**), read this first. It's the operating manual for the
project; the deeper reference is in `README.md`.

---

## What this is

**Tune2This** — a demo website for a record label / artist platform / fan club,
**brought to you by City Lights Recording Studio** (1299 Highway 33 West,
Farmingdale, NJ; owner/producer **Guy Daniel Vastola**; (732) 938-4565).

It is a **static demo**, not a working platform. Pages are real; accounts,
payments, tips, charts and uploads are presentational until Phase 1 is built
(see Roadmap). One artist is real — **The GDVO** (Guy Daniel Vastola
Organization) and the single "Peace" — everything about it is verified, not
invented.

---

## The two people involved

- **Jose Perez** (jperezmusic@gmail.com) — built this. GitHub `teknowmusic`,
  Cloudflare account `Jperezmusic@gmail.com`.
- **Guy Daniel Vastola** (citylightsrecordingstudio@gmail.com) — studio owner,
  the client, the featured artist. Owns the **tune2this.com** domain at GoDaddy.

---

## How it's hosted / deployed (important, not derivable from the code)

- **Repo:** `github.com/teknowmusic/tune2this-demo` (public), branch `main`.
- **Host:** **Cloudflare Pages**, project `tune2this-demo`, on Jose's Cloudflare
  account. **Auto-deploys on every push to `main`.**
- **Immediate URL:** https://tune2this-demo.pages.dev (always live).
- **Primary domain:** https://tune2this.com (+ www) — registered to Guy at
  **GoDaddy**, DNS moved to Cloudflare nameservers (`braelyn` / `nero.ns.cloudflare.com`).
  Also mirrored at https://teknowmusic.github.io/tune2this-demo (GitHub Pages, harmless).
- **Auth on this machine:** GitHub CLI is installed and logged in as `teknowmusic`;
  git pushes work without prompting.

> **HANDOFF WARNING:** the repo, the Cloudflare project, and the GitHub login all
> sit under **Jose's** accounts. If work moves to **Guy's** machine/Claude, decide
> first: add Guy as a repo collaborator, transfer the repo, and/or move the
> Cloudflare Pages project — otherwise Guy's Claude can read the code but cannot
> push or deploy. Don't assume push access.

---

## How to work in this repo

- **Static site, no framework, no build tool.** Plain HTML/CSS/JS.
- **`bash build.sh`** regenerates the root `*.html` files from `src/*.html` by
  wrapping each fragment in the shared head/header/nav/footer/player.
- **Edit `src/*.html` and `assets/*` — NEVER the generated root `*.html`.** The
  build overwrites them. Shared chrome (header, nav, footer, player, `<head>`)
  lives inside `build.sh`.
- After editing: `bash build.sh`, then commit and push — Cloudflare redeploys.
- Environment is Windows + Git Bash. The `LF will be replaced by CRLF` git
  warnings are harmless.

```
build.sh            shared chrome + generator (edit header/nav/footer here)
src/*.html          one body fragment per page (TITLE/DESC/NAV block on top)
assets/site.css     all styling (palette = 6 CSS vars at the top)
assets/site.js      nav, dropdowns, reveals, tip picker, forms, buy links
assets/player.js    the docked player (queue survives page loads via sessionStorage)
data/config.js      Phase 0 config — form endpoint + contact email
data/catalog.js     the content source: artists + tracks (audio is null by design)
img/  video/        City Lights photos + 7 short clips
README.md           deep reference (payments, membership research, rights, design)
PHASE-0.md          the actionable "make it testable" checklist
```

---

## Current state (Phase 0 — done)

- Intake forms (Contact, Booking, Artist application, Join) **deliver for real**:
  they POST to `T2T_CONFIG.formEndpoint` when set (paste a Formspree URL into
  `data/config.js`), else fall back to `mailto`. Login forms stay inert on
  purpose — no auth yet, and never email a password.
- "Buy" buttons point to a real purchase page (Apple Music) until a
  Bandcamp/Gumroad store exists.
- Audio plays via official Spotify/YouTube embeds. The docked player runs a real
  transport and hands off to the rights holder's player for full listening.

**Remaining Phase 0 steps are in `PHASE-0.md`** (they need Jose/Guy's accounts:
a Formspree endpoint and a store + rights decision).

---

## Roadmap (Phase 1 — the real platform, not yet built)

Build order, on top of the current Cloudflare hosting. Recommended stack:
**Supabase (auth + database + file storage) + Stripe (payments/Connect)**.

1. **Accounts** (member + artist) — hosted auth (Supabase/Clerk). Everything
   below needs "who is logged in."
2. **Database** — users, artists, tracks, orders, tips, memberships.
3. **Audio you own/sell** — masters in object storage (Cloudflare R2 / Supabase),
   short free previews, signed expiring links for paid downloads.
4. **Payments** — Stripe Checkout for sales; **Stripe Connect** for artist splits
   and payouts; webhook grants download entitlements.
5. **Memberships** — Stripe Billing + perk-gating logic.
6. **Tips + leaderboards** — Stripe (Connect) + per-artist/monthly ranking.
7. **Charts** — computed from real play/purchase/tip events.
8. **Artist uploads** — upload + review/approval + moderation.
9. **Persistent jukebox with continuous audio** — needs an SPA shell (the
   "jukebox problem" — see README).

**Non-technical prerequisites that gate the money features:** a business entity +
bank account, Stripe account, DMCA agent registration, Terms/Privacy/artist
agreement, sales-tax handling, and the trademark decision below.

---

## Hard constraints — do not violate

1. **Never name or profile the unidentified people in the photos.** No photo in
   the asset set is identified or cleared; NJ has a right of publicity. Only Guy
   Daniel Vastola is named. If asked to "write bios for the people in the pics,"
   produce labelled placeholders and say what's needed — do not invent identities.
2. **The studio client list (Cher, Springsteen, Sambora, etc.) is City Lights'
   own recording credits — NOT the Tune2This roster.** It lives on the studio
   page framed as the studio's claims. A label implying it represents those
   artists is a misrepresentation. (The Chi-Lites + Denroy Morgan are the
   exception only because they genuinely feature on The GDVO's record.)
3. **Tips + tax:** never say "tax-free tips" in fan-facing copy. The 2026
   qualified-tips rule is a deduction for the artist receiving tips (musicians
   are eligible, up to $25k), not a blanket exemption — say "may qualify, check
   your accountant." See `PROMO-artist-tipping.md`.
4. **Keep excluded assets out:** the `people` image group, the `awards-hallway-pan`
   and `woodwind-overdub-session` videos, and everything from `review-before-use/`
   in the original asset set are held for rights reasons.

---

## Open decisions blocking a real launch (need Guy)

- **⚠ Name/trademark collision:** another active music-media brand already uses
  "Tune2This" in the same genre (a YouTube channel + Facebook group). Settle this
  (clearance search + trademark attorney) **before** putting marketing spend
  behind the name. The identity is deliberately cheap to re-skin (6 CSS vars +
  one logo SVG in `build.sh`).
- **What "discount on City Lights studio time" means** mechanically (%, fixed
  hours, who validates, whose margin) — the one benefit tying label to studio.
- **Roster:** ~12 artists were briefed; 1 exists. Each needs name, photo, bio,
  master, artwork, split sheet.
- **Who controls the masters** (Dance Plant Records / Chisound) before selling.
- **Prices for the top two membership tiers** ($5 floor is the only set number).
- **Canonical address string** — GoDaddy/Facebook say "State Route 33", site says
  "Hwy 33 West"; pick one and make every directory match.
- **Logo direction** — orange skyline wordmark vs serif "LC City Lights".
- **Music News** — who writes/approves/how often.

---

## Accounts & links quick reference

- Repo: https://github.com/teknowmusic/tune2this-demo
- Live: https://tune2this.com · https://tune2this-demo.pages.dev
- GDVO: Spotify/Apple/YouTube (@thegdvo2762) · City Lights YouTube (@guydaniel1299)
  · Facebook facebook.com/CityLightsRecordingStudio · IG @guy_daniel_city_lights
- Cloudflare Pages project: `tune2this-demo` (account Jperezmusic@gmail.com)
- Registrar: GoDaddy (domain owner: Guy Vastola)
