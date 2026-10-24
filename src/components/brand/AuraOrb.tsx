import { cn } from '@/lib/cn'

const TOP = 'M20.5107 9.4469L24.7806 13.7652H34.3122C33.9394 13.5969 33.5733 13.4185 33.2106 13.2334C27.929 10.5475 23.5858 6.22248 20.8502 0.830513C20.7503 0.635299 20.6538 0.436719 20.5574 0.238136L20.5074 0.130432L20.4575 0.238136C20.361 0.436719 20.2645 0.635299 20.1646 0.830513C17.4323 6.22248 13.0859 10.5475 7.80431 13.2334C7.44155 13.4185 7.07546 13.5935 6.70273 13.7652H16.2343L20.504 9.4469H20.5107Z'
const BOT = 'M41.0213 16.0034H27.343C24.6707 17.7401 22.3411 20.0087 20.5106 22.708C18.7335 20.0928 16.4871 17.8781 13.9178 16.1616C13.8379 16.1078 13.758 16.0539 13.6782 16.0034H0L2.84215 16.8179C10.5565 19.0259 16.9696 24.465 20.4607 31.7652L20.5106 31.8729L20.5606 31.7652C24.0517 24.465 30.4647 19.0259 38.1792 16.8179L41.0213 16.0034Z'

/**
 * Aura, Valerie's mascot: a navy orb with the white Valerie mark.
 * `thinking` adds a rotating progress ring; `halo` adds the soft glow used on Home.
 */
export function AuraOrb({ size = 28, thinking = false, halo = false, className }: { size?: number; thinking?: boolean; halo?: boolean; className?: string }) {
  return (
    <span className={cn('relative inline-grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      {halo && <span className="absolute -inset-[45%] rounded-full bg-[radial-gradient(circle,var(--brand-200)_0%,transparent_65%)] opacity-70 blur-md dark:opacity-30" />}
      {thinking && (
        <span
          className="absolute -inset-[4px] animate-spin rounded-full [animation-duration:1.3s]"
          style={{ background: 'conic-gradient(var(--brand-500) 0 120deg, var(--brand-100) 120deg 360deg)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))', mask: 'radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))' }}
        />
      )}
      <span
        className={cn('relative grid size-full place-items-center rounded-full', halo && 'animate-breathe')}
        style={{
          background: 'radial-gradient(circle at 35% 28%, var(--brand-800) 0%, var(--brand-950) 62%)',
          boxShadow: `inset 0 0 0 1px var(--brand-800), 0 ${size * 0.1}px ${size * 0.22}px ${-size * 0.08}px rgba(23,28,84,.45)`,
        }}
      >
        <svg viewBox="-4 -4 49 40" style={{ width: size * 0.48 }} aria-hidden>
          <path fill="#fff" d={TOP} />
          <path fill="#fff" d={BOT} />
        </svg>
      </span>
    </span>
  )
}
