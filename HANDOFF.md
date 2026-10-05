# Tune2This: handoff to Guy (City Lights)

**For:** Guy Daniel Vastola, and the AI assistants (Claude Code, ChatGPT) running on
his laptop.
**From:** Jose Perez (built it), October 2026.
**Goal:** move everything from Jose's accounts to Guy's, without the site going down.

> **AI assistants, read this first.** Also read `CLAUDE.md` in this repo. It's the
> project manual, with rules you must follow (rights, names, tax wording).
> **Never type a password, 2FA code or recovery code into anything.** Guy types his
> own credentials and clicks every "Authorize", "Install" and "Accept" button.
> **Stop and ask Guy before you change nameservers at GoDaddy.** That's the moment
> the site switches over.

---

## Where things are now, and where they're going

| Piece | Now (Jose) | Target (Guy) |
|---|---|---|
| Code | `github.com/teknowmusic/tune2this-demo` | `github.com/city-lights-studios/tune2this-demo` |
| Hosting | Cloudflare Pages project `tune2this-demo` on Jose's Cloudflare | New Pages project on Guy's Cloudflare (`citylightsrecordingstudio@gmail.com`) |
| DNS for tune2this.com | Zone on Jose's Cloudflare (nameservers `braelyn` / `nero.ns.cloudflare.com`) | Zone on Guy's Cloudflare (its own nameserver pair) |
| Domain registration | GoDaddy, already Guy's | No change |
| Jose's access | Owner | Collaborator on GitHub (optional member on Cloudflare) |

The site is a static demo: plain HTML/CSS/JS, no database, no secrets, no build
tool. Moving it is all account plumbing; nothing needs to be rebuilt.

**Current live addresses:** https://tune2this.com and https://tune2this-demo.pages.dev

---

## The steps

Do them in order. Each step says **where** it happens and **who** acts.

### Step 1: Transfer the repo (Jose's side)
*Jose's machine. Only the current owner can start this.*

```bash
gh api repos/teknowmusic/tune2this-demo/transfer -f new_owner=city-lights-studios
```

GitHub emails a transfer request to the address on the `city-lights-studios`
GitHub account. **Guy opens that email and clicks Accept.** History and files come
across intact, and the old URL redirects to the new one.

What happens to the live site: it keeps serving its last version. Jose's
Cloudflare just stops auto-updating, because it can no longer see the repo.
That's expected.

### Step 2: Set up Guy's laptop
*Guy's laptop. Guy logs in.*

1. Install **Git** and the **GitHub CLI** (on Windows: `winget install Git.Git GitHub.cli`).
2. `gh auth login` → GitHub.com → HTTPS → login with a web browser. **Guy** finishes
   the browser step as `city-lights-studios`.
3. Turn on **two-factor authentication** for the GitHub account (Settings → Password
   and authentication). GitHub requires it.
4. Clone the repo: `gh repo clone city-lights-studios/tune2this-demo`
5. Add Jose back so he can still help:
   `gh api -X PUT repos/city-lights-studios/tune2this-demo/collaborators/teknowmusic -f permission=push`
   (Jose accepts the invite on his side.)

### Step 3: Create Guy's Cloudflare Pages project
*Browser on Guy's laptop, logged into Cloudflare as `citylightsrecordingstudio@gmail.com`.*

1. Compute → **Workers & Pages** → Create → **Pages** → **Import an existing Git repository**.
2. **Connect GitHub.** This opens GitHub to install "Cloudflare Workers and Pages".
   Pick the `city-lights-studios` account → **Only select repositories** →
   `tune2this-demo` → **Install & Authorize**. *(Guy clicks this. If GitHub asks
   for his password to confirm access, Guy types it.)*
3. Pick the repo → **Begin setup**:
   - **Project name:** `tune2this`. It can't be `tune2this-demo`, because Jose's
     project still holds that name. If `tune2this` is taken, any name works.
   - **Production branch:** `main`
   - **Framework preset:** None · **Build command:** *(empty)* · **Build output directory:** `/`
4. **Save and Deploy.** When it finishes, open the `….pages.dev` address it gives
   you and check the site loads.

### Step 4: Add the domain to Guy's Cloudflare
*Same browser, Guy's Cloudflare.*

1. Account home → **Add a domain** → `tune2this.com` → Continue → **Free** plan.
2. It imports the current DNS records. That's fine, leave them → Continue to activation.
3. Cloudflare shows **two nameservers** for Guy's account. They'll probably differ from
   Jose's `braelyn` / `nero`. **Write both down.**

### Step 5: Switch the nameservers at GoDaddy (the cutover)
*GoDaddy, logged in as Guy. **Confirm with Guy before you click Save.***

1. GoDaddy → My Domains → `tune2this.com` → **DNS** tab → **Nameservers** sub-tab →
   **Change Nameservers**.
2. **I'll use my own nameservers** → enter the two from Step 4 → **Save** → **Continue**.
3. GoDaddy shows "request in progress". Propagation usually takes minutes and can
   take up to 24–48 hours.

**Rollback:** if anything goes wrong, set them back to `braelyn.ns.cloudflare.com`
and `nero.ns.cloudflare.com`. That only works until Jose deletes his copy in Step 7,
which is why Step 7 comes last.

### Step 6: Attach the domain to Guy's Pages project
*Guy's Cloudflare.*

1. Workers & Pages → the new project → **Custom domains** → **Set up a custom domain**
   → `tune2this.com` → **Activate domain**. Cloudflare swaps the old records for a
   CNAME pointing to the project.
2. Repeat for `www.tune2this.com`.
3. Wait until both show **Active**. SSL is automatic.
   *If Cloudflare says the domain is already in use, ask Jose to remove it from his
   project's Custom domains, then retry.*

### Step 7: Clean up Jose's side (only after Step 6 shows Active)
*Jose's machine and Jose's Cloudflare.*

1. Jose's Cloudflare → Workers & Pages → `tune2this-demo` → Settings → **Delete project**.
2. Jose's Cloudflare → Domains → `tune2this.com` → **Remove** (it should already say "Moved").
3. GitHub (repo now Guy's) → Settings → **Pages** → turn off GitHub Pages. The old
   `teknowmusic.github.io` mirror stopped working at transfer anyway.
4. Optional: on Jose's GitHub, Settings → Applications → uninstall "Cloudflare Workers
   and Pages" if nothing else uses it.

### Step 8: Update the docs and prove auto-deploy works
*Guy's laptop, in the cloned repo.*

1. Edit `CLAUDE.md`: in **How it's hosted / deployed**, change the repo to
   `city-lights-studios/tune2this-demo`, the Cloudflare account to
   `citylightsrecordingstudio@gmail.com`, the project name and `.pages.dev` address to the
   new ones, and the nameservers to Guy's pair. Remove the "HANDOFF WARNING" box.
   Also update the "Accounts & links" section at the bottom.
2. `bash build.sh`, then commit and push:
   ```bash
   git add -A && git commit -m "Docs: hosting now on Guy's accounts" && git push
   ```
3. In Guy's Cloudflare → the project → **Deployments**, a new deploy should appear
   within a minute. That proves the whole pipeline is Guy's.

---

## Final checklist

- [ ] Repo lives at `github.com/city-lights-studios/tune2this-demo`
- [ ] Jose is a collaborator
- [ ] Guy's Pages project deploys on push
- [ ] `https://tune2this.com` and `https://www.tune2this.com` load, with the padlock
- [ ] Jose's Pages project and zone are deleted
- [ ] GitHub 2FA is on for `city-lights-studios`; 2FA is on for GoDaddy and Cloudflare
- [ ] `CLAUDE.md` describes Guy's accounts, not Jose's

---

## What's still open (not part of the move)

These carry over unchanged. Details are in `PHASE-0.md`, `CLAUDE.md` and `README.md`.

- **Phase 0 leftovers:** a Formspree endpoint for real form delivery (`data/config.js`),
  and a Bandcamp/Gumroad store for selling, **after a rights check** on the masters
  (Dance Plant Records / Chisound).
- **The name:** another music-media brand already uses "Tune2This". Settle the
  trademark question before spending money promoting it.
- **Phase 1:** real accounts, payments, memberships and tips. See the roadmap in `CLAUDE.md`.
