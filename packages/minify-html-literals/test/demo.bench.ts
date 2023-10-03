import { minifyHTMLLiterals } from 'minify-html-literals'
import { bench, describe } from 'vitest'

import { minifyHTMLLiteralsAsync, minifyHTMLLiterals as minifyHTMLLiteralsSync } from '../src/minify-html-literals'

describe('demo bench', async () => {
  const code = `function render(title, items) {
    return html\`
      <style>
        .heading {
          color: blue;
        }
      </style>
      <h1 class="heading">\${title}</h1>
      <ul>
        \${items.map(item => {
          return getHTML()\`
            <li>\${item}</li>
          \`;
        })}
      </ul>
    \`;
  }`

  // eslint-disable-next-line max-statements-per-line
  bench('@importantimport/minify-html-literals (async)', async () => { await minifyHTMLLiteralsAsync(code) })

  // eslint-disable-next-line max-statements-per-line
  bench('@importantimport/minify-html-literals (sync)', () => { minifyHTMLLiteralsSync(code) })

  // eslint-disable-next-line max-statements-per-line
  bench('minify-html-literals (sync)', () => { minifyHTMLLiterals(code) })
})
