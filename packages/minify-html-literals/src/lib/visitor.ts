import * as swc from '@swc/core'
import { Visitor } from '@swc/core/Visitor'
import { type Options as HTMLOptions, minify } from 'html-minifier'
import { transform } from 'lightningcss'
import { Buffer } from 'node:buffer'
import { P, match } from 'ts-pattern'

export interface MinifyVisitorOptions {
  minify?: {
    /** `lightningcss` options */
    css?: Partial<Omit<Parameters<typeof transform>[0], 'code'>>,
    /** `html-minifier` options */
    html?: Partial<HTMLOptions>,
  }
}

export class MinifyVisitor extends Visitor {
  private options: MinifyVisitorOptions = {
    minify: {
      css: {
        minify: true,
      },
      html: {
        caseSensitive: true,
        collapseWhitespace: true,
        decodeEntities: true,
        // TODO: use lightningcss
        // minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeAttributeQuotes: false,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    },
  }

  constructor(userOptions: Partial<MinifyVisitorOptions> = {}) {
    super()
    this.options = {
      ...this.options,
      ...userOptions,
    }
  }

  visitTaggedTemplateExpression(node: swc.TaggedTemplateExpression): swc.Expression {
    const { tag, template } = node
    const { value } = tag as swc.Identifier

    return {
      ...node,
      template: {
        ...template,
        quasis: match(value)
          .with(P.string.includes('html').or(P.string.includes('svg')), () => {
            /** @example `minify-html-literals-placeholder-64` */
            const placeholder = `minify-html-literals-placeholder-${Math.floor(Math.random() * 100)}`

            const combinedHTML = template.quasis
              .map(({ raw }) => raw)
              .join(placeholder)

            const minifiedHTML = minify(combinedHTML, this.options.minify?.html)
              .toString()
              .split(placeholder)

            return template.quasis.map((quasi, i) => ({
              ...quasi,
              // cooked: undefined,
              raw: minifiedHTML[i],
            }))
          })
          .with(P.string.includes('css'), () => {
            /** @example `@minify-html-literals-placeholder-64;` */
            const placeholder = `@minify-html-literals-placeholder-${Math.floor(Math.random() * 100)};`

            const combinedCSS = template.quasis.map(({ raw }) => raw).join(placeholder)
            const minifiedCSS = transform({
              code: Buffer.from(combinedCSS),
              filename: '',
              ...this.options.minify?.css,
            })
              .code
              .toString()
              .split(placeholder)

            return template.quasis.map((quasi, i) => ({
              ...quasi,
              // cooked: undefined,
              raw: minifiedCSS[i],
            }))
          })
          .otherwise(() => template.quasis),
      },
    }
  }
}
