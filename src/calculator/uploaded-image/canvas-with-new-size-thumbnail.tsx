import { Skeleton } from "@mui/material";
import { useEffect, useRef } from "react";
import { imageMaxHeight, imageMaxWidth } from "./consts";
import { drawImageOnCanvas } from "./utils/drawImageOnCanvas";

export const CanvasWithNewSizeThumbnail = ({
  image,
  isImageLoaded,
  size,
  newSize,
  isVerticalSplit,
}: {
  image?: HTMLImageElement;
  isImageLoaded: boolean;
  size: { width: number; height: number };
  newSize: { width: number; height: number };
  isVerticalSplit: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isImageLoaded || !image) {
      return;
    }

    const maxDimensions = isVerticalSplit
      ? { width: imageMaxHeight, height: imageMaxWidth }
      : { width: imageMaxWidth, height: imageMaxHeight };

    drawImageOnCanvas(image, size, canvasRef.current, maxDimensions, {
      newSize,
      type: "scale-to-canvas",
    });
  }, [isImageLoaded, newSize, size, image, isVerticalSplit]);

  const isAllLoaded = isImageLoaded && image;
  const sekeletonMarginsY = ((newSize.height - size.height) * imageMaxHeight) / newSize.height;

  return (
    <>
      {!isAllLoaded && <Skeleton variant="rectangular" width="100%" height={imageMaxHeight + sekeletonMarginsY} />}
      <canvas ref={canvasRef} style={{ width: "100%", display: !isAllLoaded ? "none" : "block" }} />
    </>
  );
};
