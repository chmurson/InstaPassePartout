export function drawImageOnCanvas(
  image: HTMLImageElement,
  imageSize: { width: number; height: number },
  canvas: HTMLCanvasElement,
  canvasMaxSize: { width: number; height: number },
  { newSize, type }: { newSize: { width: number; height: number }; type: "scale-to-canvas" | "scale-to-image" },
): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("CTX is null");
    return;
  }

  const marginX = (newSize.width - imageSize.width) / 2;
  const marginY = (newSize.height - imageSize.height) / 2;

  try {
    const canvasMaxSizeToRealImageRatio =
      Math.round(Math.min(canvasMaxSize.width / newSize.width, canvasMaxSize.height / newSize.height) * 1000) / 1000;

    const [canvasZoom, imageScaleDownRatio] =
      type === "scale-to-canvas" ? [canvasMaxSizeToRealImageRatio, 1] : [1, canvasMaxSizeToRealImageRatio];

    canvas.width = newSize.width * imageScaleDownRatio;
    canvas.height = newSize.height * imageScaleDownRatio;
    canvas.style.zoom = canvasZoom.toString();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      marginX * imageScaleDownRatio,
      marginY * imageScaleDownRatio,
      imageSize.width * imageScaleDownRatio,
      imageSize.height * imageScaleDownRatio,
    );
  } catch (e) {
    console.error("error", e);
  }
}
