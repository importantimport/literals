# Literals [WIP]

<!-- It's very difficult, and it's not working right now. -->

## Packages

### `@importantimport/minify-html-literals`

Super-fast alternative for `minify-html-literals`.

```ts
import { minifyHTMLLiterals } from '@importantimport/minify-html-literals'

const result = minifyHTMLLiterals(
  `function render(title, items) {
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
  }`,
)

console.log(result.code)
// function render(title, items) {
//     return html`<style>.heading{color:#00f}</style><h1 class="heading">${title}</h1><ul>${items.map((item)=>{
//         return getHTML()`
//             <li>${item}</li>
//           `;
//     })}</ul>`;
// }
```

### `@importantimport/unplugin-minify-html-literals`

Super-fast alternative for `rollup-plugin-minify-html-literals`.

```ts
// vite.config.ts
import minifyHTML from '@importantimport/unplugin-minify-html-literals'
import { defineConfig } from 'vite'

export default defineConfig({
  ...config,
  plugins: [
    minifyHTML.vite(),
    ...plugins,
  ],
})
```

## License

licensed under the [MIT](./LICENSE.md).

partially copies code from the following projects, their licenses are listed in [**Third-party library licenses**](./THIRD-PARTY-LICENSE.md).

| Project       | License       |
| ------------- | ------------- |
| [asyncLiz/parse-literals](https://github.com/asyncLiz/parse-literals) | [MIT](https://github.com/asyncLiz/parse-literals/blob/master/LICENSE.md) |
| [asyncLiz/minify-html-literals](https://github.com/asyncLiz/minify-html-literals) | [MIT](https://github.com/asyncLiz/minify-html-literals/blob/master/LICENSE.md) |
