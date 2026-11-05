import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-foreground/[0.06] text-foreground',
  up: 'bg-data-up/10 text-data-up dark:bg-data-up/20',
  down: 'bg-data-down/10 text-data-down dark:bg-data-down/20',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return <span className={cn('inline-flex h-5 items-center rounded-md px-2 text-xs font-semibold', tones[tone], className)}>{children}</span>
}
