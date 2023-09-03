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
  const module = swc.parseSync(src, swcOptions)

  visitor.visitModule(module)

  return visitor.getLiterals()
}

export const parseLiteralsAsync = async (
  src: string,
  userOptions: ParseLiteralsOptions = {},
): Promise<Template[]> => {
  const { swcOptions } = mergeOptions(userOptions)

  const visitor = new LiteralsVisitor()
  const module = await swc.parse(src, swcOptions)

  visitor.visitModule(module)

  return visitor.getLiterals()
}
