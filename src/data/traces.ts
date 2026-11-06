/**
 * What View traces shows for each answer (main design, 6 Nov): one tool call per step in prompts.ts, same order.
 * FILLER: the tool names and payloads are illustrative, shaped like the live product's traces (its first call,
 * submitIntentResolution, is copied from it); the figures in them are the answers' own (answers.ts, docs/DATA.md).
 */
export type TraceCall = { tool: string; payload: unknown }

const range = { start: '2023-07-01', end: '2026-06-30' }

export const traces: Record<string, TraceCall[]> = {
  'category-talk': [
    { tool: 'submitIntentResolution', payload: { status: 'ready', resolvedIntent: { metric: 'overview', scope: 'industry', dateRange: range, segment: null, topic: null, keywords: null, company: null, wantsTexts: false, comparisonBasis: 'none', assumptionsMade: ['Switched to the industry scope (the whole 51-topic social conversation) since the question is about the category, not Bespoke specifically.'] } } },
    { tool: 'getTopicShare', payload: { dimension: 'all', dateRange: range, quarters: 12, tags: 79480, topics: 51 } },
    { tool: 'rankShareGrowth', payload: { method: 'share_cagr', from: 'Y1', to: 'Y3', classifier: 'trend_pattern', gainingShare: 30, notRanked: { count: 2, reason: 'fewer than 12 quarters' } } },
  ],
  'where-bespoke-sits': [
    { tool: 'submitIntentResolution', payload: { status: 'ready', resolvedIntent: { metric: 'brand_strength', scope: 'competitive', dateRange: range, company: 'Bespoke', roster: 'named', rivals: 8, wantsTexts: false, comparisonBasis: 'peer_set' } } },
    { tool: 'getCompanyProfiles', payload: { roster: 'named', scale: '1-5', grades: { Bespoke: 4.33, SkinCeuticals: 4.67, Rationale: 4, 'Synergie Skin': 4, Maelove: 4, 'Dr. Sam Bunting': 3.67, Barefaced: 3.33, AMPERNA: 3 }, withheld: ["Paula's Choice"] } },
    { tool: 'getWebAuthority', payload: { metrics: ['seo_authority', 'traffic_growth'], Bespoke: { seoAuthority: 24, trafficGrowth: '-14.7%' }, rivalsMedianAuthority: 36 } },
    { tool: 'getBrandMentions', payload: { corpus: 'social', posts: 41836, companies: 9 } },
    { tool: 'buildCard', payload: { card: 'Appendix A4 · Brand strength' } },
  ],
  'what-cant-be-measured': [
    { tool: 'submitIntentResolution', payload: { status: 'ready', resolvedIntent: { metric: 'measurability', scope: 'competitive', dateRange: range, company: 'Bespoke', roster: 'shortlist', rivals: 8, wantsTexts: false, comparisonBasis: 'none' } } },
    { tool: 'checkDataPanels', payload: { panels: ['reviews', 'brand_love', 'kpis', 'website'], Bespoke: { reviews: 412, window: '2023-03 → 2026-07' }, rivalsCovered: { reviews: 7, brandLove: 7, website: 8 } } },
    { tool: 'recheckEmptyPanel', payload: { company: 'Rationale', panel: 'reviews', checks: 3, rows: 0, result: 'no reviews exist to collect' } },
    { tool: 'buildCard', payload: { card: 'Appendix B · About the data' } },
  ],
  whitespace: [
    { tool: 'submitIntentResolution', payload: { status: 'ready', resolvedIntent: { metric: 'whitespace', scope: 'competitive', dateRange: range, company: 'Bespoke', rivals: 8, wantsTexts: false, comparisonBasis: 'rivals' } } },
    { tool: 'findRivalOnlyTopics', payload: { heldByRivals: 33, heldByBespoke: 0 } },
    { tool: 'readTrendPatterns', payload: { readable: 25, tooVolatile: 8, rising: 14, flatOrDeclining: 11 } },
    { tool: 'rankGrowingTopics', payload: { method: 'share_cagr', genuinelyGrowing: 5 } },
    { tool: 'buildCard', payload: { card: 'Trends · what Bespoke leaves out' } },
  ],
  'hear-the-buyers': [
    { tool: 'submitIntentResolution', payload: { status: 'ready', resolvedIntent: { metric: 'purchase_drivers', scope: 'brand', dateRange: range, company: 'Bespoke', source: 'reviews', wantsTexts: true, comparisonBasis: 'leaders' } } },
    { tool: 'scorePurchaseDrivers', payload: { drivers: 17, reviews: 412, measures: ['net_sentiment', 'driver_importance'] } },
    { tool: 'compareWithLeaders', payload: { basis: 'leader_average', minMentions: 10 } },
    { tool: 'getBuyerQuotes', payload: { topics: ['texture', 'skin reactions'] } },
  ],
}
