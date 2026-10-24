# Project context for Claude Code

This is a clickable prototype of **Valerie**, an AI analyst chat for the skincare category and the brand **Bespoke**. It is used to show leadership the redesigned "Conversational AI" page. It is a front-end prototype only: there is no backend, and all answers come from `src/data`.

## Hard rules

1. **Keep the chat free of navigation chrome.** In production it sits inside the Valerie dashboard, which already has a dark sidebar and a breadcrumb header, and it may ship later as a standalone agent.
   - The chat only owns its own row: title, New chat, View traces, Chats.
   - `AppShell` only *simulates* the host (`?shell=dashboard`).
2. **Use colours only from the tokens** in `src/styles/index.css`. These are the Valerie DS: slate neutrals plus the `brand-*` navy scale. Amber `brand-accent` is used only in the logo. Never hard-code a hex in a component, except the chart series colours that live in `src/data/charts`.
3. **Use DM Sans only.** Never use monospace, including in traces.
4. **Don't redesign the chart cards.** They mirror existing dashboard cards. Change their data or their width, not their look.
5. **Don't invent copy.** Every visible word comes from the live product or `src/data`. Avoid helper text or filler labels.
6. **Keep text and numbers in `src/data`.** If a number changes in an answer (`prompts.ts`), change it in the matching chart file too, and log it in `docs/DATA.md`.
7. **Desktop first, at 1440 wide.** The text column is 720px, and charts break out to 960px.

## Answer anatomy (`components/chat/AnswerView.tsx`)

1. The user's question.
2. A header: Aura orb, "Valerie", the time taken, and a steps pill that expands to the step list.
3. The lead, shown as the headline.
4. The body.
5. The chart.
6. The source row: lens badge and footnote.
7. Icon actions: copy, up, down, regenerate.
8. The follow-up offer and chips.
9. The docked composer.

## Commands

- `npm run dev`: local server.
- `npm run build`: type-check, then build to `dist/`.

## Figma reference

File `LY0YbZF2Egxak797VEtqDG` (AI-chat-screen):

- "Stage 2 v3 · Chat content" (node 85:36103) is the wireframe.
- "Chart Set #1" (58:20661) and "Chart set #2" (58:8024) are the chart originals.
