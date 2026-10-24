import type { ChartId } from '@/data/prompts'
import { TopicShareChart } from './TopicShareChart'
import { BrandStrengthTable } from './BrandStrengthTable'
import { ReviewSourcesChart } from './ReviewSourcesChart'
import { LeavesOutCards } from './LeavesOutCards'
import { SweetSpotMatrix } from './SweetSpotMatrix'
import { PurchaseDrivers } from './PurchaseDrivers'

export { ChartSkeleton } from './ChartCard'

const charts: Record<ChartId, () => JSX.Element> = {
  topicShare: TopicShareChart,
  brandStrength: BrandStrengthTable,
  reviewSources: ReviewSourcesChart,
  leavesOut: LeavesOutCards,
  sweetSpot: SweetSpotMatrix,
  purchaseDrivers: PurchaseDrivers,
}

export function ChartFor({ id }: { id: ChartId }) {
  const C = charts[id]
  return <div className="animate-rise"><C /></div>
}
