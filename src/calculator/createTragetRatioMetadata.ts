export type TargetRatioMetadata = {
  isPortrait: boolean;
  isCloseToSquare: boolean;
  isSplittableVertically: boolean;
};

export function createTargetRatioMetadata(ratio: string, customRatioValue?: number): TargetRatioMetadata {
  const isPortrait = isRatioPortrait(ratio, customRatioValue);
  const isCloseToSquare = isRatioCloseToSquare(ratio, customRatioValue);

  return {
    isPortrait,
    isCloseToSquare,
    isSplittableVertically: isPortrait || isCloseToSquare,
  };
}

function isRatioCloseToSquare(ratio: string, customRatioValue?: number): boolean {
  if (ratio === "custom") {
    return customRatioValue !== undefined && customRatioValue > 0.9 && customRatioValue < 1.1;
  }

  return ratio === "1_1";
}

function isRatioPortrait(ratio: string, customRatioValue?: number): boolean {
  if (ratio === "custom") {
    return customRatioValue !== undefined && customRatioValue < 1;
  }

  const [width, height] = ratio.split("_").map(Number);
  return width < height;
}
