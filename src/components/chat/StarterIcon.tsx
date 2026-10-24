import { Compass, EyeOff, MessageSquare, Tag, Telescope, TrendingUp } from 'lucide-react'
import type { StarterIcon as Name } from '@/data/prompts'

const map = { tag: Tag, telescope: Telescope, eyeOff: EyeOff, compass: Compass, trendingUp: TrendingUp, messageSquare: MessageSquare }

export function StarterIcon({ name, className }: { name: Name; className?: string }) {
  const I = map[name]
  return <I className={className} />
}
