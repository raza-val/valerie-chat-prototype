/**
 * Interface copy for prototype features that are not in the live product yet.
 * Strings marked DRAFT were written for the prototype: confirm or replace them.
 */
/** DRAFT: thread divider when the persona changes. */
export const personaCopy = {
  switched: 'Now tuned for',
}

/**
 * DRAFT: the model picker in the composer (Home and thread), and the thread divider when the model changes.
 * Every model gives the same answers in the prototype. The first entry is the default. Confirm the names before showing.
 */
export const modelCopy = {
  switched: 'Now answering with',
  /** screen readers only */
  label: 'Model',
  models: [
    { id: 'opus', name: 'Claude Opus 5.5' },
    { id: 'sonnet', name: 'Claude Sonnet 5.5' },
    { id: 'gpt', name: 'GPT-6.1' },
    { id: 'gemini', name: 'Gemini 4' },
  ],
}
export type Model = (typeof modelCopy.models)[number]

/** A question the prototype has no answer for. Prototype-only: the live product would answer it. */
export const unknownCopy = {
  lead: 'This prototype has answers for five questions. Pick one to see how Valerie responds:',
}

/** Long threads. `jump` is from the backlog brief. */
export const threadCopy = {
  jump: 'Jump to latest',
}

/** All DRAFT except `trace` (live: steps panel button). */
export const errorCopy = {
  /** answer header, e.g. "Stopped at step 3 of 4" */
  stoppedAt: (step: number, total: number) => `Stopped at step ${step} of ${total}`,
  stepFailed: 'Failed',
  answerFailed: 'Valerie couldn’t finish this answer.',
  chartFailed: 'The chart couldn’t be built.',
  retry: 'Retry',
  trace: 'Open full trace',
  offline: 'You’re offline.',
  offlineDetail: 'Valerie will answer once you’re back online.',
}

/** DRAFT: the sound toggle in the chat's pills (icon only; these are its label and tooltip). */
export const soundCopy = {
  label: 'Sound',
  on: 'Sound on',
  off: 'Sound off',
}

/** DRAFT: tapping Aura plays its line (the headline, or the greeting on Home), or stops it. Label and tooltip. */
export const voiceCopy = {
  listen: 'Listen',
  stop: 'Stop',
  /** Home, without a voice: the tap replays the greeting silently (the words ink, Aura moves). */
  replay: 'Replay greeting',
}

/** DRAFT: the starter tabs on Home. The other tabs are the lens names from `prompts.ts`. */
export const startersCopy = {
  all: 'All',
  /** screen readers only */
  tabs: 'Starter questions by lens',
}

/** DRAFT: the Home layout of v4, where the suggested questions sit beside the composer instead of under it. */
export const homeCopy = {
  /** the heading over the suggestions */
  suggestions: 'Suggested questions',
}

/** Approved 27 Oct: Version B's browser-tab title, so the two versions are easy to tell apart side by side. */
export const versionCopy = {
  titleB: 'Valerie · Conversational AI · Constellation',
}

/** DRAFT: the versions page (`/versions`), opened from the logo. A tool for presenting, not part of the product. */
export const versionsCopy = {
  title: 'Versions',
  versions: [
    { href: '/v1', tag: 'v1', name: 'Solid acrylic', home: 'Questions in pairs under the composer' },
    { href: '/v2', tag: 'v2', name: 'Constellation', home: 'Questions in tabs under the composer' },
    { href: '/v3', tag: 'v3', name: 'Mark orb', home: 'Questions under the composer' },
    { href: '/v4', tag: 'v4', name: 'Hologram', home: 'Questions beside the composer' },
  ],
  experiments: { href: '/exp', label: 'Aura experiments' },
  botExperiments: { href: '/exp/bot', label: 'Bot experiments' },
}
