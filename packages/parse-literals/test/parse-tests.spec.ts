/* eslint-disable quotes, @masknet/string-no-simple-template-literal */
import { describe, expect, it } from 'vitest'

import { parseLiterals } from '../src/parse-literals'

export interface ParseTestsOptions {
  codePrefix?: string;
  codeSuffix?: string;
}

describe('parse-tests', () => {
  const options: ParseTestsOptions = {}

  if (!options.codePrefix)
    options.codePrefix = ''

  if (!options.codeSuffix)
    options.codeSuffix = ''

  const offset = options.codePrefix.length
  it('should parse no templates', () => {
    expect(
      parseLiterals(`${options.codePrefix}true${options.codeSuffix}`),
    ).to.deep.equal([])
  })

  it('should parse simple template', () => {
    expect(
      parseLiterals(`${options.codePrefix}\`simple\`${options.codeSuffix}`),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 7 + offset,
            start: 1 + offset,
            text: 'simple',
          },
        ],
      },
    ])
  })

  // it('should parse template with one expression', () => {
  //   expect(
  //     parseLiterals(
  //       `${options.codePrefix}return \`first\${true}second\`${options.codeSuffix}`,
  //     ),
  //   ).to.deep.equal([
  //     {
  //       parts: [
  //         {
  //           end: 13 + offset,
  //           start: 8 + offset,
  //           text: 'first',
  //         },
  //         {
  //           end: 26 + offset,
  //           start: 20 + offset,
  //           text: 'second',
  //         },
  //       ],
  //     },
  //   ])
  // })

  // it('should parse template with multiple expressions', () => {
  //   expect(
  //     parseLiterals(
  //       `${options.codePrefix
  //       }return \`first\${true}second\${false}third\`${
  //         options.codeSuffix}`,
  //     ),
  //   ).to.deep.equal([
  //     {
  //       parts: [
  //         {
  //           end: 13 + offset,
  //           start: 8 + offset,
  //           text: 'first',
  //         },
  //         {
  //           end: 26 + offset,
  //           start: 20 + offset,
  //           text: 'second',
  //         },
  //         {
  //           end: 39 + offset,
  //           start: 34 + offset,
  //           text: 'third',
  //         },
  //       ],
  //     },
  //   ])
  // })

  it('should parse identifier-tagged templates', () => {
    expect(
      parseLiterals(`${options.codePrefix}html\`simple\`${options.codeSuffix}`),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 11 + offset,
            start: 5 + offset,
            text: 'simple',
          },
        ],
        tag: 'html',
      },
    ])
  })

  it('should parse function-tagged templates', () => {
    expect(
      parseLiterals(`${options.codePrefix}html()\`simple\`${options.codeSuffix}`),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 13 + offset,
            start: 7 + offset,
            text: 'simple',
          },
        ],
        tag: 'html()',
      },
    ])
  })

  // it('should parse tagged template from return statement', () => {
  //   expect(
  //     parseLiterals(
  //       `${options.codePrefix}return html\`simple\`${options.codeSuffix}`,
  //     ),
  //   ).to.deep.equal([
  //     {
  //       parts: [
  //         {
  //           end: 18 + offset,
  //           start: 12 + offset,
  //           text: 'simple',
  //         },
  //       ],
  //       tag: 'html',
  //     },
  //   ])
  // })

  it('should parse multiple templates', () => {
    expect(
      parseLiterals(
        `${options.codePrefix
        }html\`first\${() => \`simple\`}second\`${
          options.codeSuffix}`,
      ),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 10 + offset,
            start: 5 + offset,
            text: 'first',
          },
          {
            end: 33 + offset,
            start: 27 + offset,
            text: 'second',
          },
        ],
        tag: 'html',
      },
      {
        parts: [
          {
            end: 25 + offset,
            start: 19 + offset,
            text: 'simple',
          },
        ],
      },
    ])
  })

  // it('should parse literals with escaped characters', () => {
  //   expect(
  //     parseLiterals(
  //       `${options.codePrefix}\`content: "\\2003"\`${options.codeSuffix}`,
  //     ),
  //   ).to.deep.equal([
  //     {
  //       parts: [
  //         {
  //           end: 17 + offset,
  //           start: 1 + offset,
  //           text: 'content: "\\2003"',
  //         },
  //       ],
  //     },
  //   ])

  //   expect(
  //     parseLiterals(
  //       `${options.codePrefix
  //       }\`content: "\\2003"\${true}content: "\\2003"\${false}content: "\\2003"\`${
  //         options.codeSuffix}`,
  //     ),
  //   ).to.deep.equal([
  //     {
  //       parts: [
  //         {
  //           end: 17 + offset,
  //           start: 1 + offset,
  //           text: 'content: "\\2003"',
  //         },
  //         {
  //           end: 40 + offset,
  //           start: 24 + offset,
  //           text: 'content: "\\2003"',
  //         },
  //         {
  //           end: 64 + offset,
  //           start: 48 + offset,
  //           text: 'content: "\\2003"',
  //         },
  //       ],
  //     },
  //   ])
  // })

  it('should parse literals with prefix comments', () => {
    expect(
      parseLiterals(
        `${options.codePrefix
        }/* css */\`/* more comments */:host { display: block }\`${
          options.codeSuffix}`,
      ),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 53 + offset,
            start: 10 + offset,
            text: '/* more comments */:host { display: block }',
          },
        ],
      },
    ])
  })

  it('should parse literals with suffix comments', () => {
    expect(
      parseLiterals(
        `${options.codePrefix
        }\`/* more comments */:host { display: block }\`/* css */${
          options.codeSuffix}`,
      ),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 44 + offset,
            start: 1 + offset,
            text: '/* more comments */:host { display: block }',
          },
        ],
      },
    ])
  })

  it('should parse literals with comments in template tail', () => {
    expect(
      parseLiterals(
        `${options.codePrefix
        }\`head\${true/* tail comment */}tail\`${
          options.codeSuffix}`,
      ),
    ).to.deep.equal([
      {
        parts: [
          {
            end: 5 + offset,
            start: 1 + offset,
            text: 'head',
          },
          {
            end: 34 + offset,
            start: 30 + offset,
            text: 'tail',
          },
        ],
      },
    ])
  })
})
/* eslint-enable quotes, @masknet/string-no-simple-template-literal */
