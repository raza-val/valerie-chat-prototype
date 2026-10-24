import { Fragment, type ReactNode } from 'react'

/** Renders **bold** inside a string. */
export function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** Splits an answer into its lead (first paragraph, bold stripped) and body paragraphs. */
export function splitAnswer(md: string) {
  const paras = md.trim().split(/\n\s*\n/)
  const lead = paras[0].replace(/\*\*/g, '').trim()
  return { lead, body: paras.slice(1) }
}
