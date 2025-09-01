import { Skeleton } from "@mui/material";
import { useEffect, useRef } from "react";
import { imageMaxHeight, imageMaxWidth } from "./consts";
import { drawImageOnCanvas } from "./utils/drawImageOnCanvas";

export const CanvasWithNewSizeThumbnail = ({
  image,
  isImageLoaded,
  size,
  newSize,
}: {
  image?: HTMLImageElement;
  isImageLoaded: boolean;
  size: { width: number; height: number };
  newSize: { width: number; height: number };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isImageLoaded || !image) {
      return;
    }
    drawImageOnCanvas(
      image,
      size,
      canvasRef.current,
      { width: imageMaxWidth, height: imageMaxHeight },
      {
        newSize,
        type: "scale-to-canvas",
      },
    );
  }, [isImageLoaded, newSize, size, image]);

  const isAllLoaded = isImageLoaded && image;
  const sekeletonMarginsY = ((newSize.height - size.height) * imageMaxHeight) / newSize.height;

  return (
    <>
      {!isAllLoaded && <Skeleton variant="rectangular" width="100%" height={imageMaxHeight + sekeletonMarginsY} />}
      <canvas ref={canvasRef} style={{ width: "100%", display: !isAllLoaded ? "none" : "block" }} />
    </>
  );
};
