/**
 * The six live prompts and Valerie's answers.
 *
 * - `answer` is Markdown-lite: blank line = new paragraph, **text** = bold.
 *   The first paragraph is shown as the answer's headline (the "lead").
 * - Numbers here have been changed from the Figma / live data. Every change is
 *   listed in docs/DATA.md. If you change a number, change it in the chart file too.
 */
export type ChartId = 'topicShare' | 'brandStrength' | 'reviewSources' | 'leavesOut' | 'sweetSpot' | 'purchaseDrivers'
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
  answer: string
  footnote: string
  chart: ChartId
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
      { label: 'Built the chart', detail: 'Card: Trends · the big picture', seconds: 1.5 },
    ],
    answer: `**The conversation is dominated by Needs and Selection factors, with Dark spot treatments and Mature population the fastest share gainers, though both are too erratic to call a clean trend.**

In the whole skincare conversation (industry scope, 79,480 dimension tags across the 12-quarter window), Needs makes up 32.7% of dimension tags and Selection factors 26.1%, together accounting for roughly 59% of what's discussed; Routine (14.6%), Product types (12.2%), Audience (7.7%) and Characteristics and ingredients (6.7%) trail well behind.

On the growth side, the fastest share gainer by compound annual growth rate is Dark spot treatments (+54.8% share CAGR, 362 mentions in Product types), followed by Mature population (+33.2%, 648 mentions in Audience), then Pigmentation reduction (+28.4%, 1,620 mentions in Needs).

The caveat matters here: both of the top two are classified "erratic growth" (quarterly share coefficient of variation at or above 0.40), meaning their 12-quarter path is too choppy to read that growth figure as a steady, ongoing trend rather than a volatile climb. Only 30 of the 51 taxonomy topics gained share at all over the window, and absolute mention counts rose independently of (and often far faster than) share, since collection volume itself expanded sharply in the final year, so a rising share isn't necessarily a rising raw conversation.`,
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
    answer: `**Bespoke ranks second on brand strength but last on both traffic and visibility among its named rivals.**

On the company-profile instrument (competitive scope), Bespoke's brand potential grade is 4.33 (1-5 scale), trailing only SkinCeuticals (4.67) among the 8 named rivals; Rationale, Synergie Skin and Maelove all sit at 4.00, Dr. Sam Bunting at 3.67, Barefaced at 3.33, AMPERNA at 3.00, and Paula's Choice carries no grade (withheld, not a zero).

On the separate website-authority panel, though, Bespoke's SEO authority is 24, the lowest of all nine points plotted (rivals' median is 36), while its traffic growth of -14.7% is actually better than three of the eight rivals (SkinCeuticals -35.2%, Paula's Choice -17.6%, AMPERNA -31.9%) and worse than the other five.

For social engagement, the competitive dataset has no social-comparison measure at all; the closest proxy, how often each brand is named in the 41,836-post social corpus, shows Bespoke named 0 times, tied for last along with AMPERNA, Rationale and Synergie Skin, with SkinCeuticals leading at 58 namings. That zero reflects a corpus with no Instagram, blog, or geographic data (Bespoke sells into Australia/NZ), so it reads as a coverage gap, not proof of zero real-world presence.

The chart below shows the brand-strength grades, the measure with the clearest read for a non-analyst; traffic and visibility are separate instruments with different denominators and aren't combinable into one score.`,
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
    answer: `**Seven of your eight shortlisted rivals are measurable in reviews and brand love; the eighth has no reviews to measure, and all eight are covered on the website panel.**

Looking at the competitive measurability dataset: Bespoke itself is held on all four panels (412 reviews, 2023-03 to 2026-07; brand love; KPIs; website). Of the 8 named rivals, SkinCeuticals, Paula's Choice, Barefaced, Dr. Sam Bunting, Synergie Skin, Maelove and AMPERNA all have matched review and brand-love data (review counts ranging from 351 reviews for AMPERNA up to 5,214 for Dr. Sam Bunting, each with its own collection window).

Rationale is the one exception: it has zero review rows across three independent checks, a genuine ceiling (no reviews exist to collect for that brand), not a gap in the crawl, so it also carries no brand-love evaluation.

None of the 8 rivals carry a KPI score. That panel is structurally target-only (it scores Bespoke alone), so a blank there isn't a measurement miss. All 8 rivals, plus Bespoke, are held on the website performance panel, which has measured all eight named rivals since 2026-08-31.`,
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
    answer: `**Rivals have claimed real ground Bespoke hasn't touched, and five of those pockets are genuinely growing.**

Across the competitive data set (2023-07-01 to 2026-06-30), 33 topics are held by at least one of Bespoke's 8 rivals while Bespoke itself is scored on none of them. Of those 33, the trend classifier can only read a clear direction on 25; the other 8 (Value for money, Dermatologist recommendations, Texture and finish, Frequency and cycling, Exfoliating acids, Acne treatments, Post-procedure recovery, Clean-label ingredients) carry a growth number but their quarter-to-quarter share swings too much to call it a trend, so they're excluded from the "growing" list.

Of the 25 with a readable direction, 14 are rising in share and 11 are flat-to-declining. But most of that growth is mild and sits inside the classifier's flat band ("stable" topics like Sunscreen +11.8%, Availability +12.4%, Layering and order +9.1%). The topics that actually earn a "growing" label from the pattern itself (erratic growth or sustained hype) are five: Dark spot treatments (+54.8% share CAGR, held by 7 of 8 rivals, 362 mentions), Active compatibility (+17.8%, 7 of 8 rivals, 498 mentions), Peptides and collagen-supporting ingredients (+15.9%, 6 of 8 rivals, 571 mentions), Vitamin C and antioxidants (+16.6%, 7 of 8 rivals, 1,163 mentions), and Visible radiance improvement (+15.1%, all 8 rivals, 2,512 mentions).

One caveat worth flagging: absolute mention counts jumped far faster than these share figures across the window (e.g. Dark spot treatments went from 19 to 298 mentions year to year), which reflects the crawl's collection expanding in the final year, not necessarily the category itself ballooning. Share, not raw mentions, is the number to trust here.`,
    footnote: 'Volume is topic assignments, 104,370 across the 51 topics, and never a post count. The figure beside each topic is how many of the 8 evidenced rivals hold it.',
    chart: 'leavesOut',
    followUps,
    when: 'Yesterday',
  },
  {
    id: 'growth-numbers',
    summary: 'Classified 51 industry topics',
    title: 'Check the growth numbers',
    chatTitle: 'Growth figures vs trend pattern',
    icon: 'trendingUp',
    lens: 'Industry',
    question: 'Which topics have a growth figure that their own trend pattern says is not a trend?',
    steps: [
      { label: 'Understood the question', detail: 'Industry scope · all 51 topics', seconds: 0.4 },
      { label: 'Classified trend patterns', detail: 'trend_pattern · stable / erratic / directional', seconds: 3.6 },
      { label: 'Built the chart', detail: 'Card: Appendix A1 · Trend sweet spot', seconds: 1.8 },
    ],
    answer: `**34 of the 51 industry topics carry a growth figure their own trend pattern explicitly declines to call a trend.**

Using the trend-pattern classification for the whole industry conversation (all 51 topics, 2023-07-01 to 2026-06-30), two labels assert a shape rather than a direction: "stable" (share moved too little to call a direction) and "erratic" (quarterly swings too volatile for the endpoints to describe it). Together that's 22 stable + 12 erratic = 34 topics, 66.7% of the taxonomy. Every one of them still prints a share CAGR number, but the classifier's own flag on both groups says that number must not be read as a trend.

**Stable (22):** Social confidence, Product effectiveness, Routine simplicity guidance, Lifestyle and inside-out care, Ingredient safety, Mainstream female audience, Cleansers, Moisturizers, Ageing signs correction, Skin type suitability, Irritation and redness relief, Barrier resilience, Sunscreen, Retinoids, DIY and home remedies, Availability, Morning routine, Emerging and novel ingredients, Layering and order, Authenticity, Hydrating humectants, Face mists.

**Erratic (12):** Value for money, Dermatologist recommendations, Texture and finish, Adolescent skincare, Frequency and cycling, Exfoliating acids, Acne treatments, Post-procedure recovery, Men's skincare, Clean-label ingredients, Packaging, Cancer treatment support.

**Caveat:** the classifier's own footnote notes 2 of the 51 topics are fitted on fewer than twelve quarters of data, so their pattern label rests on a shorter window than the rest. The other 17 topics (5 sustained hype, 7 erratic growth, 5 erratic decline) do get a direction-asserting label, by construction agreeing in sign with their growth figure, so those aren't part of this answer.`,
    footnote: 'Pattern and direction agree by construction: the classifier was fitted on the same share CAGR the cards print. 2 topics are fitted on fewer than twelve quarters.',
    chart: 'sweetSpot',
    followUps,
    when: 'Mon',
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
    answer: `**Bespoke's buyers love what the product does to their skin, but skin reactions are the one real sore spot.**

Looking at Bespoke's review record across all 17 purchase-driver topics (review corpus, published over its own window of 2023-03-01 to 2026-08-27, since a narrower request doesn't narrow these figures): product effectiveness is the strongest praised theme with a net sentiment of +74 on 276 reviews, running ahead of the aspirational-leader average of +71. Ingredients and formulation (+70 net on 24 reviews) and texture (+73 on 109 reviews) also both beat the leader average.

The clear weak spot is skin reactions, the single heaviest driver of star ratings in the vendor's model (importance 10 of 10), where Bespoke sits at just +12 net sentiment on 38 reviews, 22 points behind the leader average of +34. Several other topics (ordering and delivery, customer service, acne and pore control, brand reputation, sun protection) have too few reviews (5 to 9 each) to score reliably and are flagged as thin rather than scored.

**In buyers' own words:** praise clusters around texture and routine simplicity ("My favourite cleanser of all time. Gentle yet effective and leaves my skin clean, soft and moisturised"; "Fine lines have decreased. Pigmentation has reduced... Love the simplicity of the products"). The complaints that surface are specifically about breakouts: "I'm really struggling with this product... it just breaks me out every time I use, which I'm so sad about" and "I really wanted to love this but all it did was congest my skin and break me out." That matches the quantified gap on skin reactions, so this isn't a one-off.

**One caveat:** the skin reactions sample (n=38) is modest, so the -22 point gap versus leaders is directionally real but shouldn't be read as a precise number.`,
    footnote: 'Importance is how much each driver moves star ratings in the vendor’s model, scaled so the heaviest reads 10. Net sentiment is positive minus negative mentions, -100 to 100. Leaders: the named rivals’ average over the topics they have at least 10 mentions on.',
    chart: 'purchaseDrivers',
    followUps,
    when: 'Mon',
  },
]

export const getPrompt = (id?: string) => prompts.find((p) => p.id === id)

/** Very small matcher so typed questions still land on one of the six answers. */
export function matchPrompt(text: string): Prompt | undefined {
  const t = text.toLowerCase()
  const rules: [string, string[]][] = [
    ['hear-the-buyers', ['buyer', 'review', 'praise', 'complain', 'customer']],
    ['whitespace', ['whitespace', 'rival', 'doesn', 'gap', 'hold']],
    ['what-cant-be-measured', ['measur', 'data', 'shortlist']],
    ['growth-numbers', ['growth figure', 'not a trend', 'pattern', 'erratic']],
    ['where-bespoke-sits', ['peer', 'brand strength', 'traffic', 'sit', 'compare']],
    ['category-talk', ['conversation', 'topic', 'category', 'share']],
  ]
  for (const [id, words] of rules) if (words.some((w) => t.includes(w))) return getPrompt(id)
  return undefined
}
