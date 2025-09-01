import type { Ratio } from "../../main-types.ts";

export const ratioToRatioValue: Record<Ratio, number> = {
  "2_3": 2 / 3,
  "3_2": 3 / 2,
  "4_5": 4 / 5,
  "1_1": 1,
  "1.91_1": 1.91,
  "9_16": 9 / 16,
  custom: 1,
};
