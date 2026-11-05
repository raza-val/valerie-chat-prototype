import { WifiOff } from 'lucide-react'
import { errorCopy } from '@/data/ui'

/**
 * A tray tucked under the composer while the browser is offline: the composer overlaps its top (it carries
 * `relative z-10`), and the message sits centred in the strip below, on a brand-50 ground so it reads as the
 * system speaking, apart from the canvas (D22). Retry is a link in the sentence, so the tray holds no button box.
 */
export function OfflineStrip({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="status" className="-mt-4 flex animate-rise items-center justify-center gap-2 rounded-b-2xl bg-brand-50 px-4 pb-2.5 pt-[26px] text-sm ring-1 ring-brand-100 dark:bg-brand-950/40 dark:ring-brand-900/50">
      <WifiOff className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">
        <span className="font-semibold">{errorCopy.offline}</span> <span className="text-muted-foreground">{errorCopy.offlineDetail}</span>
      </span>
      <button type="button" onClick={onRetry} className="shrink-0 rounded font-semibold text-brand-600 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:text-brand-300">{errorCopy.retry}</button>
    </div>
  )
}
