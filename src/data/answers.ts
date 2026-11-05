/**
 * Valerie's answers, in the shape of the Figma answer designs (AI-chat-screen, "Output" 119:41560): a lead in
 * semibold, then plain paragraphs, a few opening with a bold run ("One caveat:"). The words are the live answer copy as
 * Figma has it; the numbers are the prototype's illustrative ones (see docs/DATA.md).
 */
export type Paragraph = string | { strong: string; text: string }
export type Answer = { lead: string; paragraphs: Paragraph[] }

export const answers: Record<string, Answer> = {
  'category-talk': {
    "lead": "The conversation is dominated by Needs and Selection factors, with Dark spot treatments and Mature population the fastest share gainers, though both are too erratic to call a clean trend.",
    "paragraphs": [
      "In the whole skincare conversation (industry scope, 79,480 dimension tags across the 12-quarter window), Needs makes up 32.7% of dimension tags and Selection factors 26.1%, together accounting for roughly 59% of what's discussed; Routine (14.6%), Product types (12.2%), Audience (7.7%) and Characteristics and ingredients (6.7%) trail well behind.",
      "On the growth side, the fastest share gainer by compound annual growth rate is Dark spot treatments (+54.8% share CAGR, 362 mentions in Product types), followed by Mature population (+33.2%, 648 mentions in Audience), then Pigmentation reduction (+28.4%, 1,620 mentions in Needs).",
      "The caveat matters here: both of the top two are classified \"erratic growth\" (quarterly share coefficient of variation at or above 0.40), meaning their 12-quarter path is too choppy to read that growth figure as a steady, ongoing trend rather than a volatile climb. Only 30 of the 51 taxonomy topics gained share at all over the window, and absolute mention counts rose independently of (and often far faster than) share, since collection volume itself expanded sharply in the final year, so a rising share isn't necessarily a rising raw conversation."
    ]
  },
  'where-bespoke-sits': {
    "lead": "Bespoke ranks second on brand strength but last on both traffic and visibility among its named rivals.",
    "paragraphs": [
      "On the company-profile instrument (competitive scope), Bespoke's brand potential grade is 4.33 (1-5 scale), trailing only SkinCeuticals (4.67) among the 8 named rivals; Rationale, Synergie Skin and Maelove all sit at 4.00, Dr. Sam Bunting at 3.67, Barefaced at 3.33, AMPERNA at 3.00, and Paula's Choice carries no grade (withheld, not a zero).",
      "On the separate website-authority panel, though, Bespoke's SEO authority is 24, the lowest of all nine points plotted (rivals' median is 36), while its traffic growth of -14.7% is actually better than three of the eight rivals (SkinCeuticals -35.2%, Paula's Choice -17.6%, AMPERNA -31.9%) and worse than the other five.",
      "For social engagement, the competitive dataset has no social-comparison measure at all; the closest proxy, how often each brand is named in the 41,836-post social corpus, shows Bespoke named 0 times, tied for last along with AMPERNA, Rationale and Synergie Skin, with SkinCeuticals leading at 58 namings. That zero reflects a corpus with no Instagram, blog, or geographic data (Bespoke sells into Australia/NZ), so it reads as a coverage gap, not proof of zero real-world presence.",
      "The chart below shows the brand-strength grades, the measure with the clearest read for a non-analyst; traffic and visibility are separate instruments with different denominators and aren't combinable into one score."
    ]
  },
  'what-cant-be-measured': {
    "lead": "Seven of your eight shortlisted rivals are measurable in reviews and brand love; the eighth has no reviews to measure, and all eight are covered on the website panel.",
    "paragraphs": [
      "Looking at the competitive measurability dataset: Bespoke itself is held on all four panels (412 reviews, 2023-03 to 2026-07; brand love; KPIs; website). Of the 8 named rivals, SkinCeuticals, Paula's Choice, Barefaced, Dr. Sam Bunting, Synergie Skin, Maelove and AMPERNA all have matched review and brand-love data (review counts ranging from 351 reviews for AMPERNA up to 5,214 for Dr. Sam Bunting, each with its own collection window).",
      "Rationale is the one exception: it has zero review rows across three independent checks, a genuine ceiling (no reviews exist to collect for that brand), not a gap in the crawl, so it also carries no brand-love evaluation.",
      "None of the 8 rivals carry a KPI score. That panel is structurally target-only (it scores Bespoke alone), so a blank there isn't a measurement miss. All 8 rivals, plus Bespoke, are held on the website performance panel, which has measured all eight named rivals since 2026-08-31."
    ]
  },
  'whitespace': {
    "lead": "Rivals have claimed real ground Bespoke hasn't touched, and five of those pockets are genuinely growing.",
    "paragraphs": [
      "Across the competitive data set (2023-07-01 to 2026-06-30), 33 topics are held by at least one of Bespoke's 8 rivals while Bespoke itself is scored on none of them. Of those 33, the trend classifier can only read a clear direction on 25; the other 8 (Value for money, Dermatologist recommendations, Texture and finish, Frequency and cycling, Exfoliating acids, Acne treatments, Post-procedure recovery, Clean-label ingredients) carry a growth number but their quarter-to-quarter share swings too much to call it a trend, so they're excluded from the \"growing\" list.",
      "Of the 25 with a readable direction, 14 are rising in share and 11 are flat-to-declining. But most of that growth is mild and sits inside the classifier's flat band (\"stable\" topics like Sunscreen +11.8%, Availability +12.4%, Layering and order +9.1%). The topics that actually earn a \"growing\" label from the pattern itself (erratic growth or sustained hype) are five: Dark spot treatments (+54.8% share CAGR, held by 7 of 8 rivals, 362 mentions), Active compatibility (+17.8%, 7 of 8 rivals, 498 mentions), Peptides and collagen-supporting ingredients (+15.9%, 6 of 8 rivals, 571 mentions), Vitamin C and antioxidants (+16.6%, 7 of 8 rivals, 1,163 mentions), and Visible radiance improvement (+15.1%, all 8 rivals, 2,512 mentions).",
      "One caveat worth flagging: absolute mention counts jumped far faster than these share figures across the window (e.g. Dark spot treatments went from 19 to 298 mentions year to year), which reflects the crawl's collection expanding in the final year, not necessarily the category itself ballooning. Share, not raw mentions, is the number to trust here."
    ]
  },
  'hear-the-buyers': {
    "lead": "Bespoke's buyers love what the product does to their skin, but skin reactions are the one real sore spot.",
    "paragraphs": [
      "Looking at Bespoke's review record across all 17 purchase-driver topics (review corpus, published over its own window of 2023-03-01 to 2026-08-27, since a narrower request doesn't narrow these figures): product effectiveness is the strongest praised theme with a net sentiment of +74 on 276 reviews, running ahead of the aspirational-leader average of +71. Ingredients and formulation (+70 net on 24 reviews) and texture (+73 on 109 reviews) also both beat the leader average.",
      "The clear weak spot is skin reactions, the single heaviest driver of star ratings in the vendor's model (importance 10 of 10), where Bespoke sits at just +12 net sentiment on 38 reviews, 22 points behind the leader average of +34. Several other topics (ordering and delivery, customer service, acne and pore control, brand reputation, sun protection) have too few reviews (5 to 9 each) to score reliably and are flagged as thin rather than scored.",
      {
        "strong": "In buyers' own words:",
        "text": " praise clusters around texture and routine simplicity (\"My favourite cleanser of all time. Gentle yet effective and leaves my skin clean, soft and moisturised\"; \"Fine lines have decreased. Pigmentation has reduced... Love the simplicity of the products\"). The complaints that surface are specifically about breakouts: \"I'm really struggling with this product... it just breaks me out every time I use, which I'm so sad about\" and \"I really wanted to love this but all it did was congest my skin and break me out.\" That matches the quantified gap on skin reactions, so this isn't a one-off."
      },
      {
        "strong": "One caveat:",
        "text": " the skin reactions sample (n=38) is modest, so the -22 point gap versus leaders is directionally real but shouldn't be read as a precise number."
      }
    ]
  }
}
