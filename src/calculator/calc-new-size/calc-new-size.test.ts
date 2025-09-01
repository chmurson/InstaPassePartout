// sum.test.js
import { describe, expect, it } from "vitest";
import type { Ratio } from "../../main-types.ts";
import { calcNewSize } from "./calc-new-size.ts";

describe("calcNewSize", () => {
  describe("margin is 10%", () => {
    const margin = 10;
    describe(`Ratio is ${"9_16" as Ratio}`, () => {
      const ratio: Ratio = "9_16";

      describe.each([{ input: [50, 75], expected: [55, 97] }])(`Input size $input`, ({ input, expected }) => {
        it(`returns ${expected}`, () => {
          const result = calcNewSize({ height: input[1], width: input[0] }, { ratio }, margin);
          expect(result.width).toEqual(expected[0]);
          expect(result.height).toEqual(expected[1]);
        });
      });
    });
  });

  describe("margin is 3%", () => {
    const margin = 3;
    describe(`Ratio is ${"4_5" as Ratio}`, () => {
      const ratio: Ratio = "4_5";

      describe.each([
        // { input: [5152, 7728], expected: [6368, 7960] },
        // { input: [4866, 7299], expected: [6016, 7520] },
        { input: [7728, 5152], expected: [7960, 9950] },
      ])(`Input size $input and ratio exactly 4/5; or 0.8`, ({ input, expected }) => {
        it(`returns ${expected}`, () => {
          const result = calcNewSize({ height: input[1], width: input[0] }, { ratio }, margin);

          expect(result.width).toEqual(expected[0]);
          expect(result.height).toEqual(expected[1]);
          expect(4 / 5).toEqual(expected[0] / expected[1]);
        });
      });
    });
  });
});
