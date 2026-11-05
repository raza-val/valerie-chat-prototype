/**
 * R1 · "Fastest share gainers" card: the top 10 topics by yearly share growth (12-quarter CAGR), industry-wide,
 * each with its dimension's colour. Figma's figures are swapped for the prototype's illustrative ones (docs/DATA.md),
 * so the order follows the prototype's values.
 */
export const topicShare = {
  title: 'Dark spot treatments is gaining share fastest, at +54.8% a year, well ahead of mature population (+33.2%)',
  subtitle: 'Top 10 topics by yearly share growth (12-quarter CAGR), industry-wide',
  /** The five dimensions in the legend, with their Figma swatches (chart series colours). */
  dimensions: {
    'Product types': '#d4aac7',
    Audience: '#e4dcd9',
    Needs: '#b2e0dc',
    'Characteristics and ingredients': '#bfa090',
    'Selection factors': '#83a1c4',
  },
  rows: [
    { topic: 'Dark spot treatments', dimension: 'Product types', growth: 54.8 },
    { topic: 'Mature population', dimension: 'Audience', growth: 33.2 },
    { topic: 'Pigmentation reduction', dimension: 'Needs', growth: 28.4 },
    { topic: 'Pore appearance refinement', dimension: 'Needs', growth: 21.6 },
    { topic: 'Niacinamide and barrier-support ingredients', dimension: 'Characteristics and ingredients', growth: 20.9 },
    { topic: 'Rapid weight-loss skin adaptation', dimension: 'Needs', growth: 19.7 },
    { topic: 'Active compatibility', dimension: 'Selection factors', growth: 17.8 },
    { topic: 'Vitamin C and antioxidants', dimension: 'Characteristics and ingredients', growth: 16.6 },
    { topic: 'Acne clearing control', dimension: 'Needs', growth: 16.3 },
    { topic: 'Peptides and collagen-supporting ingredients', dimension: 'Characteristics and ingredients', growth: 15.9 },
  ] as const,
  note: 'Share growth: the yearly growth rate (CAGR) of a topic’s share of its own dimension, Y1 to Y3. 30 of 51 topics gained share. 2 topics measured on fewer than 12 quarters are not ranked.',
}
