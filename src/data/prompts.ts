/**
 * The five live prompts and Valerie's answers (the five the Figma answer designs cover).
 *
 * - The answer text for each prompt lives in answers.ts (same id).
 * - Numbers here have been changed from the Figma / live data. Every change is
 *   listed in docs/DATA.md. If you change a number, change it in the chart file too.
 */
import { ABSTRACT, VERSION } from '@/lib/aura'
import { totalSeconds } from '@/lib/format'

export type ChartId = 'topicShare' | 'brandStrength' | 'reviewSources' | 'leavesOut' | 'purchaseDrivers'
export type StarterIcon = 'tag' | 'telescope' | 'eyeOff' | 'compass' | 'trendingUp' | 'messageSquare'
export type Lens = 'Industry' | 'Competitive' | 'Brand'

export type Step = { label: string; detail: string; seconds: number }

export type Prompt = {
  id: string
  /** Short title used on the starter card and in the Chats list */
  title: string
  /** Shorter title used in the chat header and history */
  chatTitle: string
  icon: StarterIcon
  question: string
  lens: Lens
  /** One-line summary shown in the steps pill, e.g. "Analysed 79,480 topic tags" */
  summary: string
  steps: Step[]
  footnote: string
  /** The dashboard card shown under the answer; leave out for a text-only answer */
  chart?: ChartId
  followUps: string[]
  /** For the Chats list */
  when: string
}

export const followUpOffer = 'Want me to turn this into a full report, or should I look at something else?'
const followUps = ['Yes, make a full report', 'Compare with last quarter', 'Something else']

export const prompts: Prompt[] = [
  {
    id: 'category-talk',
    summary: 'Analysed 79,480 topic tags',
    title: 'See what the category talks about',
    chatTitle: 'What the skincare conversation talks about',
    icon: 'tag',
    lens: 'Industry',
    question: 'What does the skincare conversation actually talk about, and which topics are gaining share fastest?',
    steps: [
      { label: 'Understood the question', detail: 'Industry scope · whole category · 12 quarters', seconds: 0.4 },
      { label: 'Pulled topic tags', detail: 'topic_share(dimension = all) · 79,480 tags · 51 topics', seconds: 2.1 },
      { label: 'Ranked share growth', detail: 'share_cagr(Y1 → Y3) · trend_pattern classifier', seconds: 3.2 },
    ],
    footnote: 'Share growth: the yearly growth rate (CAGR) of a topic’s share of its own dimension, Y1 to Y3. 30 of 51 topics gained share. 2 topics measured on fewer than 12 quarters are not ranked.',
    chart: 'topicShare',
    followUps,
    when: 'Today',
  },
  {
    id: 'where-bespoke-sits',
    summary: 'Compared Bespoke with 8 named rivals',
    title: 'Find where Bespoke sits',
    chatTitle: 'Where Bespoke sits against peers',
    icon: 'telescope',
    lens: 'Competitive',
    question: 'Where does Bespoke sit against its peer set on brand strength, traffic and social engagement?',
    steps: [
      { label: 'Understood the question', detail: 'Competitive scope · 8 named rivals', seconds: 0.5 },
      { label: 'Read company profiles', detail: 'company_profile(roster = named) · 1–5 grades', seconds: 2.4 },
      { label: 'Read the website panel', detail: 'web_authority · traffic_growth', seconds: 2.2 },
      { label: 'Checked social mentions', detail: 'brand_mentions(corpus = social) · 41,836 posts', seconds: 1.9 },
      { label: 'Built the chart', detail: 'Card: Appendix A4 · Brand strength', seconds: 1.4 },
    ],
    footnote: 'The AI 1.5 company profile: 1-5 ordinal grades, never rates, run over the named roster for the first time on 2026-09-08. All 8 of 8 rivals were reached; 7 carry a brand potential. A blank is a measurement withheld, never a low grade.',
    chart: 'brandStrength',
    followUps,
    when: 'Today',
  },
  {
    id: 'what-cant-be-measured',
    summary: 'Checked 4 data panels for 9 brands',
    title: 'Show what can’t be measured',
    chatTitle: 'Topics that cannot be measured',
    icon: 'eyeOff',
    lens: 'Competitive',
    question: 'Which of our shortlisted competitors can actually be measured, and on which data?',
    steps: [
      { label: 'Understood the question', detail: 'Competitive scope · 8 shortlisted rivals', seconds: 0.4 },
      { label: 'Checked 4 data panels', detail: 'reviews · brand love · KPIs · website', seconds: 2.6 },
      { label: 'Re-checked empty panels', detail: '3 independent checks on Rationale reviews', seconds: 1.8 },
      { label: 'Built the chart', detail: 'Card: Appendix B · About the data', seconds: 1.3 },
    ],
    footnote: '7 of 8 named rivals are measurable in reviews; the one that is not has no collectable reviews, a ceiling, not a gap, and it is still measured by the website run. Published over the review corpus’s own window, 2023-03-01 to 2026-08-27; a narrower request does not narrow these figures.',
    chart: 'reviewSources',
    followUps,
    when: 'Today',
  },
  {
    id: 'whitespace',
    summary: 'Scanned 33 rival-held topics',
    title: 'Find the whitespace',
    chatTitle: 'Whitespace rivals hold',
    icon: 'compass',
    lens: 'Competitive',
    question: "Which topics do Bespoke's rivals hold that Bespoke doesn't, and which of them are actually growing?",
    steps: [
      { label: 'Understood the question', detail: 'Competitive scope · rival-held topics', seconds: 0.5 },
      { label: 'Found rival-only topics', detail: '33 topics held by ≥ 1 rival, 0 by Bespoke', seconds: 2.7 },
      { label: 'Read trend patterns', detail: 'trend_pattern · 25 readable, 8 too volatile', seconds: 2.5 },
      { label: 'Ranked the growing ones', detail: 'share_cagr · rivals holding each topic', seconds: 2.1 },
      { label: 'Built the chart', detail: 'Card: Trends · what Bespoke leaves out', seconds: 1.5 },
    ],
    footnote: 'Volume is topic assignments, 104,370 across the 51 topics, and never a post count. The figure beside each topic is how many of the 8 evidenced rivals hold it.',
    chart: 'leavesOut',
    followUps,
    when: 'Yesterday',
  },
  {
    id: 'hear-the-buyers',
    summary: 'Read Bespoke reviews across 17 purchase drivers',
    title: 'Hear it from the buyers',
    chatTitle: 'What buyers praise and complain about',
    icon: 'messageSquare',
    lens: 'Brand',
    question: 'What do buyers actually praise and complain about after purchase, and in their own words?',
    steps: [
      { label: 'Understood the question', detail: 'Brand scope · Bespoke reviews', seconds: 0.4 },
      { label: 'Scored 17 purchase drivers', detail: 'net_sentiment · driver_importance', seconds: 3.4 },
      { label: 'Compared with leaders', detail: 'leader_average(min 10 mentions)', seconds: 2.6 },
      { label: 'Pulled buyer quotes', detail: 'quotes(topic = texture, skin reactions)', seconds: 2.5 },
    ],
    footnote: 'Importance is how much each driver moves star ratings in the vendor’s model, scaled so the heaviest reads 10. Net sentiment is positive minus negative mentions, -100 to 100. Leaders: the named rivals’ average over the topics they have at least 10 mentions on.',
    chart: 'purchaseDrivers',
    followUps,
    when: 'Mon',
  },
]

export const getPrompt = (id?: string) => prompts.find((p) => p.id === id)

/**
 * The main design (6 Nov) uses the live product's wording for the starters, its client's name swapped for Bespoke.
 * The card, the question in the thread and the traces all read it from here. The archive keeps the wording above.
 */
const liveWording: Record<string, Pick<Prompt, 'title' | 'question'>> = {
  'category-talk': { title: 'See what the category talks about', question: 'What does the skincare conversation talk about, and which topics are gaining share?' },
  'where-bespoke-sits': { title: 'Find where Bespoke sits', question: 'Where does Bespoke sit against its peer set on brand strength and customer satisfaction?' },
  'what-cant-be-measured': { title: 'Show what can be measured', question: 'Which of our shortlisted competitors can be measured, and on which data?' },
  whitespace: { title: 'Find unclaimed topics', question: "Which topics do Bespoke's rivals hold that Bespoke doesn't, and how is each one trending?" },
  'hear-the-buyers': { title: 'Hear it from the buyers', question: 'What do buyers praise and complain about after purchase, in their own words?' },
}
if (VERSION === 'main') prompts.forEach((p) => Object.assign(p, liveWording[p.id]))

/** A suggested question on Home. One without an `id` has no answer yet: it shows, but can't be picked. */
export type Starter = Pick<Prompt, 'title' | 'question' | 'icon'> & { id?: string }

/** The main design's six suggested questions, in the live product's order. The growth numbers have no answer design yet (removed 27 Oct). */
export const homeStarters: Starter[] = [
  getPrompt('category-talk')!,
  getPrompt('where-bespoke-sits')!,
  getPrompt('what-cant-be-measured')!,
  getPrompt('whitespace')!,
  { title: 'Check the growth numbers', question: 'Which topics have a growth figure that their own trend pattern does not call a trend?', icon: 'trendingUp' },
  getPrompt('hear-the-buyers')!,
]

/**
 * v1–v4 wait longer, about 20s (19–21s), so Aura has time to change form the way a slow real reply does.
 * Each answer keeps its place in the order (the quickest takes 19s, the slowest 21s) and each step its share
 * of the wait; the header, the steps list and the traces show the same times. Logged in docs/DATA.md.
 */
if (ABSTRACT) {
  const totals = prompts.map((p) => totalSeconds(p.steps))
  const lo = Math.min(...totals), hi = Math.max(...totals)
  const tenth = (n: number) => Math.round(n * 10) / 10
  prompts.forEach((p, i) => {
    const target = tenth(19 + ((totals[i] - lo) / (hi - lo)) * 2)
    p.steps = p.steps.map((s) => ({ ...s, seconds: tenth((s.seconds * target) / totals[i]) }))
    // Rounding each step can leave the total a tenth off: the longest step takes up the difference.
    const longest = p.steps.reduce((m, s, j) => (s.seconds > p.steps[m].seconds ? j : m), 0)
    p.steps[longest] = { ...p.steps[longest], seconds: tenth(p.steps[longest].seconds + target - totalSeconds(p.steps)) }
  })
}

/** Very small matcher so typed questions still land on one of the five answers. */
export function matchPrompt(text: string): Prompt | undefined {
  const t = text.toLowerCase()
  const rules: [string, string[]][] = [
    ['hear-the-buyers', ['buyer', 'review', 'praise', 'complain', 'customer']],
    ['whitespace', ['whitespace', 'rival', 'doesn', 'gap', 'hold']],
    ['what-cant-be-measured', ['measur', 'data', 'shortlist']],
    ['where-bespoke-sits', ['peer', 'brand strength', 'traffic', 'sit', 'compare']],
    ['category-talk', ['conversation', 'topic', 'category', 'share']],
  ]
  for (const [id, words] of rules) if (words.some((w) => t.includes(w))) return getPrompt(id)
  return undefined
}
