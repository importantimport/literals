// import { type MinifyOptions, minifySync } from '@swc/css'
import { minify } from '@minify-html/node'
import * as swc from '@swc/core'
import { Visitor } from '@swc/core/Visitor'
// import { type FragmentOptions, minifyFragmentSync } from '@swc/html'
import { transform } from 'lightningcss'
import { Buffer } from 'node:buffer'
import { match } from 'ts-pattern'

export interface MinifyVisitorOptions {
  // minify: {
  //   css: MinifyOptions
  //   html?: FragmentOptions
  // }
  minify?: {
    css?: Partial<Omit<Parameters<typeof transform>[0], 'code'>>,
    html?: Parameters<typeof minify>[1]
  }
}

export class MinifyVisitor extends Visitor {
  private options: MinifyVisitorOptions = {
    minify: {
      css: {
        minify: true,
      },
      html: {
        keep_spaces_between_attributes: false,
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
          .with('html', () =>
            template.quasis.map(quasi => ({
              ...quasi,
              raw: minify(Buffer.from(quasi.raw), this.options.minify?.html ?? {}).toString(),
              // raw: minifyFragmentSync(Buffer.from(quasi.raw), this.options.minify?.html),
            })),
          )
          .with('css', () =>
            template.quasis.map((quasi) => {
              const minified = transform({
                code: Buffer.from(quasi.raw),
                filename: '',
                ...this.options.minify?.css,
              }).code.toString()

              // eslint-disable-next-line no-console
              console.log('minified css:', minified)

              return {
                ...quasi,
                raw: minified,
              }
              // ({
              //   ...quasi,
              //   raw: transform({
              //     code: Buffer.from(quasi.raw),
              //     filename: '',
              //   }).code.toString(),
              // })
            }),
          )
          .otherwise(() => template.quasis),
        // .exhaustive(),
      },
    }
  }

  // visitTemplateLiteral(node: swc.TemplateLiteral): swc.Expression {
  //   if (!this.visitedTemplates.includes(node)) {
  //     this.literals.push({
  //       parts: getTemplateParts(node, node.span.start - this.start),
  //     })
  //   }

  //   return super.visitTemplateLiteral(node)
  // }
}
