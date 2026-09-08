# Tune2This — demo build

A working demo of **Tune2This**, the label/artist-platform side of **City Lights Recording
Studio**, 1299 Highway 33 West, Farmingdale NJ.

Static HTML, no framework, no backend. Everything runs from GitHub Pages.

> **This is a demo, not a storefront.** No payments are processed anywhere. Forms have no
> backend and say so when submitted. No card, bank or personal data is collected.

---

## Run it

```bash
bash build.sh
```

That regenerates the root `*.html` pages from `src/*.html`. Open `index.html`, or serve the
folder over HTTP if you want the video and embeds to behave exactly as they do live.

**Edit `src/*.html`, never the generated root `.html` files** — the build overwrites them.
Shared header, footer, nav, `<head>` and the docked player all live in `build.sh`.

```
build.sh            shared chrome + generator
src/*.html          one body fragment per page, with a TITLE/DESC/NAV block on top
assets/site.css     all styling
assets/site.js      nav, reveals, tip picker, demo forms
assets/player.js    the docked player
data/catalog.js     THE CONTENT SOURCE — artists and tracks
img/  video/        73 images and 7 clips from the City Lights asset set
```

---

## What is on it

| Page | What it is |
|---|---|
| `index.html` | Home — hero, live rotation, featured artist, video, membership, tipping, the studio |
| `radio.html` | The curated rotation, plus the empty slots waiting on masters |
| `artists.html` | Roster grid — one real artist, five honestly-empty slots |
| `artist-gdvo.html` | Full artist profile: bio, catalogue, Spotify + YouTube, tipping, credits |
| `membership.html` | Three fan tiers, the tipping ladder, the Big Spender portal, member vs artist profiles |
| `for-artists.html` | Artist profile pitch **and the payments recommendation** |
| `videos.html` | Artist videos and studio footage |
| `news.html` | Music News (was "WORD") — one real story, the rest scoped |
| `studio.html` | City Lights: rooms, gear, client credits, booking |
| `contact.html` | Address, hours, contact form |

---

## The music is real

Everything about the featured artist was verified against Apple Music, Spotify and the
January 2021 press. Nothing was invented.

- **The GDVO** = The Guy Daniel Vastola Organization. Guy Daniel: singer, songwriter, producer.
- **"Peace"** — written by Guy Daniel, featuring **The Chi-Lites** and the late
  **Denroy Morgan**. Recorded between City Lights in New Jersey and Chicago. Released
  20 January 2021 as the debut single of **Chisound Music Group**, timed to launch a global
  peace campaign.
- **"Peace (The Instant Philly Funk Mix)"** — single, released 22 August 2025,
  ℗ 2025 **Dance Plant Records Inc.**, R&B/Soul, 3:00.
- Both The Chi-Lites and Denroy Morgan also appear on City Lights' own client list. That
  overlap is genuine and it is the best story on the site.

Audio plays through the rights holders' own **official Spotify and YouTube embeds** — the
only lawful way to have real audio in a demo. See "The jukebox problem" below.

---

## The jukebox problem

The brief asked for a jukebox that stays with you as you move around the site. What is built:
a transport docked to the bottom of every page that **restores its queue and playhead from
`sessionStorage` on the next page load**. Play a track on the home page, click through to the
artist page, and the deck is still there at the right position — verified working.

What that still is not: gapless audio *across* a page load. Nothing can do that on a
multi-page site. Audio that genuinely never stops needs a single-page app shell, and that one
requirement should drive the stack choice more than any theme does. `player.js` is written so
that swapping in an SPA shell later means replacing the persistence layer and nothing else.

Every track in `data/catalog.js` has an `audio` field, currently `null`. Put an MP3 URL in it
and the same deck streams it for real. Nothing else changes.

---

## Payments: do we need a banking setup to sell downloads?

**Not on day one.** Recommendation in three phases.

### Phase 0 — launch on Bandcamp links (now)

Bandcamp takes 15% of digital sales, dropping to 10% after $5,000. In exchange it is the
**merchant of record**, which means it owns sales tax and VAT liability, file delivery,
receipts, refunds and download re-access. Its 2026 payout system runs on Stripe with no payout
fee, in 135+ currencies, paid daily, weekly or monthly, and label accounts pay the label and
the artist directly.

Tune2This is the shop window; Bandcamp is the till. You could be taking money this week with
zero build and zero liability.

### Phase 1 — Stripe Connect (when sales are on your own site)

Connect is the marketplace standard. It splits a single payment between platform and artist
automatically, onboards artists with their own identity and bank details so you never hold
them, pays out in 50+ countries, and **files and delivers 1099s** for US sellers over $600 a
year. Memberships and the studio discount can hang off the same customer record.

The catch: Stripe is **not** merchant of record. Sales tax on digital goods stays your problem
in every jurisdiction you sell into.

### Alternative — a merchant of record (~5%)

Paddle, Lemon Squeezy or FastSpring become the legal seller and carry tax liability worldwide.
Roughly double Stripe's fee, and you buy back an entire compliance function. Their marketplace
split support is weaker than Connect's — check it before committing.

### The $0.99 problem — read before setting prices

A card processor charges about **2.9% + $0.30**. On a $0.99 track the fixed 30¢ alone is
**~33% of the sale** before anyone is paid. On a $9.99 basket it is under 6%.

So 99¢ singles only work if you push people into a basket: make bundles the default, set a
minimum cart, or sell a prepaid wallet. This is also the strongest argument for Phase 0 —
Bandcamp's 15% on a single 99¢ sale beats a raw card fee comfortably.

### Sequencing

1. **Bandcamp links first.** Prove people buy before building a checkout.
2. **Memberships next, not sales.** Recurring revenue on plain Stripe Billing is far simpler
   than a marketplace, and the membership is where the real margin is.
3. **Connect only when splits genuinely hurt.** Let the pain justify the build.
4. **Tips on Connect from day one of Phase 1** — no goods, no delivery, straight to the artist.

---

## Membership and tipping — what the research says

Benefits on `membership.html` were chosen against direct-to-fan research, not invented:

- **Early access is the strongest single driver.** Unmet superfan demand for exclusive content
  and behind-the-scenes access is estimated at ~$2.6bn a year in additional spend.
- **The process retains better than the product.** What subscribers actually ask for is
  songwriting sessions, production breakdowns and mix decisions. City Lights already runs
  cameras in the control room, so this is close to free to produce.
- **Purchase and membership are different instincts.** A buyer has already decided they want
  the object; hesitation is low. Keep a store alongside the membership to catch people who
  will never subscribe.
- **Belonging beats another content drop.** Credits, badges, boards and votes put a fan's name
  somewhere permanent, and that does more retention work than volume.
- **Studio time is the moat.** No other platform can offer an hour on a Neve VR60. This is why
  the label and the studio should share one account system rather than trading coupon codes.

### Tipping

A tip button is a donation; a tip **board** is a competition. Tencent Music takes roughly 70%
of its revenue from tips, gifts and donations rather than subscriptions, because fans can see
where they stand. Gamified fan platforms (Weverse, Fave, Loop Fans) all run on the same
mechanic.

The ladder: **Listener** (free) → **Roadie** ($5+) → **Session Player** ($25+) →
**Headliner** ($100+) → **Big Spender** ($500+). Rank is per artist, resets monthly with an
all-time column, and a supporter can go anonymous without losing their position.

### ⚠ On tips and tax — get the wording right

The IRS final rule of 10 April 2026 does list **musicians, singers and digital content
creators** among the occupations eligible for the qualified-tips deduction, up to **$25,000 a
year**. But:

- it is a **deduction against federal income tax for the artist receiving the tip**;
- it is **not** a blanket exemption and does **not** remove self-employment tax;
- it phases out at higher incomes;
- it does **nothing** for the person sending the tip.

So it can be said to artists as *"tips may qualify"* with a line telling them to check with
their accountant. It must **never** appear as "tax-free" anywhere a fan can read it. Have an
accountant sign off the exact wording before launch.

---

## Rights and what was deliberately left out

Decisions made while building this, all of them reversible once Guy supplies what is missing:

- **No identified people.** No photograph in the asset set carries a name or written
  permission, and New Jersey recognises a right of publicity. The only person named on the
  site is Guy Daniel — the owner, and the client. The `people` group was excluded from this
  repo entirely.
- **No invented bios.** Bios were requested for "the artists in the pictures". Those people
  are unidentified, so writing biographies for them would mean inventing identities. The
  roster grid shows honest empty slots instead.
- **The client list is not a roster.** Cher, Springsteen, Sambora and the rest are *City
  Lights recording credits* and live on `studio.html`, framed as the studio's own claims. A
  label implying it represents those artists is a problem no disclaimer fixes.
- **Two videos held back.** `awards-hallway-pan` (Danny Aiello poster in frame) and
  `woodwind-overdub-session` (identifiable player) are not in this repo.
- **Nothing from `review-before-use/`.** The Mix Magazine covers, the 1955 Cash Box page and
  the Jack Douglas scan are all parked for copyright or identification reasons.
- **Bunny Sigler**, not Siegler. The studio's own site has it wrong.

---

## Open decisions — these block a launch, not a demo

**Blocking on Guy**

1. **What "discount on City Lights studio time" means.** Percentage or fixed hours? Off what
   number, when rates are quote-only? Who validates a member at the studio? Whose margin
   absorbs it? This is the one benefit tying the two businesses together and it is completely
   unspecified. Everything else on the membership page can be designed around; this cannot.
2. **The roster.** ~12 featured artists were briefed. Right now there is one. Each slot needs
   a name, photo, bio, master, artwork and a signed split sheet.
3. **Who controls the masters.** The funk mix is published under Dance Plant Records Inc.; the
   original came through Chisound Music Group. Tune2This cannot *sell* either download until
   ownership and publishing are clear and a split sheet exists. The streaming embeds on the
   site are fine either way — they play from the rights holder's own account.
4. **Prices for the top two tiers.** $5 is the only number set. $15 and $50 are proposals.
5. **Names and written permission** for every identifiable person in any photo we publish.
6. **The canonical address string**, then propagate it identically to Google Business Profile,
   Facebook, Yelp, Apple Maps and every directory. Facebook says "1299 State Route 33"; the
   website says "1299 Hwy 33 West". Inconsistent NAP is the most common cause of weak local
   ranking and this business has it right now.
7. **Logo direction** — the orange skyline wordmark or the serif "LC City Lights" mark. Both
   are currently in use and they are different identities.
8. **Music News**: who writes it, who approves it, how often. A news section that goes quiet
   signals a dead site more loudly than no news section at all.

### ⚠ The name collision — settle this before any branding spend

**A different active brand already uses "Tune2This" in the same industry.** There is a YouTube
channel described as "The Latest Videos, Interviews, And More From Tune2This.com" publishing
hip-hop interviews and cyphers, plus a Facebook group under the same name. The Instagram
handle `@tune2this` exists but is dormant.

A record label operating under a name another music-media brand already uses, in the same
genre space, is a trademark problem rather than a cosmetic one. It also means the search
results for "Tune2This" are already occupied by someone else's back catalogue.

Guy should confirm he owns that prior brand, secure the name properly, or pick a different
one. **Do not commission logo, print or domain work until this is settled.** The visual
identity in this demo is deliberately cheap to re-skin: the palette is six CSS custom
properties at the top of `assets/site.css`, and the wordmark is one inline SVG in `build.sh`.

---

## Design notes

The palette comes out of the photographs rather than off a mood board. City Lights shoots at
night, lit teal and red on purpose, with tungsten-warm rooms:

| Token | Value | Source |
|---|---|---|
| `--cl-orange` / `--neon` | `#E2552F` | City Lights brand mark (`assets-manifest.json`) |
| `--highway` | `#F5C518` | Highway 33 road striping, per the brief |
| `--teal` | `#45B3C0` | the lit studio entrance in the exterior shots |
| `--black` | `#0A0A0B` | every exterior in the set is a night shot |

Type is Instrument Serif for display and Inter for text, with DM Mono for the mono labels.
The dashed yellow centre-line divider (`.stripe`) is the Highway 33 motif the brief asked for,
used as punctuation rather than decoration.

Images are served as `<picture>` with WebP `srcset` and JPEG fallback, with explicit
`width`/`height` on every one to stop layout shift. Nothing was re-compressed — the asset set
arrived already processed.

---

## Known limits

- **Resolution ceiling.** Most sources are ~1024px wide because they came through WhatsApp or
  Facebook. A handful reach 2048px. Nothing was upscaled. A full-bleed hero at 2560px needs
  original camera files from Guy.
- **No daytime exterior of the building exists.** Every exterior shot is at night. One phone
  shoot fixes it.
- **No Lounge City Studio photos exist**, despite it being the newest room and the current
  hero on the live City Lights site.
- **Screen-reader pass not done.** Structure, landmarks, focus states, `aria-current` and
  keyboard operation of the player are in place; a real audit is not.
- **Forms are inert by design.** No backend, no data collection, no payment fields anywhere.

---

Built from `DEVELOPER-HANDOFF.md` and the `assets-manifest.json` asset set.
