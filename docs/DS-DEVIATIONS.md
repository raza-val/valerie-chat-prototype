# Design-system deviations

This is the record of every value the prototype uses that isn't in the Valerie DS. The DS here means the Valerie Shadcn DS Figma library, as mirrored by the tokens in `src/styles/index.css`. Each value gets one row, and the summary answers "how far from the DS are we?"

**Keeping it honest**
- New values live in two places only:
  - the fenced block `Beyond the DS` at the end of the `:root` / `.dark` tokens in `src/styles/index.css`;
  - `src/lib/aura.ts`, for the shader presets.
- To count them:
  - `sed -n '/Beyond the DS/,/End beyond the DS/p' src/styles/index.css | grep -c -- '--'`
  - `grep -rnoE '#[0-9a-fA-F]{3,6}\b|rgba?\(' src/components src/pages src/lib`. The target is 0 matches outside the baseline rows below.
- Status runs `proposed` → `approved` → `shipped`, or `rejected`.
- Assumption: Tailwind's default scales (spacing, radius, shadow) count as the DS, because shadcn uses them. This is still to be checked against the Figma library.

## Summary (25 Oct 2026)

| Category | In the DS | Already off-DS in code | Added (proposed) | Budget |
|---|---|---|---|---|
| Colours | 28 tokens | 2 accepted exceptions (B1, B2) | **0 new values**; 3 aliases of DS colours (D1, D11, D12) | 0 new |
| Fonts | DM Sans | 0 | 0 | 0 |
| Shadows | Tailwind scale | 9 one-off recipes (B3) | 2 tokens that **replace** the 9 (D4, D5) | 2 |
| Type sizes | Tailwind scale | 6 one-off sizes (B4) | 0 | review in Phase 5 |
| Radii | Tailwind scale | 3 one-off radii (B5) | 0; nested 24/16/12 are on the scale | 0 |
| Motion | none | 7 keyframes, ad-hoc timings (B6) | 4 durations + 3 easings as tokens (D6, D7) | 7 |
| Material (shader) | none | 0 | 1 material, 7 state presets (D2, D3); the cloud's 5 (D17) | 1 |
| Layout | 720 / 960 grid, 44px bar | 0 | floating pills; grey canvas composition (D9, D11) | 2 |

**Net effect, if all proposals are approved:**
- 0 new colour values and 0 new fonts.
- One new kind of thing: the liquid-metal material.
- 9 untracked shadows become 2 named ones.

## Proposed

| # | Name | Value | Kind | Used in | Nearest DS | Why | Status |
|---|---|---|---|---|---|---|---|
| D1 | `--aura-tint` | `var(--brand-400)` in light, `var(--brand-200)` in dark | Colour alias | Aura metal | brand-400, brand-200 | Points at existing tokens | shipped, needs your OK |
| D2 | Chromatic fringe | light: shiftRed 0.05, shiftBlue 0.35; dark: 0 / 0.15 | Material | Aura | none | The shader makes a thin blue edge colour that isn't a token. Setting both to 0 removes it. | shipped, needs your OK |
| D3 | Flow and shape | light: repetition 1.6, softness 0.6, distortion 0.05, contour 0.4, angle 70, scale 0.92; dark: repetition 1.2, contour 0.1; speed 0 (error) to 0.9 (thinking); stills and live start at frame 2000. Thinking shape: a drop (circle, distortion 0.2) at 0.7× the mark's size | Material | `src/lib/aura.ts`, 5 states × 2 themes | none | The DS has no materials | shipped, needs your OK |
| D4 | `--shadow-hairline` | `0 1px 2px rgb(15 23 42 / .05)` | Shadow | pills, bubble, key-figure strip, lists, chips | shadow-xs | Replaces 4 one-offs | shipped, needs your OK |
| D5 | `--shadow-float` | `0 1px 2px rgb(15 23 42 / .04), 0 8px 24px -10px rgb(15 23 42 / .14)` | Shadow | pill hover, popover, jump pill | shadow-lg | Replaces 4 one-offs | shipped, needs your OK |
| D6 | `--dur-fast / base / slow / flight` | 160 / 280 / 450 / 760ms | Motion | all motion; the flight is 760ms with a 6% lift and a 40px arc (`AuraFlight.tsx`) | none | The DS has no motion tokens | flight shipped, needs your OK; the rest proposed |
| D7b | Aura morph | 600ms; melt: to scale 1.14, blur 4px, fade; form: from scale 0.82, blur 4px, fade | Motion | `index.css` (`melt`, `form`), `MORPH_MS` | none | The DS has no motion tokens | shipped, needs your OK |
| D7 | `--ease-out / in-out / settle` | `cubic-bezier(.2,.8,.2,1)` / `(.65,0,.35,1)` / `(.3,1.4,.5,1)` | Motion | all motion | none | Same | proposed |
| D13 | Sound | 4 Web Audio cues: sine/triangle tones at 0.018–0.035 gain, 50–700ms; send 440→660Hz, step 1320Hz, answer 659 + 988Hz, error 392→311Hz | Sound | `src/lib/sound.ts`, speaker pill | none | The DS has no sound. Off by default. | shipped, needs your OK |
| D14 | Two-tone lead | unspoken words `--muted-foreground` at 45%, spoken `--foreground`, 300ms colour transition | Colour (token + alpha) | the answer's lead while it streams | muted-foreground | Reference A's spoken line | shipped, needs your OK |
| D15 | Aura beat | swell to 1.12× and back, 380ms, once per spoken clause | Motion | Aura while speaking | none | Speaking in time | shipped, needs your OK |
| D16 | `--muted-ink` | `color-mix(--muted-foreground 85%, --foreground)`, applied as `--muted-foreground` inside `[data-canvas]` (Home, Chat) | Colour (mix of two tokens) | grey text on the canvas | muted-foreground | slate-500 on slate-100 is 4.34:1, below AA; the mix is 5.32:1. No new value: a blend of two DS tokens | shipped, needs your OK |
| D17 | Aura the hexagon | liquid metal (Paper) in the hexagon mask (the polished hexagon's outline, r = R / (1 − 0.07·cos 6θ), point up; the cloud option uses the same values): repetition 2, softness 0.15, contour 0.4, distortion 0.07 (0.2 thinking), shiftRed 0.3, shiftBlue 0.3, angle 150 (at 70 the bands curved under the eyes into a frown), scale 1.1, tint `--brand-50`; speed 0 (error) to 0.9 (thinking); the hexagon's still and live start at frame 3000. Face: `--brand-950` pill eyes with a `--brand-50` catch-light and rim, 1.3× below 40px; float ±1.6%, blink every 2.2–6s, voice ring `--brand-300` | Material, motion | `src/lib/aura.ts`, `Mascot.tsx` | brand-50, brand-300, brand-950 | Replaces the mark's D3 values in the product (the mark stays in `/lab`). The RGB fringe (shiftRed/Blue) is the shader's own edge colour, not a token; 0 removes it. | shipped, needs your OK |
| D18 | Valerie's voice | recorded lines (macOS Siri voice Nicky, compact) for the tagline, six headlines and the follow-up offer; m4a 64kbps, about 0.5MB per voice. Off by default, like D13 | Sound | `src/lib/voice.ts`, `public/voice/` | none | The DS has no voice. `?voice=` picks one of six. | shipped, needs your OK |
| D19 | `--shadow-composer` | `0 1px 2px rgb(15 23 42 / .06), 0 4px 12px -2px rgb(15 23 42 / .06), 0 16px 32px -12px rgb(15 23 42 / .18)`, with a `--border` hairline | Shadow | Composer (Home and the thread) | shadow-xl | The composer has to stand apart from the white cards in the thread, which sit on D4/D5 | shipped, needs your OK |
| D20 | `--shadow-chart-card` | `0 2px 8px rgb(203 213 225 / .5), 0 1px 1px rgb(148 163 184 / .2), inset 0 2px 6px rgb(226 232 240 / .6)`; dark: `0 1px 2px rgb(0 0 0 / .4)` | Shadow | Chart cards in an answer | none | Copied from the Figma answer designs' Market Briefing card (119:41560), which draws it as an effect rather than a DS style. Not a new design decision. | shipped, from Figma |
| D21 | Aura experiments | five looks on `/exp` (Glass, Plasma, Hologram, Orb, Halo): brand-50…950 and `--brand-accent` (Glass's dispersion edge only, as the logo's own amber), blurs, glows and Paper's Heatmap and GemSmoke shaders; no hex in the components | Material, motion | `src/components/exp/`, `public/exp/mark.svg` | brand-* | Exploration only, not in the product. A pick gets its own row with its final values | proposed |
| D22 | Composer tray | a strip tucked under the composer (it overlaps the tray's top 16px), `brand-50` with a `brand-100` hairline; dark: `brand-950` at 40% with a `brand-900` hairline at 50%; message centred, Retry as a link | Layout, colour | `OfflineStrip` (Home and the thread); for any state the composer reports | a separate white strip above the composer | The user's reference (a status tray under the input): the state belongs to the composer, and a tinted ground sets it apart from the canvas and the white cards | proposed |
| D23 | Composer rim | active (focus), main design only: hairline `brand-200` with a 4px halo of `brand-500` at 8%, and, on arrival only, a 1.5px light sweeping once round the rim (1.2s from the left, fading as it lands; still after that): a conic gradient, `brand-300` at 55% → `brand-500` → `brand-700` head; dark: hairline `brand-800` at 60%, halo `brand-400` at 10%, comet `brand-400` at 45% → `brand-300` → `brand-100`. Still when motion is reduced | Colour, motion | `Composer` (`.composer-rim`, Home and the thread, `/` only) | `focus-within:ring-brand-300` | The user asked for a creative, subtle, elegant active state on the rim | proposed |
| D17 | Neutral badge fill | `--foreground` at 6% | Colour (token + alpha) | lens badges | muted | `--muted` vanished on the canvas | shipped, needs your OK |
| D8 | Hero Aura size | 112px | Size | Home | none | The DS has no illustration sizes | shipped, needs your OK |
| D9 | Floating header pills | no bar; `rounded-full`, white, D4 resting, D5 on hover | Layout | ChatHeader | 44px bar (CLAUDE.md rule 1, now updated) | Reference B's quiet chrome | shipped, needs your OK |
| D11 | `--canvas` | `var(--muted)` in light, `var(--background)` in dark | Colour alias | Home and Chat page ground | muted (slate-100) | Reference B's calm grey, sampled at `#eff1f3`. slate-100 is within a hair, so we use the DS token rather than adding a neutral grey (+1 colour, not proposed). | shipped, needs your OK |
| D12 | `--surface` | `var(--card)` | Colour alias | composer, pills, user bubble, key-figure strip | card | Names "white means you can touch this" | shipped, needs your OK |

## Baseline: off-DS before this work

| # | What | Where | Note | Status |
|---|---|---|---|---|
| B1 | Amber notification dot, teal workspace tile | `AppShell` | Host stand-in, mirrors the live dashboard | accepted |
| B2 | Emerald and orange gap lines | Purchase drivers chart card | Mirrors the live card (rule 4) | accepted |
| B3 | 9 one-off shadow recipes | Button, ChatHeader, Composer, ChartCard, PinPopover, ChatPage, HomePage, AuraOrb, AppShell | 7 folded into D4/D5 or removed. 2 left: ChartCard (rule 4, the card's own look) and AppShell (host stand-in, B1) | done |
| B4 | Type sizes 10, 11, 13, 22, 28, 36px | various | 13 → 14 everywhere. Deliberate: 22 (lead), 28 (key figures), 36 (Home headline), 11 (avatar initials). 10 is the host stand-in (B1) | done |
| B5 | Radii 2, 18, 22px | chart bars, composer, bubble | Composer is 24 (`rounded-3xl`) and the bubble 16; 2px stays inside the chart cards | done |
| B7 | Drawer scrim `bg-slate-950/20` | `ui/Sheet.tsx` | A Tailwind palette colour, not a token (it equals dark `--background`). Left as is; no token is dark in both themes | accepted |
| B6 | Keyframes rise, pop, reveal, tick, wave, breathe, shimmer | `index.css` | Move their timings onto D6/D7 | to fix |

## Not needed or rejected

- **D10, a grey mat behind charts:** not needed. The grey canvas (D11) does the same job, and the chart card is unchanged.
- **New colours for the metal:** not needed, because D1 maps the tint to existing tokens.
- **A neutral grey matching `#eff1f3` exactly:** not proposed, because `--muted` is close enough.
- **Monospace, and Three.js:** rule 3, and not needed.

## Change log

- **25 Oct 2026:**
  - Phase 1 built. Stills and live both start at frame 2000. Dark mode gets its own band settings, because dark bands vanish on the dark canvas.
  - The only colour literal left outside the baseline is `rgba(0,0,0,0)`: the transparent ground behind the metal, which is not a colour value.
  - Ledger started, baseline counted, Aura proposals added.
  - Reference B added: canvas and surface aliases (D11, D12). The grey mat was dropped and the shadow tokens renamed.
  - Phase 7: D8 corrected to 112px (the hero shrank in the Home redesign). The canvas pool adds no values.
  - Aura is now the hexagon in liquid chrome (D17; it was the cloud for a day, now an option) and speaks (D18). The dark-film hexagon (the only shader-made colour) is gone; the options kept in `/lab?view=character` use brand tokens only.
  - The Home starter frame fades with a mask (`black` to `transparent`, alpha only, not a visible colour). Its line is the DS `--border`.
- **27 Oct 2026:** chart cards in answers lost their dashboard frame (`bg-slate-50/70` and a hard-coded shadow); they are now `--surface` with `--shadow-hairline`, so two literals left the components. Aura's chrome angle moved to 150 (D17).
- **28 Oct 2026:** the offline strip became a tray under the composer (D22).
- **28 Oct 2026:** `/exp` added: five Aura experiments after leadership passed on the chrome hexagon and the cloud (D21).
- **6 Nov 2026:** the composer's active rim in the main design only (D23). A light gliding round it every 7s distracted from typing, so it now sweeps once on arrival and rests.
