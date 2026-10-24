import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'outline' | 'ghost' | 'primary' | 'chip'
type Size = 'sm' | 'md' | 'icon'

const variants: Record<Variant, string> = {
  outline: 'border border-border bg-background text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-muted',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  primary: 'bg-brand-950 text-white hover:bg-brand-900 dark:bg-brand-500 dark:hover:bg-brand-400',
  chip: 'rounded-full border border-border bg-background text-foreground hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-muted',
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
        variants[variant], sizes[size], variant === 'chip' && 'h-8 px-3.5 text-sm font-normal', className,
      )}
      {...props}
    />
  )
})
