// Inspired from https://github.com/maltsev/html-minifiers-benchmark
// Run: `pnpm bench`

import { minifyHTMLLiterals } from 'minify-html-literals'
import { bench, describe } from 'vitest'

import { minifyHTMLLiteralsAsync, minifyHTMLLiterals as minifyHTMLLiteralsSync } from '../src/minify-html-literals'

const getCode = async (url: string) => await fetch(url).then(response => `
  import { html, LitElement } from 'lit'
  import { customElement } from 'lit/decorators.js'
  @customElement('my-element')
  export class MyElement extends LitElement {
    render() {
      return html\`${response}\`
    }
  }
`)

describe('stackoverflow.blog', async () => {
  const code = await getCode('https://stackoverflow.blog')
  bench('minify-html-literals', () => {
    minifyHTMLLiterals(code)
  })
  bench('@importantimport/minify-html-literals', () => {
    minifyHTMLLiteralsSync(code)
  })
  bench('@importantimport/minify-html-literals (async)', async () => {
    await minifyHTMLLiteralsAsync(code)
  })
})

// describe('github.com', async () => {
//   const code = await getCode('https://github.com/')
//   bench('minify-html-literals', () => {
//     minifyHTMLLiterals(code)
//   })
//   bench('tdewolff-minify-html-literals', () => {
//     tdewolffMinifyHTMLLiterals(code)
//   })
// })

// describe('www.npmjs.com/features', async () => {
//   const code = await getCode('https://www.npmjs.com/features')
//   bench('minify-html-literals', () => {
//     minifyHTMLLiterals(code)
//   })
//   bench('tdewolff-minify-html-literals', () => {
//     tdewolffMinifyHTMLLiterals(code)
//   })
// })

// describe('tc39.es/ecma262', async () => {
//   const code = await getCode('https://tc39.es/ecma262/')
//   bench('minify-html-literals', () => {
//     minifyHTMLLiterals(code)
//   }, { time: 10_000 })
//   bench('tdewolff-minify-html-literals', () => {
//     tdewolffMinifyHTMLLiterals(code)
//   }, { time: 10_000 })
// })
