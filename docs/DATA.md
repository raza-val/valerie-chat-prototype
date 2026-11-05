# Data in the prototype

All numbers in this prototype are **illustrative**. They were changed from the Figma file and the live data so the hosted link doesn't expose real figures. The overall story of each answer is unchanged.

The **Figma** column shows the value in the Figma file. The **Prototype** column shows the value in this repo. If you change a value, update it in both places listed under **Where**, and add a row here.

## Dataset-wide

| What | Figma | Prototype | Where |
| --- | --- | --- | --- |
| Posts in the social corpus | 45,172 | 41,836 | `data/site.ts`, `prompts.ts` (where-bespoke-sits) |
| Dimension tags (industry) | 85,920 | 79,480 | `prompts.ts` (category-talk: summary, answer, steps) |
| Topic assignments (volume) | 112,884 | 104,370 | `prompts.ts` (whitespace footnote) |
| Topics, dimensions, quarters | 51 · 6 · 12 | unchanged | `data/site.ts` |

## R1 · What the category talks about (`category-talk`, chart `charts/topicShare.ts`)

The chart is Figma's "Fastest share gainers" list (27 Oct): the top 10 topics by share growth. With the prototype's values the last four reorder (Vitamin C, Acne clearing, then Peptides).

| What | Figma | Prototype |
| --- | --- | --- |
| Needs / Selection factors share | 33.9% / 25.3% | 32.7% / 26.1% |
| Routine / Product types / Audience / Characteristics | 14.1 / 12.6 / 7.4 / 6.6% | 14.6 / 12.2 / 7.7 / 6.7% |
| Dark spot treatments CAGR · mentions | +60.1% · 391 | +54.8% · 362 |
| Mature population CAGR · mentions | +35.6% · 692 | +33.2% · 648 |
| Pigmentation reduction CAGR · mentions | +30.1% · 1,751 | +28.4% · 1,620 |
| Card: Pore appearance / Niacinamide / Rapid weight-loss | +22.8 / +22.3 / +20.9% | +21.6 / +20.9 / +19.7% |
| Card: Active compatibility / Peptides / Vitamin C / Acne clearing | +18.5 / +16.5 / +16.2 / +15.9% | +17.8 / +15.9 / +16.6 / +16.3% |
| Card title | +60.1% / +35.6% | +54.8% / +33.2% |

## R2 · Where Bespoke sits (`where-bespoke-sits`, chart `charts/brandStrength.ts`)

| What | Figma | Prototype |
| --- | --- | --- |
| Brand-strength grades (all brands) | as card | unchanged (ordinal 1–5) |
| Bespoke SEO authority / rivals' median | 22 / 38 | 24 / 36 |
| Bespoke traffic growth | −16.1% | −14.7% |
| SkinCeuticals / Paula's Choice / AMPERNA traffic | −37.9 / −19.0 / −34.6% | −35.2 / −17.6 / −31.9% |
| SkinCeuticals social namings | 67 | 58 |

## R3 · What can't be measured (`what-cant-be-measured`, chart `charts/reviewSources.ts`)

| Brand | Figma reviews | Prototype |
| --- | --- | --- |
| Bespoke | 366 | 412 |
| Dr. Sam Bunting | 5,698 | 5,214 |
| SkinCeuticals | 2,686 | 2,540 |
| Synergie Skin | 1,926 | 1,808 |
| Maelove | 1,764 | 1,690 |
| Barefaced | 1,106 | 1,042 |
| Paula's Choice | 938 | 884 |
| AMPERNA | 364 | 351 |

## R4 · Whitespace (`whitespace`, chart `charts/leavesOut.ts`)

| What | Figma | Prototype |
| --- | --- | --- |
| Sunscreen / Availability / Layering | +12.5 / +11.9 / +9.7% | +11.8 / +12.4 / +9.1% |
| Active compatibility | +18.5% · 526 | +17.8% · 498 |
| Peptides | +16.5% · 600 | +15.9% · 571 |
| Vitamin C | +16.2% · 1,224 | +16.6% · 1,163 |
| Visible radiance | +15.7% · 2,668 | +15.1% · 2,512 |
| Dark spot mentions, year to year | 21 → 322 | 19 → 298 |
| Card: Peptides share · growth | 8.8% · +16.5% | 8.4% · +15.9% |
| Card: After-sun share · growth | 0.5% · +28.6% | 0.6% · +26.9% |
| Card: Rapid weight-loss share · growth | 0.4% · +20.9% | 0.4% · +19.7% |

## R5 · Growth numbers (removed)

The Figma answer designs have no answer for "Check the growth numbers", so the question, its chart and its voice clips were removed (27 Oct).

## R6 · Hear it from the buyers (`hear-the-buyers`, chart `charts/purchaseDrivers.ts`)

| What | Figma | Prototype |
| --- | --- | --- |
| Product effectiveness: Bespoke · leaders · reviews | +76 · +73 · 289 | +74 · +71 · 276 |
| Ingredients and formulation: Bespoke · reviews | +72 · 21 | +70 · 24 |
| Texture: Bespoke · reviews | +72 · 117 | +73 · 109 |
| Skin reactions: Bespoke · leaders · gap · n | +10 · +35 · −25 · 35 | +12 · +34 · −22 · 38 |
| Other drivers | as card | unchanged |

## Timings

The step timings and tool names in `prompts.ts` (shown in the steps list and traces) are illustrative. Their totals match the times shown in Figma, such as 8.4s, except `category-talk`, which totals 5.7s in 3 steps.

**v1–v4 (27–28 Oct):** every answer waits about 20s (24–30s until 28 Oct), so its Aura has time to change form the way a slow real reply does. The quickest answer takes 19s and the slowest 21s, the rest in between in the same order, and each step keeps its share of the wait. The scaling is done in `prompts.ts` at load, so the header, the steps list and the traces show the same times. Version A keeps the times above.

| Answer | `/` (dropped 28 Oct) | v1–v4 |
| --- | --- | --- |
| category-talk | 5.7s | 19.0s |
| what-cant-be-measured | 6.1s | 19.2s |
| where-bespoke-sits | 8.4s | 20.5s |
| hear-the-buyers | 8.9s | 20.8s |
| whitespace | 9.3s | 21.0s |
