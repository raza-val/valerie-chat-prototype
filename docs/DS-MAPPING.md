# Design system mapping: main design → Valerie Shadcn

For each element of the main design (`/`), the Figma design-system piece it should be built from, and whether code matches it yet. This is the checklist for bringing the prototype onto the DS and for rebuilding it in Figma.

**Source.** The library is **Valerie Shadcn – (DS Template)**, read on 6 Nov through the instances placed in the AI-chat-screen file (`LY0YbZF2Egxak797VEtqDG`). Button, Icon Button, Market Briefing Card, Separator, Breadcrumb and the typography, colour, radius and shadow variables were read directly. Textarea, Dropdown Menu, Sheet, Toast/Sonner, Tooltip, Card, Badge and Avatar exist in the library but have no instance in this file, so their exact specs still need the library file itself (marked *confirm*).

**Status:** ✓ matches · ≈ close, small fix · ✗ differs · — not in the DS (ours, logged in `DS-DEVIATIONS.md`)

## Foundations

### Typography (DM Sans; DS style names)

| Where in the product | Code now | DS style | Status |
|---|---|---|---|
| Home headline | 30/36 semibold, -2.5% (6 Nov; was 36/40) | `text-3xl` + `leading-9`, semibold | ✓ |
| Answer lead | 20/28 semibold | `text-xl` + `leading-7`, semibold (*confirm the composite style exists*) | ≈ |
| Answer paragraphs, user bubble | 16/24 regular | `text-base/leading-6/normal` | ✓ |
| Composer input | 16/24 regular, **-1% tracking** | `text-base/leading-6/normal` (0 tracking) | ≈ drop the tracking |
| Button labels (DS buttons) | 14/24 semibold | `text-sm/leading-6_buttons/semibold` | ✓ on the floating controls; ≈ elsewhere (14/**20**) |
| Card titles, "Suggested questions" | 14/20 semibold | `text-sm/leading-5/semibold` | ✓ |
| Card questions, step lines | 14/20 regular | `text-sm/leading-5/normal` | ✓ |
| Steps summary, model and persona names | 14/20 medium | `text-sm/leading-5/medium` | ✓ |
| Tooltips, badges, dividers, trace details | 12/16 | `text-xs/leading-4/normal` · `/semibold` | ✓ (tooltip uses medium: *confirm*) |
| Persona role in the picker | **11px** | `text-xs` (12) or `text-[10px]` | ✗ off the scale |
| Traces drawer title | 18/28 semibold | `text-lg` + `leading-7` | ≈ *confirm* |
| Chart card title | 20 bold, -0.6px | Market Briefing Card's own title | ✓ |

### Colour

All colours come from tokens that already match the DS: `--primary` #1e293b, `--foreground` #0f172a, `--muted-foreground` #64748b, `--border` #e2e8f0, `--background` #fff, `--muted`/`--accent` #f1f5f9, Brand secondary (`brand-50…950`, our navy scale) and Brand accent (amber, logo only). ✓. The one literal outside the tokens is the toast's `bg-slate-900` (still a DS slate).

### Corner radius

| DS | Value | Used for |
|---|---|---|
| `rounded` | 4 | — |
| `rounded-lg` | 8 | small inner elements |
| `calc(var(--radius) - 2px)` | **12** | **Button, Icon Button** |
| `var(--radius)` | 24 | cards (Market Briefing Card) |
| `rounded-full` | ∞ | avatars, dots |

Off-scale in code: `rounded-md` 6 (tooltip, badge, menu items) ✗ · `rounded-lg` 8 on buttons (composer +, mic, send, model and persona triggers, ghost actions) ✗, should be 12 · `rounded-2xl` 16 (composer, user bubble) — · `rounded-full` on the follow-up chips ✗.

### Shadows

| DS | Value |
|---|---|
| `shadows/shadow-sm` | `0 2px 2px -2px #00000012, 0 4px 10px -1px #0000001A` |
| `shadows/shadow-md` | `0 6px 12px 0 #0000000D` |

Code uses its own: `--shadow-hairline` (D4: cards, bubble), `--shadow-float` (D5: hover), `--shadow-composer` (D19), `--shadow-chart-card` (D20, copied from the Figma card ✓), and Tailwind `shadow-lg`/`shadow-xl` (toast, menus) ✗ → map to `shadow-sm`/`shadow-md`, or log them.

### Icons

Lucide throughout, as in the DS. The DS draws them at **16px**; code uses 15px in the floating controls (now 16 ✓) and the answer actions ≈.

## Components

| Element | Code now | DS component | Status |
|---|---|---|---|
| Chats + New chat | **new component to add to the DS** (6 Nov): one outline capsule, fully rounded, 36px, 1px border; Chats (16px icon, 14/24 semibold `--primary`, 12px in) and, in a thread, a hairline then New chat (+, 40px wide); hover fills each half `--muted` | Button Group (Chats + New chat): *to create* | — ours, to add |
| View traces | Icon Button, outline, fully rounded, 36px, 16px icon | Icon Button (outline) | ≈ round by choice |
| Composer +, mic | ghost icon, 36px, 8 corners | Icon Button, ghost, 36 | ≈ corners 12 |
| Send | filled, 36px, 8 corners | Icon Button, default (filled) | ≈ corners 12 |
| Model and persona triggers | ghost, 36px, 8 corners, medium | Button, ghost | ≈ corners 12, semibold |
| Model and persona menus | 12 corners, 1px border, `shadow-xl`, items 6 corners | Dropdown Menu | ≈ *confirm* |
| Persona avatar | round image | Avatar | *confirm* |
| Composer box | 16 corners, D19 shadow, D23 rim, 10px padding | Textarea (*confirm*) | — keep as ours (the AI-chat composer pattern), logged |
| Suggestion cards | white, 12 corners, hairline shadow, 12px padding, 32px round icon chip | Card, or Form Base / Card Button (*confirm*) | *confirm* |
| Answer header (steps toggle) | ghost text button, 32px, 8 corners | Button, ghost, sm | ≈ |
| Open full trace | ghost Button, 14/20 | Button, ghost (Figma 138:1329) | ≈ 14/24, 12 corners |
| Copy, up, down, regenerate | ghost icon, 28px, 15px icons, 8 corners | Icon Button, ghost, 28 (6px padding, 16px icon) | ≈ |
| Follow-up chips | pill (full round), regular weight | **Button, outline** (Figma 140:1592) | ✗ |
| Chart cards | Market Briefing Card | Market Briefing Card | ✓ |
| Persona / model divider | hairlines + 12px text | Separator | ✓ |
| User bubble | 16 corners with a 6 tail, hairline | — | — ours |
| Tooltip | `--foreground` ground, 6 corners, 12 medium | Tooltip | *confirm* |
| Toast | slate-900, 12 corners, `shadow-lg` | Toast / Sonner | *confirm* |
| Chats and Traces drawers | own Sheet; in main its header follows the DS Sheet (24px in, title 18/28 semibold, description 14/20 muted, ghost Icon Button to close) | Sheet | ≈ *confirm* |
| Chats drawer rows | 16/24 rows, 14/20 medium day labels; delete on hover: ghost Icon Button 32, 12 corners, 16px icon | Sheet · Icon Button (ghost) | ≈ *confirm* row style |
| View traces, empty (Home) | the live product's line, centred, 14/20 muted | Sheet + empty text | ✓ |
| View traces, one reply | question 14/20 medium; per step: label 14/20 medium, time 12/16; a Card (1px border, 12 corners, 12 padding) holding a Badge with the tool name (`muted`, 6 corners, 12 semibold) and the payload in a muted block (8 corners, 12/20 DM Sans, tabular) | Card · Badge | ≈ *confirm* Card corners and Badge variant |
| Badge | 20px, 6 corners, 12 semibold | Badge | *confirm* |
| Offline tray | D22 | Alert | — ours |
| Skeleton (while working) | shimmer bars | Skeleton | *confirm* |
| Aura | Hologram | — | — brand, beyond the DS |

## Order of work

1. **Buttons everywhere (main):** composer icons and send, model and persona triggers, answer actions, Open full trace and the follow-up chips onto Button / Icon Button (12 corners, 14/24 semibold, 16px icons).
2. **Small type fixes:** persona role 11 → 12, composer tracking → 0.
3. **With the library file:** confirm Tooltip, Toast, Sheet, Dropdown Menu, Card, Badge, Avatar, Textarea, Skeleton, then align them.
4. **Keep as ours, logged:** Aura, the composer box and rim, the user bubble, the offline tray.
5. **Figma:** build each screen from these components; Code Connect can then link each code component to its DS component.
