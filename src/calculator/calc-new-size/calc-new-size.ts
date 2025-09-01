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
    let newHeight = height * ((margin + 100) / 100);
    let newWidth = newHeight * ratioValue;

    const maybeAdjusted = ensureExactAspectRatio(newWidth, newHeight, ratio);

    if (maybeAdjusted) {
      newWidth = maybeAdjusted.newWidth;
      newHeight = maybeAdjusted.newHeight;
    }

    return {
      height: Math.round(newHeight),
      width: Math.round(newWidth),
    };
  } else {
    let newWidth = width * ((margin + 100) / 100);
    let newHeight = newWidth / ratioValue;

    const maybeAdjusted = ensureExactAspectRatio(newWidth, newHeight, ratio);

    if (maybeAdjusted) {
      newWidth = maybeAdjusted.newWidth;
      newHeight = maybeAdjusted.newHeight;
    }

    return {
      height: Math.floor(newHeight),
      width: Math.floor(newWidth),
    };
  }
}

function ensureExactAspectRatio(newWidth: number, newHeight: number, ratio: Ratio) {
  if (ratio === "custom") return;

  const heightMod = Number(ratio.split("_")[1]);
  const weightMod = Number(ratio.split("_")[0]);

  if (newWidth % weightMod !== 0 || newHeight % heightMod !== 0) {
    newWidth = (Math.floor(newWidth / weightMod) + 1) * weightMod;
    newHeight = (Math.floor(newHeight / heightMod) + 1) * heightMod;

    return {
      newWidth,
      newHeight,
    };
  }
}
