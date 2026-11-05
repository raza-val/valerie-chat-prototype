// A drawn arrow cursor for the recording (screenshots carry none), pressed while the button is down.
addEventListener('DOMContentLoaded', () => {
  const c = document.createElement('div')
  c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transform:translate(-200px,-200px)'
  c.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" style="display:block;transform-origin:4px 3px;filter:drop-shadow(0 1px 1.5px rgb(0 0 0 / .3))"><path d="M4 3v16.2l4.6-4.4 3 6.7 2.9-1.3-3-6.6h6.3z" fill="#0f172a" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>'
  document.documentElement.append(c)
  const svg = c.firstChild
  addEventListener('pointermove', (e) => { c.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 3}px)` }, true)
  addEventListener('pointerdown', () => { svg.style.transform = 'scale(.82)' }, true)
  addEventListener('pointerup', () => { svg.style.transform = '' }, true)
})
