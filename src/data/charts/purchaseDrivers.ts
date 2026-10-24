/**
 * R6 · "Brand & competitors · purchasing drivers" card.
 * importance: 0–10 (how much the driver moves star ratings). bespoke / leaders: net sentiment −100…100.
 * thin: fewer than 20 Bespoke mentions (drawn hollow).
 */
export const purchaseDrivers = {
  eyebrow: 'Brand & competitors · purchasing drivers',
  title: 'Skin reactions move ratings most, and that is where Bespoke trails the aspirational leaders most (+12 vs +34)',
  subtitle: 'Net sentiment vs aspirational leaders, and purchase driver importance',
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
  ],
}
