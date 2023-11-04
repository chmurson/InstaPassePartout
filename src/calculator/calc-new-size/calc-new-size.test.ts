// sum.test.js
import { describe, it, expect } from 'vitest'
import { Ratio } from '../../main-types.ts'
import { calcNewSize } from './calc-new-size.ts'

describe('calcNewSize', () => {
  describe('margin is 10%', () => {
    const margin = 10
    describe(`Ratio is ${'9_16' as Ratio}`, () => {
      const ratio: Ratio = '9_16'

      describe.each([{ input: [50, 75], expected: [55, 97] }])(`Input size $input`, ({ input, expected }) => {
        it(`returns ${expected}`, () => {
          const result = calcNewSize({ height: input[1], width: input[0] }, { ratio }, margin)
          expect(result.width).toEqual(expected[0])
          expect(result.height).toEqual(expected[1])
        })
      })
    })
  })
})
