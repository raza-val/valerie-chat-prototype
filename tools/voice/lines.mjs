// Prints "name<TAB>text" for every line Valerie says in the product.
import fs from 'node:fs'
const src = (f) => fs.readFileSync(new URL(`../../src/data/${f}`, import.meta.url), 'utf8')
const a = src('answers.ts')
const out = []
out.push(['tagline', src('site.ts').match(/tagline: '([^']+)'/)[1]])
for (const m of a.matchAll(/^  '([a-z-]+)': \{\n    "lead": "((?:[^"\\]|\\.)*)"/gm)) out.push([`lead-${m[1]}`, JSON.parse(`"${m[2]}"`)])
out.push(['offer', src('prompts.ts').match(/followUpOffer = '([^']+)'/)[1]])
console.log(out.map((l) => l.join('\t')).join('\n'))
