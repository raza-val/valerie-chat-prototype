import { Hologram } from '@/components/exp/Hologram'
import { Echo } from '@/components/exp/bot/Echo'
import { Prism, Silk } from '@/components/exp/bot/Creative'
import { EchoDepth, EchoRosette, EchoSplit, EchoTrail } from '@/components/exp/bot/EchoFamily'
import { Facets } from '@/components/exp/bot/Facets'
import { Hinge } from '@/components/exp/bot/Hinge'
import { HoloFlow, HoloGyro, HoloHelix, HoloScan } from '@/components/exp/bot/HoloMotion'
import { SolidAcrylic, SolidNavy } from '@/components/exp/bot/Solid'
import { ExpBoard, type ExpGroup } from './ExpPage'

/**
 * /exp/bot: the next round for Aura, after v4 (the Hologram) was preferred and v3 rejected (28 Oct).
 * Echo read as the most finished, so it leads, developed into a family. Then the mark as a solid 3D object (after the
 * user's acrylic references). Then other forms from the mark, and the Hologram with new motion.
 * Removed on review: Engraved, Neon trace, Bloom, Liquid, Projector; Foil, Gel, Ink, Paper; Frosted glass; Chrome, Liquid chrome, Glass, Enamel, Titanium (the drawn bezels read busy, not classy).
 * Same props as every Aura form (state, size, voice), so any of them can move into v4. A design tool, not linked from the product.
 */
const groups: ExpGroup[] = [
  {
    name: 'Echo, developed',
    items: [
      { id: 'echo', name: 'Echo', note: 'The mark sends out echoes of itself. Thinking: they spiral back in.', C: Echo },
      { id: 'echo-depth', name: 'Echo · Depth', note: 'The echoes hang behind the core in space. Thinking: they come forward and merge into it.', C: EchoDepth },
      { id: 'echo-split', name: 'Echo · Split', note: 'Each part echoes its own way, up and down. Thinking: the echoes close into the gap.', C: EchoSplit },
      { id: 'echo-rosette', name: 'Echo · Rosette', note: 'Still rings, a light running out through them. Thinking: they turn into a rosette.', C: EchoRosette },
      { id: 'echo-trail', name: 'Echo · Trail', note: 'The core drifts on a figure of eight, its echoes a trail. Thinking: wider, quicker, longer.', C: EchoTrail },
    ],
  },
  {
    name: 'Solid',
    items: [
      { id: 'solid-blue', name: 'Solid · Acrylic (v1)', note: 'The mark as two thick pieces of clear blue acrylic, turning in the light. Thinking: the pieces part and it turns right round.', C: SolidAcrylic },
      { id: 'solid-navy', name: 'Solid · Navy', note: 'The same object, opaque and glossy in deep navy, for the white screen.', C: SolidNavy },
    ],
  },
  {
    name: 'Other forms from the mark',
    items: [
      { id: 'silk', name: 'Silk', note: 'The outline spun from fine strands. Thinking: they loosen into waves round the shape.', C: Silk },
      { id: 'prism', name: 'Prism', note: 'Three tints laid as one. Thinking: they split like light through a prism and recombine.', C: Prism },
      { id: 'facets', name: 'Facets', note: 'Cut like a gem, catching a turning light. Thinking: light ripples out from the core.', C: Facets },
      { id: 'hinge', name: 'Hinge', note: 'The two parts as one mechanism. Thinking: they flip in turn, a spark in the gap.', C: Hinge },
    ],
  },
  {
    name: 'Hologram motion',
    items: [
      { id: 'hologram', name: 'Hologram (v4 today)', note: 'Still, one motion per state: Scan at rest, Gyro while thinking, Echo while speaking.', C: Hologram },
      { id: 'helix', name: 'Helix', note: 'A wave rolls back through the slices. Thinking: they wind into a corkscrew.', C: HoloHelix },
      { id: 'scan', name: 'Scan', note: 'A band of light reads down the face. Thinking: slices glitch and the colour splits.', C: HoloScan },
      { id: 'flow', name: 'Flow', note: 'Slices drift through the mark. Thinking: a stream, like data passing through.', C: HoloFlow },
      { id: 'gyro', name: 'Gyro', note: 'The two parts float apart. Thinking: they spin against each other.', C: HoloGyro },
    ],
  },
]

export function BotExpPage() {
  return <ExpBoard title="Bot experiments" groups={groups} link={{ href: '/exp', label: 'All experiments' }} />
}
