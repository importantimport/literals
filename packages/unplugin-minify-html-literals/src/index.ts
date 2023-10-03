import { type MinifyHTMLLiteralsOptions, minifyHTMLLiterals } from '@importantimport/minify-html-literals'
import { type FilterPattern, createFilter } from '@rollup/pluginutils'
import { createUnplugin } from 'unplugin'

export type Options = {
  config?: Partial<MinifyHTMLLiteralsOptions>
  exclude?: FilterPattern
  include?: FilterPattern
}

export default createUnplugin<Options | undefined>((options) => {
  const filter = createFilter(
    options?.include ?? [/\.[jt]s$/],
    options?.exclude,
  )
  return {
    name: '@importantimport/unplugin-minify-html-literals',
    transform: code => minifyHTMLLiterals(code, options?.config),
    transformInclude: id => filter(id),
  }
})
