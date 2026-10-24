/** R2 · "Appendix A4 · Brand strength" card. Grades are 1–5; null = withheld (never a low grade). */
export type GradeRow = { brand: string; positioning: number | null; usp: number | null; endorsements: number | null; overall: number | null; isBespoke?: boolean }

export const brandStrength = {
  eyebrow: 'Appendix A4 · Brand strength',
  title: 'Bespoke’s brand strength is behind only SkinCeuticals among the aspirational leaders, and it matches SkinCeuticals on positioning and endorsements',
  rows: [
    { brand: 'Bespoke', positioning: 5, usp: 4, endorsements: 4, overall: 4.33, isBespoke: true },
    { brand: 'SkinCeuticals', positioning: 5, usp: 5, endorsements: 4, overall: 4.67 },
    { brand: 'Rationale', positioning: 5, usp: 4, endorsements: 3, overall: 4.0 },
    { brand: 'Maelove', positioning: 4, usp: 4, endorsements: 4, overall: 4.0 },
    { brand: 'Synergie Skin', positioning: 4, usp: 4, endorsements: 4, overall: 4.0 },
    { brand: 'Dr. Sam Bunting', positioning: 4, usp: 4, endorsements: 3, overall: 3.67 },
    { brand: 'Barefaced', positioning: 4, usp: 3, endorsements: 3, overall: 3.33 },
    { brand: 'AMPERNA', positioning: 4, usp: 3, endorsements: 2, overall: 3.0 },
    { brand: "Paula's Choice", positioning: null, usp: null, endorsements: null, overall: null },
  ] as GradeRow[],
  note: 'Company profile grades, 1 to 5; overall is the average of the three.',
  insights: [
    'Bespoke trails SkinCeuticals only on USP (4 against 5). On endorsements it is level with the best of the leaders (4), where Barefaced, Rationale and Dr. Sam Bunting score 3 and AMPERNA 2.',
    'Paula’s Choice has no grades in this run.',
  ],
}
