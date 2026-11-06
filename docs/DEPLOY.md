# Put the prototype online

## Netlify or Vercel (no password)

Both upload straight from this folder; no GitHub. Everything lives on one link: the main design at `/`, and the four archived versions at `/archive/v1` (Solid acrylic), `/archive/v2` (Constellation), `/archive/v3` (Mark orb) and `/archive/v4` (Hologram), listed at `/archive`. Old `/v1`–`/v4`, `/constellation` and `/versions` links forward there.
Nothing is listed or announced anywhere, and every file tells search engines to stay out.

| | First time | Every update |
| --- | --- | --- |
| Netlify | `npx netlify-cli login`, then `npm run deploy:netlify` → **Create & configure a new project** → pick your team → name it | `npm run deploy:netlify` |
| Vercel | `npx vercel login`, then `npm run deploy:vercel` → set up and deploy: **Y** → your account → link to existing: **N** → name it → directory `./` → modify settings: **N** | `npm run deploy:vercel` |

Share the short production link the deploy prints (`https://<name>.netlify.app`, `https://<name>.vercel.app`). On Vercel, the long one-off deployment links ask for a Vercel login; the short one doesn't.

## Cloudflare Pages, behind a password

**Hosting:** Cloudflare Pages (free).
**Password:** a page run by Cloudflare before anything loads (`functions/_middleware.js`). Without the password, nobody sees the app or its data. A person stays signed in for 30 days on that browser.

**You need:** a free Cloudflare account (sign up at dash.cloudflare.com). You deploy straight from this folder.

## First time (about 10 minutes)

In Cursor's terminal, in this folder:

```bash
npm install          # if you haven't since the last update
npm run deploy
```

1. The first run opens your browser to log in to Cloudflare. Approve it.
2. When asked to create a project, accept the name `valerie-chat` and choose `main` as the production branch.
3. When it finishes, it prints a link like `https://valerie-chat.pages.dev`. At this point the site is **open**, because no password is set yet.

Now set the password:

```bash
npm run set-password
```

Type the password when prompted, then run `npm run deploy` once more so it takes effect. Open the link: you should see the Valerie sign-in page.

## Every update after that

```bash
npm run deploy
```

The same link updates within a minute.

## Change the password

Run `npm run set-password`, then `npm run deploy`. Everyone has to sign in again with the new password.

## Links worth sending

| What | Link |
| --- | --- |
| Home | `https://valerie-chat.pages.dev/` |
| Inside the dashboard frame | `https://valerie-chat.pages.dev/?shell=dashboard` |
| An answer playing live | `https://valerie-chat.pages.dev/chat/hear-the-buyers` |

Cloudflare may give the project a slightly different address if `valerie-chat` is already taken. Use the one the deploy prints.

## If something goes wrong

- **"wrangler: command not found":** run `npm install` first. Node 20+ is required.
- **The password page doesn't appear:** set the password, then deploy again. A password only applies to deploys made after it was set.
- **A blank page on a sub-link:** check that `public/_redirects` exists. It sends every route to the app.
