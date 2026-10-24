/**
 * R5 · "Appendix A1 · Trend sweet spot" card.
 * Which aspirational leaders play in each growing topic. Leader membership per cell is
 * illustrative (it matches the leader count per topic); see docs/DATA.md.
 */
export const leaders = ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'Rationale', 'SkinCeuticals', 'Synergie Skin']

export const sweetSpot = {
  eyebrow: 'Appendix A1 · Trend sweet spot',
  title: 'Which aspirational leaders play in which topic',
  groups: [
    {
      label: 'Growing trends', meta: '10 topics · Share of discussion up more than 15% a year', direction: 'up' as const,
      rows: [
        { topic: 'Dark spot treatments', growth: 54.8, bespoke: true, leaders: ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Mature population', growth: 33.2, bespoke: true, leaders: ['Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Pigmentation reduction', growth: 28.4, bespoke: true, leaders: ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Pore appearance refinement', growth: 21.6, bespoke: true, leaders: ['Dr. Sam Bunting', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Niacinamide and barrier-support ingredients', growth: 20.9, bespoke: true, leaders: ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Active compatibility', growth: 17.8, bespoke: true, leaders: ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Vitamin C and antioxidants', growth: 16.6, bespoke: true, leaders: ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Acne clearing control', growth: 16.3, bespoke: true, leaders: ['Barefaced', 'Dr. Sam Bunting', "Paula's Choice", 'Synergie Skin'] },
        { topic: 'Peptides and collagen-supporting ingredients', growth: 15.9, bespoke: false, leaders: ['AMPERNA', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'SkinCeuticals', 'Synergie Skin'] },
        { topic: 'Visible radiance improvement', growth: 15.1, bespoke: true, leaders: ['AMPERNA', 'Barefaced', 'Dr. Sam Bunting', 'Maelove', "Paula's Choice", 'Rationale', 'SkinCeuticals', 'Synergie Skin'] },
      ],
    },
    { label: 'No clear direction', meta: '29 topics · Share of discussion within ±15% a year', direction: 'flat' as const, rows: [] },
    { label: 'Decreasing trends', meta: '4 topics · Share of discussion down more than 15% a year', direction: 'down' as const, rows: [] },
  ],
}
