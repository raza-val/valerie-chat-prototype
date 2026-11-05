/**
 * R6 · Purchase drivers card, as Figma draws it (AI-chat-screen 119:41950).
 * importance: 0–10 (how much the driver moves star ratings). bespoke / leaders: net sentiment −100…100.
 * thin: fewer than 20 Bespoke mentions (drawn as a hollow grey square, its figures in grey).
 * Figma's figures are swapped for the prototype's illustrative ones (docs/DATA.md, R6); the wording is Figma's.
 */
export const purchaseDrivers = {
  title: 'Skin reactions move ratings most, and that is where Bespoke trails the aspirational leaders most (+12 vs +34)',
  subtitle: 'Net sentiment vs aspirational leaders, and purchase driver importance',
  columns: { importance: 'Importance', driver: 'Driver', sentiment: 'Net sentiment' },
  /** The net-sentiment scale and its axis ticks. */
  domain: [-40, 100] as const,
  ticks: [-40, 0, 50, 100],
  legend: {
    bespoke: 'Bespoke',
    leaders: 'Aspirational leaders (avg.)',
    ahead: 'Bespoke ahead',
    behind: 'Bespoke behind',
    thin: 'Under 20',
  },
  /** Figma's series colours with no DS token (the rest use tokens: data-up-ink, brand-400, border, muted-foreground). */
  colors: {
    importance: '#afbaca',
    importanceGloss: 'inset 2px 2px 7px 0px rgba(255, 255, 255, 0.55)',
    leaderGloss: 'inset 1.654px 1.654px 5.79px 0px rgba(255, 255, 255, 0.35)',
    ahead: '#10b981', // emerald/500, the line when Bespoke is ahead
    behind: '#f59e0b', // amber/500, the line when Bespoke is behind
    behindInk: '#b45309', // amber/700, the gap figure when Bespoke is behind
  },
  rows: [
    { driver: 'Skin reactions', importance: 10.0, bespoke: 12, leaders: 34 },
    { driver: 'Product effectiveness', importance: 7.9, bespoke: 74, leaders: 71 },
    { driver: 'Value for money', importance: 7.3, bespoke: 40, leaders: 33 },
    { driver: 'Ingredients and formulation', importance: 5.2, bespoke: 70, leaders: 49 },
    { driver: 'Packaging and ease of use', importance: 4.3, bespoke: 38, leaders: 32 },
    { driver: 'Texture', importance: 3.6, bespoke: 73, leaders: 68 },
    { driver: 'Barrier and sensitivity care', importance: 3.0, bespoke: 78, leaders: 71 },
    { driver: 'Ordering and delivery', importance: 2.5, bespoke: -7, leaders: 7, thin: true },
    { driver: 'Results timeline', importance: 2.4, bespoke: 59, leaders: 63 },
    { driver: 'Customer service', importance: 1.9, bespoke: 39, leaders: -14, thin: true },
    { driver: 'Acne and pore control', importance: 0.8, bespoke: 48, leaders: 63, thin: true },
    { driver: 'Compatibility', importance: 0.8, bespoke: 69, leaders: 66 },
    { driver: 'Anti-ageing', importance: 0.6, bespoke: 75, leaders: 69 },
    { driver: 'Skin type suitability', importance: 0.5, bespoke: 65, leaders: 62 },
    { driver: 'Brand reputation', importance: 0.2, bespoke: 71, leaders: 66, thin: true },
  ] as { driver: string; importance: number; bespoke: number; leaders: number; thin?: boolean }[],
}
