/**
 * The content strategist's output (main design, 6 Nov). When Brie, the Content Strategist, asks, Valerie writes a
 * document instead of an answer, and it opens beside the chat. The text is the live product's, word for word (the user's
 * screenshots, 6 Nov): only its layout is ours. Don't edit a word of it.
 * Only "Find where Bespoke sits" has a brief; Brie's other questions get the usual answer.
 */
export type BriefSection =
  | { title: string; text: string }
  /** The line to say, set as a pull quote. */
  | { title: string; quote: string }
  /** A list. An item ending in a parenthesis (its source) shows that part muted. */
  | { title: string; items: string[] }

export type Brief = {
  /** Valerie's line in the chat */
  reply: string
  /** The document's kind, over its title */
  kind: string
  date: string
  title: string
  sections: BriefSection[]
}

export const briefs: Record<string, Brief> = {
  'where-bespoke-sits': {
    reply: "Here's your brief, on the right. Keep chatting here to sharpen it.",
    kind: 'ContextCore Analytics Report',
    date: 'Tuesday, October 27, 2026',
    title: 'Content brief: Bespoke brand strength vs satisfaction standing',
    sections: [
      {
        title: 'Audience',
        text: "Prospective buyers comparing Bespoke to its named rivals, who see generic brand confidence signals but have no visibility into Bespoke's actual satisfaction standing against the field, where it currently ranks 43rd of 73.",
      },
      {
        title: 'The shift',
        text: 'No trend is established here, this is a snapshot, not a change over time. Bespoke sits at the 93rd percentile on brand strength (4.33 of 5) but only the 40th percentile on standing vs the field (2.22), a steady gap between public positioning and competitive satisfaction.',
      },
      {
        title: 'Which pillar',
        text: 'Territory: endorsements. Bespoke leads market (2.57) and aspirational leaders (3.29) by the widest margin of any sub-grade, scoring 4.0, so this territory is wide open for Bespoke to claim rather than crowded.',
      },
      {
        title: 'The message',
        quote: '"Bespoke earns the trust signals that matter, and it\'s time the market saw the endorsements behind them."',
      },
      {
        title: 'The proof',
        items: [
          'Brand strength composite is 4.33 of 5, 93rd percentile of 541 peers (brand scope headline scorecard, profile carries no date, falls outside the report window)',
          'On endorsements specifically, Bespoke scores 4.0 vs market 2.57 and leaders 3.29 (brand-strength grading, market is the 541 pool, leaders is 7 of 8 named rivals)',
          'Standing vs the field is only 2.22, 40th percentile of 60, the weakest of four satisfaction KPIs (satisfaction KPI run, 31 Aug 2026, scored against skincare targets, not the eight named rivals)',
          'Review net sentiment (consumer delight) is 72 vs market 56 and leaders 63 (brand summary, different market base than the KPI cohorts)',
        ],
      },
      {
        title: 'What to publish',
        items: [
          'An "endorsements" landing page quoting the 4.0 vs 2.57 market gap, built for the comparison/why-Bespoke page.',
          'A review-sentiment carousel (72 net sentiment) placed on product pages to carry delight into purchase decisions.',
          'A short social clip translating the positioning lead (5.0 vs market 4.04) into a trust-signal post, run on the channels where engagement (2.88) already beats market.',
        ],
      },
      {
        title: 'What to stop saying',
        text: 'Retire any "best in class across the board" satisfaction claim. Standing vs the field sits at 40th percentile, the weakest of four KPIs, so a blanket satisfaction-leader line isn\'t carried by the evidence.',
      },
    ],
  },
}

