import * as swc from '@swc/core'
import { Visitor } from '@swc/core/Visitor'
import { type MinifyOptions, minifySync } from '@swc/css'
import { type FragmentOptions, minifyFragmentSync } from '@swc/html'
import { match } from 'ts-pattern'

export interface MinifyVisitorOptions {
  minify: {
    css: MinifyOptions
    html?: FragmentOptions
  }
}

export class MinifyVisitor extends Visitor {
  private options: MinifyVisitorOptions = {
    minify: {
      css: {},
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

    match(value)
      .with('html', () => {
        template.quasis.map(quasi => ({
          ...quasi,
          raw: minifyFragmentSync(quasi.raw, this.options.minify?.html),
        }))
      })
      .with('css', () => {
        template.quasis.map(quasi => ({
          ...quasi,
          raw: minifySync(quasi.raw, this.options.minify?.css),
        }))
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .otherwise(() => {})

    return super.visitTaggedTemplateExpression(node)
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
