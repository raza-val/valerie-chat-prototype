import type { Persona } from '@/data/personas'
import { modelCopy, personaCopy, type Model } from '@/data/ui'
import { Avatar } from './PersonaPicker'

/** Thread marker: answers below this line are tuned for a different persona. */
export function PersonaDivider({ persona }: { persona: Persona }) {
  return (
    <div role="separator" className="flex animate-rise items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span className="flex items-center gap-2">
        <Avatar p={persona} size={20} />
        <span>{personaCopy.switched} <span className="font-semibold text-foreground">{persona.name}</span> · {persona.role}</span>
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

/** Thread marker: answers below this line come from a different model. */
export function ModelDivider({ model }: { model: Model }) {
  return (
    <div role="separator" className="flex animate-rise items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span>{modelCopy.switched} <span className="font-semibold text-foreground">{model.name}</span></span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
