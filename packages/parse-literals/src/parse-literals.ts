import * as swc from '@swc/core'

import type { Template } from './models'

import { LiteralsVisitor } from './lib/visitor'

export interface ParseLiteralsOptions {
  swcOptions?: swc.ParseOptions
}

const mergeOptions = (userOptions: Partial<ParseLiteralsOptions>): ParseLiteralsOptions =>
  ({
    swcOptions: {
      syntax: 'typescript',
      target: 'esnext',
    },
    ...userOptions,
  })

export const parseLiterals = (
  src: string,
  userOptions: ParseLiteralsOptions = {},
): Template[] => {
  const { swcOptions } = mergeOptions(userOptions)

  const visitor = new LiteralsVisitor()
  const m = swc.parseSync(src, swcOptions)

  visitor.visitModule(m)

  return visitor.getLiterals()
}

export const parseLiteralsAsync = async (
  src: string,
  userOptions: ParseLiteralsOptions = {},
): Promise<Template[]> => {
  const { swcOptions } = mergeOptions(userOptions)

  const visitor = new LiteralsVisitor()
  const m = await swc.parse(src, swcOptions)

  visitor.visitModule(m)

  return visitor.getLiterals()
}

// export const parseLiterals = (
//   src: string,
//   options: ParseLiteralsOptions = {},
// ): Template[] => {
//   // const strategy = {
//   //   ...typescript,
//   //   ...options.strategy,
//   // }

//   // const literals: Template[] = []
//   // const visitedTemplates: unknown[] = []

//   // const visitor = new Visitor()
//   // visitor.visitTaggedTemplateExpression((node: swc.TaggedTemplateExpression) => {
//   //   const template = strategy.getTaggedTemplateTemplate(node)
//   //   visitedTemplates.push(template)
//   //   literals.push({
//   //     parts: strategy.getTemplateParts(template),
//   //     tag: strategy.getTagText(node),
//   //   })

//   //   return node as swc.Expression
//   // })

//   strategy.walkNodes(
//     strategy.getRootNode(src, options.fileName),
//     visitor,
//     // (node) => {
//     //   if (strategy.isTaggedTemplate(node)) {
//     //     const template = strategy.getTaggedTemplateTemplate(node)
//     //     visitedTemplates.push(template)
//     //     literals.push({
//     //       parts: strategy.getTemplateParts(template),
//     //       tag: strategy.getTagText(node),
//     //     })
//     //   }
//     //   else if (strategy.isTemplate(node) && !visitedTemplates.includes(node)) {
//     //     literals.push({
//     //       parts: strategy.getTemplateParts(node),
//     //     })
//     //   }
//     // },
//   )

//   return literals
// }
