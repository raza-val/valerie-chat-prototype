/**
 * R1 · "Trends · the big picture" card.
 * Quarterly share of Needs mentions per topic (each quarter adds up to ~100).
 * The quarterly series is illustrative (generated to match the 3-year averages);
 * the lists below are the values the card prints. See docs/DATA.md.
 */
export const topicShare = {
  eyebrow: 'Trends · the big picture',
  title: 'In needs, pigmentation reduction grows fastest (+28% a year), while sun damage prevention (−15%) and routine simplicity (−14%) lose share',
  tabs: ['Overall', 'Needs', 'Product types', 'Characteristics and ingredients', 'Selection factors', 'Routine', 'Audience'],
  activeTab: 'Needs',
  quarters: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
  series: [
    { topic: 'Social confidence', color: '#7c9cc4', values: [24.0, 23.5, 23.4, 24.6, 24.9, 25.0, 24.2, 22.9, 23.3, 22.9, 24.0, 22.7] },
    { topic: 'Routine simplicity guidance', color: '#f9bf86', values: [24.8, 25.7, 23.1, 22.6, 21.4, 20.4, 21.9, 19.4, 20.3, 18.3, 18.0, 17.1] },
    { topic: 'Acne clearing control', color: '#f58b8b', values: [9.4, 8.6, 9.6, 9.7, 11.2, 10.9, 11.6, 11.6, 13.0, 13.2, 12.5, 12.7] },
    { topic: 'Ageing signs correction', color: '#a8dcd6', values: [8.8, 8.7, 9.9, 9.2, 8.5, 9.0, 8.5, 9.6, 8.4, 8.9, 9.2, 9.5] },
    { topic: 'Irritation and redness relief', color: '#93c58b', values: [7.0, 6.9, 6.7, 6.8, 6.8, 6.9, 6.8, 6.7, 6.7, 7.0, 6.8, 7.5] },
    { topic: 'Barrier resilience', color: '#f6d47a', values: [6.5, 7.0, 7.0, 6.5, 7.1, 6.8, 7.1, 7.2, 6.9, 7.3, 7.1, 7.2] },
    { topic: 'Visible radiance improvement', color: '#d6a6cc', values: [4.7, 5.1, 5.6, 5.7, 5.4, 6.1, 5.6, 6.5, 6.3, 6.8, 6.9, 7.1] },
    { topic: 'Sun damage prevention', color: '#fbc4cf', values: [6.4, 5.8, 5.8, 5.7, 5.3, 5.4, 4.8, 5.1, 4.5, 4.0, 4.1, 4.0] },
    { topic: 'Pigmentation reduction', color: '#b9978a', values: [2.7, 3.2, 3.3, 3.3, 3.4, 3.8, 3.8, 4.7, 4.7, 5.2, 5.3, 5.6] },
    { topic: 'Post-procedure recovery', color: '#b6e3dc', values: [3.5, 3.1, 3.1, 3.2, 3.2, 3.1, 2.7, 3.1, 2.7, 2.8, 2.5, 2.5] },
    { topic: 'Pore appearance refinement', color: '#ef8fa8', values: [1.5, 1.7, 1.6, 1.8, 1.9, 1.8, 1.9, 2.1, 2.1, 2.5, 2.4, 2.8] },
    { topic: 'Rapid weight-loss skin adaptation', color: '#d9d4cf', values: [0.7, 0.8, 0.8, 0.9, 0.9, 1.0, 1.1, 1.1, 1.1, 1.2, 1.2, 1.4] },
  ],
  topTopics: {
    title: 'Top topics', subtitle: 'share of needs mentions, 3 years',
    rows: [['Social confidence', 24], ['Routine simplicity guidance', 21], ['Acne clearing control', 11], ['Ageing signs correction', 9], ['Irritation and redness relief', 7], ['Barrier resilience', 7]] as [string, number][],
  },
  fastestGrowing: {
    title: 'Fastest growing', subtitle: 'share growth per year',
    rows: [['Pigmentation reduction', 28.4], ['Pore appearance refinement', 21.6], ['Rapid weight-loss skin adaptation', 19.7], ['Acne clearing control', 16.3], ['Visible radiance improvement', 15.1]] as [string, number][],
  },
  mostDeclining: {
    title: 'Most declining', subtitle: 'share growth per year',
    rows: [['Sun damage prevention', -14.8], ['Routine simplicity guidance', -13.6], ['Post-procedure recovery', -9.9], ['Ageing signs correction', -1.9], ['Social confidence', -0.6]] as [string, number][],
  },
}
