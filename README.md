# Valerie · Conversational AI prototype

This is a clickable prototype of the Valerie chat for the skincare category and the brand Bespoke. It is built with React, TypeScript, Tailwind and Vite. It runs on your laptop, and you can deploy it as a link for leadership.

## Run it on your laptop

You need Node.js 20 or newer. Check your version by running `node -v` in Terminal.

```bash
npm install      # first time only
npm run dev      # open the http://localhost:5173 link it prints
```

## Versions for leadership

The same product and the same answers, with a different Aura (Valerie's character) and Home layout, so leadership can compare them side by side. Every link below works in each version: put its prefix in front of the path. The Valerie logo opens `/versions`, with all four on one page.

| Version | Aura | Home | An answer |
| --- | --- | --- | --- |
| **v1** | Solid acrylic: the mark as two thick pieces of clear blue acrylic, in 3D | `/v1/` (questions in pairs under the composer) | `/v1/chat/hear-the-buyers?state=answer` |
| **v2** | Constellation: the Valerie sparkle drawn in data points | `/v2/` (lens tabs, full questions) | `/v2/chat/hear-the-buyers?state=answer` |
| **v3** | Mark orb: the white mark on a navy sphere (v1 until 28 Oct) | `/v3/` (questions under the composer) | `/v3/chat/hear-the-buyers?state=answer` |
| **v4** | Hologram: stacked slices that fan out (preferred) | `/v4/` (questions beside the composer) | `/v4/chat/hear-the-buyers?state=answer` |

`/` and links without a prefix land in v1; old `/constellation/…` links in v2. Links inside each version stay in it. While Valerie works, Aura changes form next to a single shimmering line naming the step; the skeleton shows only in the last moments before the answer. `?state=working` shows that first stage.

## Screens and links you can share

| What | URL |
| --- | --- |
| Home | `/` |
| An answer, played live (steps, then answer, then chart) | `/chat/category-talk` |
| An answer, already finished | `/chat/category-talk?state=answer` |
| The "working" state, frozen | `/chat/category-talk?state=working` |
| A long thread (3 answers, "Jump to latest") | `/chat/category-talk?state=answer&turns=whitespace,hear-the-buyers` |
| An answer that stops at a step (with Retry) | `/chat/category-talk?state=error` |
| An answer whose chart failed (text kept) | `/chat/where-bespoke-sits?state=chart-error` |
| Offline strip above the message box | add `offline=1`, e.g. `/chat/hear-the-buyers?state=answer&offline=1` |
| Any screen inside the dashboard shell | add `shell=dashboard`, e.g. `/?shell=dashboard` |
| Aura lab: tune the metal by eye, Copy preset into `src/lib/aura.ts` (not linked from the product) | `/lab` |
| Sound on for this link (the speaker pill turns it on or off; the choice is remembered) | add `sound=1`, e.g. `/?sound=1` |
| Valerie speaks in another voice (nicky, aaron, martha, arthur, catherine, samantha; Nicky by default). With sound on, Valerie says the tagline on Home, reads each new headline and offers the follow-up; tap Aura to hear it again | add `voice=martha`, e.g. `/?sound=1&voice=martha` |
| Mascot options for leadership: Version A (Hexagon · Liquid chrome) and Version B (Constellation) next to Cloud · Liquid chrome, Hexagon · Polished chrome and Cloud · Soft, with expressions and the six voices | `/lab?view=character` |
| Aura docked in the message box (working, scrolled away from the answer) | `/chat/category-talk?state=working&turns=whitespace,hear-the-buyers` |
| Old blur-in lead, to compare with the two-tone lead | add `lead=blur` to a live answer, e.g. `/chat/hear-the-buyers?lead=blur` |

The chat ids are:

- `category-talk`
- `where-bespoke-sits`
- `what-cant-be-measured`
- `whitespace`
- `growth-numbers`
- `hear-the-buyers`

Other things you can try:

- **Typing a question.** It is matched to the closest of the six answers, and the answer is added to the same thread.
- **Chats** and **View traces** (the pulse icon, top right). These open drawers on the right; the + beside Chats starts a new chat.
- **Persona picker.** It sits in the message box. Switching persona after an answer adds a divider in the thread. Brie's steps show what Valerie did without the tool calls. To open a chat already tuned for Brie, add `persona=brie`.
- **Dark mode.** Use the moon button in the header.

## For the leadership room

- **Before/after slides** (16:9, 3840×2160): `docs/aura/slides/`: Home, Answer, Chart, Working, and Home and Answer in dark. The screens they pair are in `docs/aura/before/` and `docs/aura/after/` (1440×900).
- **Version A vs Version B slides** (16:9, 3840×2160): `docs/aura/slides-ab/`: Home, Answer, Working, Home and Answer in dark, and Aura up close. The screens are in `docs/aura/after/` (A) and `docs/aura/after-b/` (B).
- **Video backup** (28s, 1920×1200, with Valerie's voice): `docs/aura/valerie-demo.mp4`. One send from Home: the greeting, the flight, working, the headline read aloud as it inks, and the follow-up offer. It plays in QuickTime and Keynote, in case the room's laptop or Wi-Fi misbehaves.
- **Where the work stands** and what's waiting on a decision: `docs/STATUS.md`.
- **After a change** (a new voice, an edited headline), re-record and re-render:
  - `tools/voice/record.sh` records every line in all six voices, or one: `tools/voice/record.sh martha`.
  - `tools/video/render.sh` renders the video again; `VOICE=martha tools/video/render.sh` for another voice. It takes about 5 minutes and needs Google Chrome and `npm i --no-save playwright-core` once.

## Where things live

```
src/
  data/                 ← edit text and numbers here (no code knowledge needed)
    site.ts             dataset stats, tagline, placeholder
    personas.ts         Milo, Brie
    prompts.ts          the six questions, steps, footnotes, follow-ups
    answers.ts          each answer: headline, 3 key figures, paragraphs, lists, quotes, caveat
    charts/*.ts         numbers behind each chart card
  components/
    chat/               message box, header, answer, steps, persona picker
    charts/             the dashboard charts, shown in answers as a simple card (title, chart, legend) in the 720px column
    drawers/            Chats and Traces drawers
    layout/AppShell.tsx standalone header, or the dashboard stand-in (?shell=dashboard)
    brand/              Valerie logo, Aura (the liquid-chrome hexagon with a face; stills and masks in public/aura), Mascot rig
    ui/                 Button, Badge, Sheet (drawer), Toast
  styles/index.css      design tokens (colours from the Valerie DS, DM Sans)
docs/
  DATA.md               every number we changed from the Figma / live data
  STATUS.md             what's done, what's waiting on you
  aura/                 before/after screens and slides, the demo video
public/voice/           Valerie's recorded lines, one folder per voice
tools/
  voice/                records Valerie's lines with the macOS voices
  video/                renders the demo video frame by frame
```

## Deploy (password protected)

The site is hosted on Cloudflare Pages (free), and a password page sits in front of it (`functions/_middleware.js`). Step-by-step instructions are in `docs/DEPLOY.md`. In short:

```bash
npm run deploy         # build and upload (the first run asks you to log in to Cloudflare)
npm run set-password   # set or change the password (one time)
```

Search engines are blocked with `robots.txt` and a `noindex` meta tag.

## Working with Claude Code

Open this folder in Cursor and start Claude Code. It reads `CLAUDE.md` for the project rules.
