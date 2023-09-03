import { describe, expect, it } from 'vitest'

import * as pl from '../src/index'
import { parseLiterals, parseLiteralsAsync } from '../src/parse-literals'

describe('exports', () => {
  it('should export parseLiterals() function', () => {
    expect(pl.parseLiterals).to.equal(parseLiterals)
  })
  it('should export parseLiteralsAsync() function', () => {
    expect(pl.parseLiteralsAsync).to.equal(parseLiteralsAsync)
  })
})
