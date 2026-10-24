/** R4 · "Trends · what Bespoke leaves out" card. */
export type Verdict = 'Worth watching' | 'Not a fit' | 'Too small'

export const leavesOut = {
  eyebrow: 'Trends · what Bespoke leaves out',
  title: 'Of the three growing trends Bespoke does not play in, only peptides is worth watching; after-sun care and rapid weight-loss skin are small or off-strategy',
  items: [
    { topic: 'Peptides and collagen-supporting ingredients', dimension: 'Characteristics and ingredients', growth: 15.9, share: 8.4, verdict: 'Worth watching' as Verdict, text: 'of the characteristics and ingredients conversation, gaining 15.9% share per year, and 6 of the 8 aspirational leaders already play in it' },
    { topic: 'After-sun care', dimension: 'Product types', growth: 26.9, share: 0.6, verdict: 'Not a fit' as Verdict, text: 'of the product-type conversation and no aspirational leader plays in it. It would point to the missing SPF and add a step to a routine built on simplicity' },
    { topic: 'Rapid weight-loss skin adaptation', dimension: 'Needs', growth: 19.7, share: 0.4, verdict: 'Too small' as Verdict, text: 'of the needs conversation, and no aspirational leader plays in it' },
  ],
  footer: 'No change of direction needed: Bespoke already plays in the other nine growing trends.',
}
