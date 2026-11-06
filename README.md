# Valerie · Conversational AI

This is a front-end prototype of the **Conversational AI** page in the Valerie dashboard: an AI analyst you can chat with about the skincare category and the brand Bespoke. It shows the approved design.

**Figma is the source of truth** for how the page looks: layout, spacing, type, colour and components. **The code shows how it behaves**: what happens on each click, how an answer streams in, the working state, the emblem's motion and the error states. Build the look from Figma, and use the prototype to see the behaviour.

There is no backend. The questions, answers, charts and traces are written by hand in `src/data`.

| | Link |
| --- | --- |
| Figma screens (source of truth; every state below) | [AI-chat-screen › section 166:41883](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=166-41883) |
| Live prototype (behaviour) | https://valerie-ai.netlify.app |
| Figma components used by the screens | [Components frame 173:218](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=173-218) |
| Answer designs (cards, type, spacing) | [Output 119:41560](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=119-41560) |
| Design system | Valerie Shadcn (DS Template), the Figma library |

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
```

## What the page does

- **Home.** Valerie's emblem sits beside a one-line greeting, with the composer under it and six suggested questions under that, two to a row. Five of them open an answer. "Check the growth numbers" has no answer design yet, so its card shows but can't be picked. The AI teammate (Milo or Brie) and the model are chosen in the composer; their menus are headed "AI teammates" and "Switch models".
- **A chat.** Each question starts a thread. While Valerie works, the emblem animates beside one line naming the current step; clicking the line opens the step list. The answer then streams in: a headline (lead), then paragraphs, then a chart card when the answer has one. Under it sit copy, thumbs up and down, regenerate, and follow-up chips.
- **The composer in a thread** is one row (+, text, mic, send). It grows to two rows when the text wraps, up to six lines. Under it, the AI teammate switch sits on the left and the model switch on the right. Switching either mid-chat adds a divider to the thread ("Now tuned for Brie", "Now answering with …").
- **Controls, top right.** Chats and New chat (+) share one capsule; View traces sits beside them. Both Chats and View traces open a sheet on the right. In Chats, a row can be deleted, with Undo in a toast. View traces is empty from Home; from a chat it lists the reply's steps and tool calls.
- **Brie's briefs.** Milo (Data Analyst) gets answers in the thread. Brie (Content Strategist) gets a document instead: when her brief is written, the chat steps into a column on the left (480px) and the brief opens in a panel on the right, in one reading column. Drag the handle between them to resize (360px for the chat at least, 520px for the brief; double-click resets; the width is remembered). The panel's toolbar has Save as report and Close. Save as report is a switch: a click turns it into "Saved" with a tick (the label slides, the button eases to its new width, the tick draws in), and another click turns it back. The thread keeps Valerie's line and a card that reopens the document. The brief's text is the live product's, word for word (`src/data/briefs.ts`). Only "Find where Bespoke sits" has a brief so far; Brie's other questions get the usual answer.
- **Errors.** An answer can stop at a step, with Retry. When the browser is offline, a strip above the composer says so.
- **Attachments.** The composer's + opens a menu with "Upload a file" (images, screenshots, video, audio and links will join it later). A chosen file shows as a card in the composer, first uploading (a spinner), then its name, type and size, with a remove ×. Once sent, the card sits above the question in the thread. The prototype only shows the file; nothing is read or uploaded.
- **Typed questions** are matched to the closest of the five answers. Anything else gets chips to pick one of them.

## States: Figma ↔ code

Each Figma screen and how to open the same state in code (`localhost:5173` or the live link):

| Figma screen | In code |
| --- | --- |
| [01 · Home](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=166-41926) | `/` |
| [02 · Home · Typing](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=175-644) | `/`, then type in the composer |
| [03 · Chats](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=175-977) | `/`, then **Chats** |
| [04 · View traces · Empty](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=175-1106) | `/`, then **View traces** |
| [05 · Working](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=180-1807) | `/chat/category-talk?state=working` |
| [06 · Working · Steps open](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=180-2370) | the same, then click the step line |
| [07 · Answer](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=177-1339) | `/chat/category-talk?state=answer` |
| [08 · Answer · View traces](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=182-3288) | the same, then **View traces** |
| [09 · Answer · Steps open](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=181-2312) | the same, then click "Analysed …" beside the emblem |
| [10 · Answer · Full page](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=182-4485) | `/chat/category-talk?state=answer`, scrolled |
| [11 · Chats · Chat deleted](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=182-3486) | **Chats**, then the bin on a row |
| [12 · Error · Stopped at a step](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=181-2894) | `/chat/category-talk?state=error` |
| [13 · Offline](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=182-3886) | `/chat/category-talk?state=answer&offline=1` |
| [14 · Home · Persona picker](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=191-4652) | `/`, then the persona button in the composer |
| [15 · Answer · AI teammates](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=210-4978) | `/chat/category-talk?state=answer`, then **Milo** under the composer |
| [16 · Answer · Switch models](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=210-5349) | the same, then the model under the composer |
| [17 · Brief](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=219-5866) | `/chat/where-bespoke-sits?persona=brie&state=answer` |
| [18 · Brief · Saved](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=221-6148) | the same, then **Save as report** |
| [19 · Brief · Resizing](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=221-6505) | the same, dragging the handle between the chat and the brief |
| [20 · Brief · Closed](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=221-6852) | the same, then **Close** on the brief |
| [21 · Brief · Full document](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=222-6983) | the same, scrolled through the brief |
| [22 · Attach menu](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=230-7049) | `/chat/category-talk?state=answer`, then **+** in the composer |
| [23 · File uploading](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=230-7417) | the same, then **Upload a file** and pick a file (the first second) |
| [24 · File attached](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=230-7801) | the same, once it's in, with a question typed |
| [25 · Home · File attached](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=230-8185) | `/`, then **+**, **Upload a file**, and a question typed |
| [26 · File sent](https://www.figma.com/design/LY0YbZF2Egxak797VEtqDG/AI-chat-screen?node-id=230-8513) | send from Home: the chat opens with the file above the question |

These states are in code but have no Figma screen:

| State | In code |
| --- | --- |
| A live answer, from the first step to the chips | `/chat/category-talk` |
| The chart fails but the text stays | `/chat/where-bespoke-sits?state=chart-error` |
| A long thread, with "Jump to latest" | `/chat/category-talk?state=answer&turns=whitespace,hear-the-buyers` |
| Brie's brief, written live (the panel opens when it's done) | `/chat/where-bespoke-sits?persona=brie` |
| A chat started as Brie (her steps show no tool calls) | add `persona=brie` |
| Inside a stand-in of the dashboard (sidebar and breadcrumb) | add `shell=dashboard`, e.g. `/?shell=dashboard` |

The chat ids are `category-talk`, `where-bespoke-sits`, `what-cant-be-measured`, `whitespace` and `hear-the-buyers`.

## Developer notes

**Stack.** React 18, TypeScript, Vite, Tailwind CSS v4, React Router 6, Recharts for the charts, lucide-react for the icons.

**Design system**
- Colours come only from the tokens in `src/styles/index.css`, which mirror the Valerie DS: slate neutrals plus the navy Brand secondary scale (`brand-*`). Components don't hard-code hex values. The only exceptions are the chart series colours in `src/data/charts`.
- Values the DS doesn't have yet sit in the fenced "Beyond the DS" blocks of `index.css`, and each has a row in `docs/DS-DEVIATIONS.md`.
- `docs/DS-MAPPING.md` maps every element of the page to its DS component.
- The font is DM Sans only, including in traces (never monospace). Load it with its optical-size axis (`@fontsource-variable/dm-sans/opsz.css`). Figma renders DM Sans that way; without that axis, text sets about 3% wider and lines wrap differently.
- Red for errors is `--error`: the DS's Semantic/error-border, #dc2626.

**Layout**
- Desktop first, designed at 1440 wide.
- Everything in the thread, charts included, sits in a 720px column.
- The composer is the one exception: 756px wide, with 10px padding on all four sides, so its text and buttons line up with the 720 column's edges.
- The page has no header bar of its own. In the product it sits inside the dashboard, which already has a sidebar and breadcrumb, so its controls float in the top-right corner.

**The emblem** is the Hologram: a stack of slices in 3D, drawn from the Valerie mark. Its code is in `src/components/exp/Hologram.tsx`, and `src/components/brand/Aura.tsx` renders it with `sequence` on.
- At rest, a band of light reads down its face now and then.
- While working, it runs four motions in turn, about 9.6s a round: rotation, orbit, split & snap, flip.
- On error it greys and shows a red dot.

**Prototype-only behaviour.** Don't carry these over:
- Every answer takes about 20s, so the working state has time to show.
- The answers, numbers, charts and traces are illustrative. `docs/DATA.md` lists what changed from the live data.
- The model names are placeholders, and every model gives the same answer.
- Copy marked **DRAFT** in `src/data/ui.ts` isn't approved yet.

**Light mode only.** The design has no dark mode. The `.dark` tokens in `index.css` are used only by the archived versions.

## Where things live

```
src/
  data/            all copy and numbers: prompts.ts (questions, steps, follow-ups), answers.ts, briefs.ts,
                   charts/ (chart data), traces.ts, personas.ts, ui.ts (interface copy, DRAFT marked)
  pages/           HomePage.tsx, ChatPage.tsx (the thread and its composer)
  components/
    chat/          Composer, ModelPicker, PersonaPicker, Turn, AnswerView, BriefView (Brie's document), StepsList, OfflineStrip
    charts/        ChartCard (Figma's Market Briefing Card) and the five charts
    drawers/       ChatsDrawer, TracesDrawer
    ui/            Button, Badge, Sheet, Toast
    brand/         Aura (renders the emblem), ValerieLogo
    layout/        AppShell (the standalone frame, or the dashboard stand-in with ?shell=dashboard)
  lib/             store (persona, model, which sheet is open), useOnline (offline state), motion helpers
  styles/index.css design tokens
docs/              DS-MAPPING.md, DS-DEVIATIONS.md, DATA.md
```

## Not part of the spec

The repo also holds the design exploration that led here. None of it is part of the approved design, so you can ignore it:
- `/archive` and `/archive/v1`–`v4`: earlier versions.
- `/exp`, `/exp/bot`, `/exp/motion` and `/lab`: emblem experiments.
- The three.js and Paper Shaders packages: used only by those pages.
- In `src/lib/aura.ts`: `VERSION` is `'main'` at `/`. Code that branches on `VERSION !== 'main'` belongs to the archive.

## Deploy

```bash
npm run deploy:netlify   # builds and uploads to https://valerie-ai.netlify.app
```

Every file tells search engines not to index it (`robots.txt`, a meta tag, an `X-Robots-Tag` header). For other hosts, see `docs/DEPLOY.md`.
