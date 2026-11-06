import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'outline' | 'ghost' | 'primary' | 'chip' | 'ds'
type Size = 'sm' | 'md' | 'icon'

/**
 * Main design (6 Nov): the DS Button, outline (36px, 1px `--border`, `--primary` text, 16px icons), fully rounded
 * by the user's call over the DS's 12px corners. The header controls and the follow-up chips share it.
 */
export const dsOutline = 'h-9 rounded-full border border-border bg-background text-primary transition-colors hover:bg-muted [&_svg]:size-4 [&_svg]:shrink-0'

const variants: Record<Variant, string> = {
  outline: 'border border-border bg-background text-foreground shadow-hairline hover:bg-muted',
  ghost: 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  chip: 'rounded-full bg-surface text-foreground shadow-hairline transition-shadow hover:shadow-float',
  ds: dsOutline,
}
const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm font-semibold',
  md: 'h-9 gap-2 px-3.5 text-sm font-semibold',
  icon: 'size-8 justify-center',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'outline', size = 'sm', className, ...props }, ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        variants[variant], sizes[size], variant === 'chip' && 'h-8 px-3.5 text-sm font-normal',
        // DS label: 14/24 semibold, 16px in from each side (the DS's 8 + 4, plus the 4 the user asked for on Chats)
        variant === 'ds' && 'h-9 gap-1.5 px-4 text-sm font-semibold leading-6', className,
      )}
      {...props}
    />
  )
})
