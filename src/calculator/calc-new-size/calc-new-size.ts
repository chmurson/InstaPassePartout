import type { Ratio } from "../../main-types.ts";
import { ratioToRatioValue } from "./ratio-to-ratio-value.ts";

export function calcNewSize(
  { height, width }: { height: number; width: number },
  {
    customRatioValue,
    ratio,
  }: {
    ratio: Ratio;
    customRatioValue?: number;
  },
  margin: number,
) {
  const ratioValue = ratio === "custom" ? (customRatioValue ?? 1) : ratioToRatioValue[ratio];

  if (width / height < ratioValue) {
    const newHeight = height * ((margin + 100) / 100);
    const newWidth = newHeight * ratioValue;

    return {
      height: Math.floor(newHeight),
      width: Math.floor(newWidth),
    };
  } else {
    const newWidth = width * ((margin + 100) / 100);
    const newHeight = newWidth / ratioValue;

    return {
      height: Math.floor(newHeight),
      width: Math.floor(newWidth),
    };
  }
}
