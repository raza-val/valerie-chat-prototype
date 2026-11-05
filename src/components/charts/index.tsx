import { AlertCircle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ChartId } from '@/data/prompts'
import * as data from '@/data/charts'
import { errorCopy } from '@/data/ui'
import { TopicShareChart } from './TopicShareChart'
import { BrandStrengthTable } from './BrandStrengthTable'
import { ReviewSourcesChart } from './ReviewSourcesChart'
import { LeavesOutCards } from './LeavesOutCards'
import { PurchaseDrivers } from './PurchaseDrivers'

import { ChartSkeleton as Skeleton } from './ChartCard'

const charts: Record<ChartId, () => JSX.Element> = {
  topicShare: TopicShareChart,
  brandStrength: BrandStrengthTable,
  reviewSources: ReviewSourcesChart,
  leavesOut: LeavesOutCards,
  purchaseDrivers: PurchaseDrivers,
}

const titles: Record<ChartId, string> = {
  topicShare: data.topicShare.title,
  brandStrength: data.brandStrength.title,
  reviewSources: data.reviewSources.title,
  leavesOut: data.leavesOut.title,
  purchaseDrivers: data.purchaseDrivers.title,
}

/** Chart-only failure: the answer text stays, the card slot says what failed and offers Retry. */
export function ChartError({ id, onRetry }: { id: ChartId; onRetry?: () => void }) {
  return (
    <div className="animate-rise rounded-2xl bg-surface px-6 py-5 shadow-hairline">
      <p className="text-base font-semibold leading-6 text-balance">{titles[id]}</p>
      <div className="mt-3 flex items-center gap-3">
        <AlertCircle className="size-4 shrink-0 text-data-down" />
        <p className="flex-1 text-sm">{errorCopy.chartFailed}</p>
        <Button onClick={onRetry}><RotateCw /> {errorCopy.retry}</Button>
      </div>
    </div>
  )
}

export function ChartFor({ id }: { id: ChartId }) {
  const C = charts[id]
  return <div className="animate-reveal"><C /></div>
}

/** This chart's card as a skeleton, the same size as the card that replaces it. */
export function ChartSkeleton({ id }: { id: ChartId }) {
  const C = charts[id]
  return <Skeleton><C /></Skeleton>
}
