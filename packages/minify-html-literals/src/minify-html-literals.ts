import * as swc from '@swc/core'

import { MinifyVisitor, type MinifyVisitorOptions } from './lib/visitor'

export interface MinifyHTMLLiteralsOptions extends MinifyVisitorOptions {
  parse?: swc.ParseOptions
  print?: swc.Options
}

export const minifyHTMLLiterals = (
  src: string,
  options: Partial<MinifyHTMLLiteralsOptions> = {},
) => {
  const visitor = new MinifyVisitor()
  const module = swc.parseSync(src, options.parse)

  visitor.visitModule(module)

  const { code } = swc.printSync(module, options.print)

  return code
}
