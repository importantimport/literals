import * as swc from '@swc/core'
import { Visitor } from '@swc/core/Visitor'

import type { Template } from '../models'

import { getTagText, getTemplateParts } from './get'

export class LiteralsVisitor extends Visitor {
  private literals: Template[]
  private start: number
  private visitedTemplates: swc.TemplateLiteral[]

  constructor(start?: number) {
    super()
    this.literals = []
    this.start = start ?? 0
    this.visitedTemplates = []
  }

  getLiterals() {
    return this.literals
  }

  visitTaggedTemplateExpression(node: swc.TaggedTemplateExpression): swc.Expression {
    const { template } = node
    const tag = getTagText(node)
    this.visitedTemplates.push(template)
    this.literals.push({
      parts: getTemplateParts(template, template.span.start - this.start, tag),
      tag,
    })

    return super.visitTaggedTemplateExpression(node)
  }

  visitTemplateLiteral(node: swc.TemplateLiteral): swc.Expression {
    if (!this.visitedTemplates.includes(node)) {
      this.literals.push({
        parts: getTemplateParts(node, node.span.start - this.start),
      })
    }

    return super.visitTemplateLiteral(node)
  }
}
