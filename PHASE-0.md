# Phase 0 — make the demo testable

The code side is **done** (forms deliver; buy buttons link to a real purchase
page). What's left needs Jose/Guy's own accounts and one rights decision.

---

## A. Turn on real form delivery (Formspree) — DONE Oct 2026 (form mzedbnvl, Guy's Formspree)

1. Go to **formspree.io** and sign up (free tier = 50 submissions/month).
2. Create a new form; set the destination email
   (`CityLightsRecordingStudio@gmail.com`, or a shared inbox — see C).
3. Copy the form endpoint. It looks like: `https://formspree.io/f/xxxxxxx`
4. Paste it into **`data/config.js`** → `formEndpoint` (then `bash build.sh`,
   commit, push — or ask Claude to do it).
5. Submit the Contact form once, approve Formspree's first-time confirmation
   email, and confirm the test message lands in the inbox.

Until this is set, the forms open the visitor's email app (mailto) — still
testable, just not inbox delivery.

---

## B. Set up a real store to sell downloads

1. Pick **Bandcamp** (music-focused, merchant-of-record so it handles sales tax,
   ~15%) or **Gumroad** (general-purpose, simple).
2. **RIGHTS CHECK FIRST:** confirm you can legally sell the masters. "Peace" is
   released under **Dance Plant Records / Chisound** — clear ownership/publishing
   before listing anything for sale.
3. Create the store; upload the track(s); set prices ($0.99 track / $2.99 bundle).
4. Copy the product URLs.
5. Point the buy buttons at them (edit these two files, then build + push):
   - `src/index.html` → the **"Get the single"** button
   - `src/artist-gdvo.html` → the **"Get both mixes"** button

---

## C. (Optional) A real inbox instead of a personal Gmail

Set up `hello@tune2this.com` with **Cloudflare Email Routing** (free — forwards
to any inbox). Then point Formspree's destination and `config.js` `contactEmail`
at it, so form mail isn't tied to a personal account.

---

## D. Verify on the live domain

Once `https://tune2this.com` resolves (after the GoDaddy → Cloudflare nameservers
propagate): submit a form, click a Buy button, play a track, and load the site on
a phone.

---

## Reference

- Live now: https://tune2this-demo.pages.dev
- Live domain: https://tune2this.com (after nameserver propagation)
- Repo: https://github.com/teknowmusic/tune2this-demo
- Edit for forms: `data/config.js`
- Updates deploy automatically on every push to `main`.
- Bigger picture / Phase 1 roadmap: `CLAUDE.md` and `README.md`.
