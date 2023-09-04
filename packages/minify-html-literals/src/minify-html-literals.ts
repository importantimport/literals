import * as swc from '@swc/core'

import { MinifyVisitor, type MinifyVisitorOptions } from './lib/visitor'

export interface MinifyHTMLLiteralsOptions extends MinifyVisitorOptions {
  parse?: swc.ParseOptions
  print?: swc.Options
}

export const minifyHTMLLiterals = (
  src: string,
  options: Partial<MinifyHTMLLiteralsOptions> = {},
): swc.Output => {
  const visitor = new MinifyVisitor()
  let module = swc.parseSync(src, options.parse)

  module = visitor.visitModule(module)

  // const { code } = swc.printSync(module, options.print)

  // return code
  return swc.printSync(module, options.print)
}
