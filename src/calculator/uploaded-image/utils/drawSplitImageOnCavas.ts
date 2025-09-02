export function drawSplitImageOnCanvas(
  image: HTMLImageElement,
  imageSize: { width: number; height: number },
  canvas: HTMLCanvasElement,
  canvasMaxSize: { width: number; height: number },
  {
    newSize,
    type,
    splitPart,
  }: {
    newSize: { width: number; height: number };
    type: "scale-to-canvas" | "scale-to-image";
    splitPart: "left" | "right";
  },
): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("CTX is null");
    return;
  }

  const halfImageWidth = imageSize.width / 2;

  const fullMarginX = (newSize.width - imageSize.width) / 2;
  const marginY = (newSize.height - imageSize.height) / 2;

  let marginLeft: number;
  let marginRight: number;
  let sourceX: number;

  if (splitPart === "left") {
    marginLeft = fullMarginX;
    marginRight = 0;
    sourceX = 0;
  } else {
    marginLeft = 0;
    marginRight = fullMarginX;
    sourceX = halfImageWidth;
  }

  const splitCanvasWidth = halfImageWidth + marginLeft + marginRight;

  try {
    const canvasMaxSizeToRealImageRatio =
      Math.round(Math.min(canvasMaxSize.width / splitCanvasWidth, canvasMaxSize.height / newSize.height) * 1000) / 1000;

    const [canvasZoom, imageScaleDownRatio] =
      type === "scale-to-image" ? [canvasMaxSizeToRealImageRatio, 1] : [1 / 2, canvasMaxSizeToRealImageRatio / 2];

    canvas.width = splitCanvasWidth * imageScaleDownRatio;
    canvas.height = newSize.height * imageScaleDownRatio;
    canvas.style.zoom = canvasZoom.toString();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      sourceX,
      0,
      halfImageWidth,
      imageSize.height,
      marginLeft * imageScaleDownRatio,
      marginY * imageScaleDownRatio,
      halfImageWidth * imageScaleDownRatio,
      imageSize.height * imageScaleDownRatio,
    );
  } catch (e) {
    console.error("error", e);
  }
}

export function calculateSplitNewSizes(
  originalNewSize: { width: number; height: number },
  imageSize: { width: number; height: number },
) {
  const fullMarginX = (originalNewSize.width - imageSize.width) / 2;
  const halfImageWidth = imageSize.width / 2;

  return {
    left: { width: halfImageWidth + fullMarginX, height: originalNewSize.height },
    right: { width: halfImageWidth + fullMarginX, height: originalNewSize.height },
  };
}
