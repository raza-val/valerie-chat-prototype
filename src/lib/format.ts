export const signed = (n: number, digits = 1) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(digits)}`
export const pct = (n: number, digits = 1) => `${signed(n, digits)}%`
export const thousands = (n: number) => n.toLocaleString('en-GB')
export const totalSeconds = (steps: { seconds: number }[]) => Math.round(steps.reduce((a, s) => a + s.seconds, 0) * 10) / 10
