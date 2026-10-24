# Valerie · Conversational AI prototype

This is a clickable prototype of the Valerie chat for the skincare category and the brand Bespoke. It is built with React, TypeScript, Tailwind and Vite. It runs on your laptop, and you can deploy it as a link for leadership.

## Run it on your laptop

You need Node.js 20 or newer. Check your version by running `node -v` in Terminal.

```bash
npm install      # first time only
npm run dev      # open the http://localhost:5173 link it prints
```

## Screens and links you can share

| What | URL |
| --- | --- |
| Home | `/` |
| An answer, played live (steps, then answer, then chart) | `/chat/category-talk` |
| An answer, already finished | `/chat/category-talk?state=answer` |
| The "working" state, frozen | `/chat/category-talk?state=working` |
| Any screen inside the dashboard shell | add `shell=dashboard`, e.g. `/?shell=dashboard` |

The chat ids are:

- `category-talk`
- `where-bespoke-sits`
- `what-cant-be-measured`
- `whitespace`
- `growth-numbers`
- `hear-the-buyers`

Other things you can try:

- **Typing a question.** It is matched to the closest of the six answers.
- **Chats** and **View traces.** These buttons open drawers on the right.
- **Persona picker.** It sits in the message box.
- **Dark mode.** Use the moon button in the header.

## Where things live

```
src/
  data/                 ← edit text and numbers here (no code knowledge needed)
    site.ts             dataset stats, tagline, placeholder, disclaimer
    personas.ts         Milo, Brie
    prompts.ts          the six questions, steps, answers, footnotes, follow-ups
    charts/*.ts         numbers behind each chart card
  components/
    chat/               message box, header, answer, steps, persona picker
    charts/             the six dashboard chart cards (keep their look, change data only)
    drawers/            Chats and Traces drawers
    layout/AppShell.tsx standalone header, or the dashboard stand-in (?shell=dashboard)
    brand/              Valerie logo, Aura orb
    ui/                 Button, Badge, Sheet (drawer), Toast
  styles/index.css      design tokens (colours from the Valerie DS, DM Sans)
docs/
  DATA.md               every number we changed from the Figma / live data
```

## Deploy

Run `npm run build` to produce a static `dist/` folder. Any static host works. The SPA rewrites are already set up for Vercel (`vercel.json`) and for Netlify and Cloudflare Pages (`public/_redirects`). Search engines are blocked with `robots.txt` and a `noindex` meta tag.

The plan doc has the hosting options and how to share the link.

## Working with Claude Code

Open this folder in Cursor and start Claude Code. It reads `CLAUDE.md` for the project rules.
