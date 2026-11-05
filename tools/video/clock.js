// Virtual time for frame-by-frame capture. Installed before the app loads.
// Timers, animation frames, performance.now/Date.now and the audio clock advance only when __advance(ms) is called;
// CSS and Web Animations are paused and seeked to the same clock by __seek(). Audio is silent: each voice clip's
// start time is logged (__audioLog) so the encoder can lay the real recording in at that moment.
(() => {
  let now = 0
  let id = 1
  const real = { setTimeout: window.setTimeout.bind(window), fetch: window.fetch.bind(window) }
  window.__real = real
  const d0 = Date.now()
  performance.now = () => now
  Date.now = () => d0 + now
  const timers = new Map()
  window.setTimeout = (fn, ms = 0, ...a) => { const i = id++; timers.set(i, { at: now + Math.max(0, +ms || 0), fn, a }); return i }
  window.setInterval = (fn, ms = 0, ...a) => { const i = id++; const every = Math.max(1, +ms || 0); timers.set(i, { at: now + every, fn, a, every }); return i }
  window.clearTimeout = window.clearInterval = (i) => { timers.delete(i) }
  let rafs = new Map()
  window.requestAnimationFrame = (fn) => { const i = id++; rafs.set(i, fn); return i }
  window.cancelAnimationFrame = (i) => { rafs.delete(i) }
  window.requestIdleCallback = (fn) => window.setTimeout(() => fn({ didTimeout: false, timeRemaining: () => 10 }), 1)
  window.cancelIdleCallback = window.clearTimeout

  window.__now = () => now
  window.__advance = (ms) => {
    const end = now + ms
    for (let guard = 0; guard < 5000; guard++) {
      let next = null
      for (const [i, t] of timers) if (t.at <= end && (!next || t.at < next[1].at)) next = [i, t]
      if (!next) break
      const [i, t] = next
      now = Math.max(now, t.at)
      if (t.every) t.at += t.every; else timers.delete(i)
      try { typeof t.fn === 'function' ? t.fn(...t.a) : 0 } catch (e) { console.error(e) }
    }
    now = end
    const fns = [...rafs.values()]
    rafs = new Map()
    for (const f of fns) try { f(now) } catch (e) { console.error(e) }
  }
  window.__seek = () => {
    for (const a of document.getAnimations()) {
      if (a.__v0 === undefined) { a.__v0 = now; a.pause() }
      a.currentTime = now - a.__v0
    }
  }

  // Audio on the virtual clock. Clips are decoded for their length only; nothing is heard.
  const sizes = new Map()
  window.fetch = async (u, ...rest) => {
    const r = await real.fetch(u, ...rest)
    const url = typeof u === 'string' ? u : u.url
    if (/\.m4a$/.test(url)) { const b = await r.clone().arrayBuffer(); sizes.set(b.byteLength, url) }
    return r
  }
  window.__audioLog = []
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} })
  const node = () => ({ connect(n) { return n }, disconnect() {} })
  class VirtualAudio {
    state = 'running'
    destination = node()
    get currentTime() { return now / 1000 }
    resume() { return Promise.resolve() }
    close() { return Promise.resolve() }
    createGain() { return { ...node(), gain: param() } }
    createOscillator() { return { ...node(), type: 'sine', frequency: param(), start() {}, stop() {} } }
    async decodeAudioData(buf) {
      const url = sizes.get(buf.byteLength)
      const decoded = await new OfflineAudioContext(1, 1, 44100).decodeAudioData(buf)
      return { duration: decoded.duration, __url: url }
    }
    createBufferSource() {
      let timer = 0, startedAt = 0
      const src = {
        ...node(), buffer: null, onended: null,
        start: () => {
          startedAt = now
          window.__audioLog.push({ url: src.buffer?.__url, at: now })
          timer = window.setTimeout(() => src.onended?.(), (src.buffer?.duration ?? 0) * 1000)
        },
        stop: () => {
          window.clearTimeout(timer)
          const e = window.__audioLog.findLast((l) => l.at === startedAt)
          if (e) e.until = now
        },
      }
      return src
    }
  }
  window.AudioContext = window.webkitAudioContext = VirtualAudio
})()
