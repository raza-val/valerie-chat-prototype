/** R3 · "Appendix B · About the data" card (Figma AI-chat-screen 119:41734). Review counts per brand and where they come from. */
export type Source = 'Own website' | 'Amazon' | 'Google'

export const reviewSources = {
  title: 'All 412 of Bespoke’s reviews come from its own website, where every leader but SkinCeuticals also draws on Amazon or Google',
  rows: [
    { brand: 'Bespoke', reviews: 412, sources: ['Own website'] as Source[], isBespoke: true },
    { brand: 'Dr. Sam Bunting', reviews: 5214, sources: ['Google', 'Own website'] as Source[] },
    { brand: 'SkinCeuticals', reviews: 2540, sources: ['Own website'] as Source[] },
    { brand: 'Synergie Skin', reviews: 1808, sources: ['Amazon', 'Own website'] as Source[] },
    { brand: 'Maelove', reviews: 1690, sources: ['Amazon', 'Google', 'Own website'] as Source[] },
    { brand: 'Barefaced', reviews: 1042, sources: ['Amazon', 'Own website'] as Source[] },
    { brand: "Paula's Choice", reviews: 884, sources: ['Amazon', 'Google'] as Source[] },
    { brand: 'AMPERNA', reviews: 351, sources: ['Google', 'Own website'] as Source[] },
  ] as { brand: string; reviews: number; sources: Source[]; isBespoke?: boolean }[],
  note: 'Written reviews in the analysis, 2023 to 2026; the chips show where each brand’s reviews come from.',
  /** Bar series, as Figma draws them: Bespoke purple/300, the leaders monocromo/chart-08, each with a soft white inner sheen. */
  bars: {
    bespoke: '#d8b4fe',
    leader: '#afbaca',
    sheen: 'inset 2px 2px 7px 0 rgba(255, 255, 255, 0.55)',
  },
}
