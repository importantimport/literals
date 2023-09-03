import * as swc from '@swc/core'

import { TemplatePart } from '../models'

export const getTagText = (node: swc.TaggedTemplateExpression): string =>
  node.tag.type === 'Identifier'
    // html
    ? node.tag.value
    // html()
    : `${((node.tag as swc.CallExpression).callee as swc.Identifier).value}()`

export const getHeadTemplatePart = (node: swc.TemplateElement | swc.TemplateLiteral, start: number, tag?: string): TemplatePart => {
  const quasi = node.type === 'TemplateElement' ? node : node.quasis[0]
  return {
    end: quasi.span.end + (tag?.length ?? 0) - start,
    start: quasi.span.start + (tag?.length ?? 0) - start,
    text: quasi.raw,
  }
}

export const getMiddleTailTemplatePart = (quasi: swc.TemplateElement, start: number, tag?: string): TemplatePart => {
  return {
    end: quasi.span.end + (tag?.length ?? 0) - start,
    start: quasi.span.start + (tag?.length ?? 0) - start,
    text: quasi.raw,
  }
}

export const getTemplateParts = (template: swc.TemplateLiteral, start: number, tag?: string): TemplatePart[] =>
  template.expressions.length === 0
    ? [getHeadTemplatePart(template, start, tag)]
    : [
      getHeadTemplatePart(template.quasis[0], start, tag),
      ...template.quasis.slice(1).map(quasi => getMiddleTailTemplatePart(quasi, start, tag)),
    ]

export const getTemplatePartsWithoutOffset = (template: swc.TemplateLiteral, tag?: string): TemplatePart[] =>
  template.expressions.length === 0
    ? [getHeadTemplatePart(template, 0, tag)]
    : [
      getHeadTemplatePart(template.quasis[0], 0, tag),
      ...template.quasis.slice(1).map(quasi => getMiddleTailTemplatePart(quasi, 0, tag)),
    ]
