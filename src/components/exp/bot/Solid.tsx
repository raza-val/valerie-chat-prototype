import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MARK_BOTTOM, MARK_TOP } from '@/components/brand/mark'
import { useCssVar } from '@/lib/aura'
import { useFrames, type ExpProps } from '../motion'
import { alpha, CX, CY, useBrand, useCanvas } from './palette'

/**
 * Solid (28 Oct): the mark as a real object, after the user's references (a glossy acrylic slab, discs fanned into a
 * flower): two thick, softly bevelled pieces with no drawn outline. The edges read from the thickness and the light
 * on the bevel, lit by a studio environment. Minimal: one colour, one material, the light does the rest.
 * Colours from brand tokens (D21).
 */

/** One WebGL renderer for every solid on the page (a context each would pass the browser's limit); each copies its frame to its own canvas. */
let shared: { renderer: THREE.WebGLRenderer; env: THREE.Texture } | null = null
function gl() {
  if (!shared) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture
    shared = { renderer, env }
  }
  return shared
}
function paint(scene: THREE.Scene, camera: THREE.Camera, ctx: CanvasRenderingContext2D) {
  const { renderer } = gl()
  const { width: w, height: h } = ctx.canvas
  const c = renderer.domElement
  if (c.width < w || c.height < h) renderer.setSize(Math.max(c.width, w), Math.max(c.height, h), false)
  renderer.setViewport(0, 0, w, h)
  renderer.setScissor(0, 0, w, h)
  renderer.setScissorTest(true)
  renderer.render(scene, camera)
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(c, 0, c.height - h, w, h, 0, 0, w, h)
}

const DEPTH = 3.4
let parts: THREE.BufferGeometry[] | null = null
/** The two pieces of the mark, extruded and bevelled, centred on the mark's middle (y up). */
function pieces() {
  if (!parts) {
    const loader = new SVGLoader()
    parts = [MARK_TOP, MARK_BOTTOM].map((d) => {
      const shapes = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`).paths.flatMap((p) => SVGLoader.createShapes(p))
      // The bevel rounds outward (offset 0). Inset, it folded over itself where the points are thinner than the bevel,
      // and flaps stuck out of the tips as the mark turned.
      const g = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.7, bevelSize: 0.35, bevelOffset: 0, bevelSegments: 8, curveSegments: 40 })
      g.translate(-CX, -CY, -DEPTH / 2)
      g.scale(1, -1, -1)
      return toCreasedNormals(g, Math.PI / 4)
    })
  }
  return parts
}

type Tone = 'blue' | 'navy'

function Solid({ state, size, voice, tone }: ExpProps & { tone: Tone }) {
  const b = useBrand()
  const navy = useCssVar('--brand-950')
  // The faces in the tone, the walls (the thickness and bevel) a step deeper, so the edge reads without a drawn outline.
  const [face, wall] = tone === 'blue' ? [b[600], b[800]] : [b[900], navy]
  const { ref, props } = useCanvas(size)
  const spin = useRef(0)

  const world = useMemo(() => {
    const scene = new THREE.Scene()
    scene.environment = gl().env
    // Reflections tinted by the colour (part metal), so a wall seen edge-on stays blue instead of mirroring a grey room.
    const faces = tone === 'blue'
      // Acrylic: light passes through and picks up the colour, so the thin parts glow and the thick ones deepen.
      ? new THREE.MeshPhysicalMaterial({ roughness: 0.08, metalness: 0, transmission: 1, thickness: 4, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1 })
      : new THREE.MeshPhysicalMaterial({ roughness: 0.16, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.9 })
    const walls = new THREE.MeshPhysicalMaterial({ roughness: 0.14, metalness: 0.9, envMapIntensity: 1.4 })
    const [top, bottom] = pieces().map((g) => new THREE.Mesh(g, [faces, walls]))
    const group = new THREE.Group()
    group.add(top, bottom)
    scene.add(group)
    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(-30, 50, 60)
    const rim = new THREE.DirectionalLight(0xffffff, 1.6)
    rim.position.set(40, -40, 20)
    scene.add(key, rim)
    const camera = new THREE.PerspectiveCamera(26, 1, 1, 500)
    camera.position.set(0, 0, 108)
    return { scene, camera, group, top, bottom, faces, walls, key, rim }
  }, [])
  useEffect(() => {
    world.faces.color.set(face)
    world.faces.attenuationColor.set(face)
    world.faces.attenuationDistance = 5
    world.walls.color.set(wall)
    world.key.color.set(b[50])
    world.rim.color.set(b[300])
  }, [world, face, wall, b[50], b[300]])
  useEffect(() => () => { world.faces.dispose(); world.walls.dispose() }, [world])

  useFrames(state, { idle: 0.6, thinking: 1, speaking: 1 }, ({ t, dt, think, level }) => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    // Thinking turns it right round; settling, it eases back to the nearest face-on turn.
    if (think > 0.5) spin.current += dt * think * 2.4
    else spin.current += (Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2 - spin.current) * (1 - Math.exp(-dt * 3))
    const { group, top, bottom } = world
    group.rotation.y = Math.sin(t * 0.7) * 0.38 * (1 - think) + spin.current
    group.rotation.x = -0.18 + Math.sin(t * 0.5) * 0.06
    group.scale.setScalar(1 + level * 0.05)
    top.position.set(0, think * 1.4, think * 2.2)
    bottom.position.set(0, -think * 1.4, -think * 2.2)
    paint(world.scene, world.camera, ctx)
  }, voice)

  return (
    <div className="grid place-items-center" style={{ width: size, height: size }}>
      <canvas {...props} style={{ ...props.style, filter: `drop-shadow(0 ${(size / 28).toFixed(1)}px ${(size / 22).toFixed(1)}px ${alpha(navy, 0.22)})` }} />
    </div>
  )
}

/** Solid acrylic: clear brand-blue acrylic, like the reference. v1's Aura (28 Oct). */
export const SolidAcrylic = (p: ExpProps) => <Solid {...p} tone="blue" />
/** Solid, navy: the same object in deep navy, for the white screen. */
export const SolidNavy = (p: ExpProps) => <Solid {...p} tone="navy" />
