# Valerie prototype: where we are

Updated 27 Oct 2026.

## The goal
A clickable, front-end-only prototype of **Valerie**, an AI analyst chat for the skincare category and the brand Bespoke. You're presenting the redesigned Conversational AI page to leadership within one to two days. The quality bar is a world-class analyst product: calm, restrained, precisely aligned, with no filler. The latest thread was giving Valerie a character, **Aura**, that moves, speaks and guides, inspired by Adam Perlis's site.

## Done

**Foundation (Phases 1–7)**
- **Calm canvas:**
  - grey canvas, with white only for things you can touch;
  - floating pills instead of a bar: one Chats capsule with New chat (+) beside it, then sound and View traces as round icons with tooltips;
  - a thin composer in the thread, and a taller two-row one on Home, both with 20px corners.
- **Answer anatomy:**
  - headline lead, then 3 key figures, blocks, caveat, chart and actions, all in the 720px column;
  - follow-up offer under the latest answer;
  - a composer docked under the thread.
- **Motion:**
  - Aura flies from the Home hero into the first answer;
  - the headline is laid out in grey and turns to ink word by word, with a swell per clause;
  - Aura docks into the composer when you scroll away.
- **Sound:** four soft synthesised cues, off by default.
- **Polish:**
  - steps without a box, 8px rhythm, no 13px type;
  - AA-contrast grey on the canvas, nested radii.
- **Performance:**
  - shader canvases pooled: 0 dropped frames after the first send;
  - checked in WebKit and Firefox, plus the edge states.

**Design audit ("Say a label once", now a CLAUDE.md rule)**
- **Home starters:**
  - tabs All / Industry / Competitive / Brand, each with an icon;
  - plain question rows with no icons and no background;
  - a hairline frame that fades out downward.
- **Drawers:** Chats are titles only; Traces are grouped by day with no badges.
- **Ranked lists:** plain numbers.

**Aura's character (Phase 9)**
- **Explored** seven mascot options, then narrowed them. The current choice is **Hexagon · Liquid chrome**: the polished hexagon's outline (point up, soft sides) cast in Paper's liquid metal.
- **Kept for leadership in the lab:** Cloud · Liquid chrome (round bottom), Constellation, Hexagon · Polished chrome, Cloud · Soft.
- **Face:**
  - blinking eyes that follow the pointer;
  - six expressions, mapped to states: listening looks down, thinking squints up, error is worried and grey with a red dot;
  - a float, and a squash with the voice.
- **Small sizes:**
  - settled answers show a still image (frame 3000, with the bands running down the side so none reads as a mouth or frown);
  - eyes grow 1.3× below 40px and have a pale rim so they show on dark chrome.
- **Voice:**
  - recorded with the built-in macOS voices: 6 voices × 8 lines (tagline, 6 headlines, follow-up offer);
  - played through Web Audio, so it also works in Safari;
  - the headline's ink follows the real word timings;
  - the follow-up offer is spoken, and Home greets you with the tagline;
  - tap Aura to replay or stop;
  - off until sound is turned on.
- **Docs updated:** CLAUDE.md, README, `docs/AURA-PLAN.md`, `docs/DS-DEVIATIONS.md` (new entries D17 for the chrome look and D18 for the voice).

**The leadership package (Phase 8)**
- **Before/after slides:** six 16:9 slides in `docs/aura/slides/` (Home, Answer, Chart, Working, Home and Answer in dark), each pairing an old screen with the new one at the same URL and framing.
- **Video backup:** `docs/aura/valerie-demo.mp4`, 28s with Valerie's voice: greeting, the flight, working, the headline read aloud as it inks, the follow-up offer. It plays in QuickTime and Keynote.
- **Links checked:** all 15 README URLs open with no errors.
- **Safari's engine (WebKit):** the hexagon, tap-to-listen and a voiced live answer all work, with the same timing as Chrome.
- **Re-record and re-render tools** live in the project: `tools/voice/record.sh` for the voice lines, `tools/video/render.sh` for the video.

**Modern-assistant pass (27 Oct)**
- **Composer:** in the thread, one thin 56px row (+, the text, persona, mic, send) that grows to six lines as you type. Home keeps the taller box: a two-line input over + on the left, then persona, mic and send on the right. Both have 20px corners (squarer, like Claude), with buttons nested at 10px; the starters frame matches.
- **Charts:** inside the 720px column, as a simple card (title, chart, legend). The dashboard chrome is gone (eyebrow, Deep, pin, explain, About this card, How to read), and so is Pin insight. Purchase drivers and What Bespoke leaves out were re-laid to fit; Growth numbers no longer has a chart.
- **Source row:** gone from under the answer; its method note sits in the expanded steps list.
- **Aura:** the chrome's bands now run down the side, so they no longer curve under the eyes into a frown.

**Two versions for leadership (27 Oct)**
- **Version A** at `/`: the liquid-chrome hexagon. **Version B** at `/constellation/`: the Constellation. Everything else is the same, and links inside each version stay in it.
- **Version B is the abstract one** (after leadership feedback: not human): the Constellation has no face, and each state is a form its points ease into:
  - idle: the sparkle twinkles from the core, leans toward the pointer, and glints every few seconds;
  - listening (typing on Home): it gathers low, toward the composer;
  - thinking: a loop of data forms, a new one every 3.2s while the wait goes on: orbit (a spinner when small), wave, bars, scatter, scan;
  - speaking: it pulses with the voice; error: it sinks, greys and stops twinkling, with the red dot.
- **Version B's wait has two stages:** first only Aura and one shimmering line naming the step (collapsed; a click opens the steps), then the skeleton for the last 2.5s before the answer. Step timings are unchanged.
- Version A keeps the human hexagon and its current wait.
- Version B's tab title says "Constellation" (approved).
- **For the room:** A vs B slides in `docs/aura/slides-ab/` (Home, Answer, Working, both in dark, and Aura up close). The before/after slides were re-shot with the new composer and header.

## Waiting on you
0. **Whitespace contradicts its chart:** the answer says Bespoke isn't present in Dark spot treatments, Active compatibility, Vitamin C and Visible radiance; its chart (and the dashboard's sweet-spot card) say Bespoke plays in nine of the growing trends. Which source is right?
1. **Voice:** Nicky is a placeholder. Compare in context with `?voice=martha`, aaron, arthur, catherine or samantha.
2. **Hexagon sides:** keep the soft, pinched pebble, or switch to straight sides with rounded corners?
3. **Draft copy** in `src/data/ui.ts`, including the new "Listen" / "Stop" labels (Version B's tab title is approved).
4. **Deviation list** (D1–D18) in `docs/DS-DEVIATIONS.md`.
5. **Small calls:**
   - Should settled answers' Auras keep following the pointer?
   - The error line stays silent, because it names Valerie in the third person. Approve a first-person version if you want it spoken.

## Still to do
- **After you pick a voice:** if it isn't Nicky, make it the default in `src/lib/voice.ts` and re-render the video (`VOICE=<name> tools/video/render.sh`).
- **One-minute check in the real Safari app,** with the speakers on: send a starter with sound on and listen to the headline.
- **Deploy:** Cloudflare Pages behind the password gate (`docs/DEPLOY.md`).
- **Optional:**
  - a small settle when Aura lands;
  - Rivals / Mentions columns in ranked lists;
  - question counts on the starter tabs.

## Key links (local)

| What | URL |
|---|---|
| Home, Version A | `localhost:5173/` |
| Home, Version B | `localhost:5173/constellation/` |
| Voice on | `localhost:5173/?sound=1` (add `&voice=…`) |
| Mascot options | `/lab?view=character` |
| Long thread | `/chat/category-talk?state=answer&turns=whitespace,hear-the-buyers` |
| Error | `/chat/category-talk?state=error` |

## Ground rules
- DS colour tokens only; anything beyond them gets an entry in `docs/DS-DEVIATIONS.md`.
- DM Sans only.
- Charts in answers: title, chart and legend only, never wider than the text.
- No invented copy; new strings go in `ui.ts` as DRAFT.
- Everything in the 720px column.
- Verify with `npm run build` and screenshots at 1440×900.
- No GitHub or pushing.
- Back up the folder before big changes.
