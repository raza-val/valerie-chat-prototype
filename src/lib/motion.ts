/** Motion timings shared by the answer (streaming lead, staggered blocks) and the turn (chart reveal). */
export const WORD_MS = 38

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** How long the lead takes to stream in, in ms. */
export const streamMs = (lead: string) => (reducedMotion() ? 0 : lead.split(' ').length * WORD_MS)
