import milo from '@/assets/milo.jpg'

export type Persona = { id: string; name: string; role: string; avatar?: string; initials: string }

/** Who Valerie tunes its answers for. The first entry is the default. */
export const personas: Persona[] = [
  { id: 'milo', name: 'Milo', role: 'Data Analyst', avatar: milo, initials: 'M' },
  { id: 'brie', name: 'Brie', role: 'Brand Manager', initials: 'B' },
]
