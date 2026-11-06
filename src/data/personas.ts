import milo from '@/assets/milo.jpg'
import brie from '@/assets/brie.png' // Figma 124:37007

export type Persona = {
  id: string; name: string; role: string; avatar?: string; initials: string
  /** Show tool calls under each step. Off for roles that only need what Valerie did, not how. */
  toolDetail: boolean
  /** What Valerie writes for this role in the main design: an answer in the thread, or a document beside it (`briefs.ts`). */
  writes: 'answer' | 'brief'
}

/** Who Valerie tunes its answers for. The first entry is the default. */
export const personas: Persona[] = [
  { id: 'milo', name: 'Milo', role: 'Data Analyst', avatar: milo, initials: 'M', toolDetail: true, writes: 'answer' },
  // Content Strategist: the live product's name for her role (6 Nov; Brand Manager until then).
  { id: 'brie', name: 'Brie', role: 'Content Strategist', avatar: brie, initials: 'B', toolDetail: false, writes: 'brief' },
]
