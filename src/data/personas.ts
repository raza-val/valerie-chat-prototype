import milo from '@/assets/milo.jpg'
import brie from '@/assets/brie.png' // Figma 124:37007

export type Persona = {
  id: string; name: string; role: string; avatar?: string; initials: string
  /** Show tool calls under each step. Off for roles that only need what Valerie did, not how. */
  toolDetail: boolean
}

/** Who Valerie tunes its answers for. The first entry is the default. */
export const personas: Persona[] = [
  { id: 'milo', name: 'Milo', role: 'Data Analyst', avatar: milo, initials: 'M', toolDetail: true },
  { id: 'brie', name: 'Brie', role: 'Brand Manager', avatar: brie, initials: 'B', toolDetail: false },
]
