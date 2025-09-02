import { Box } from "@mui/system";
import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import { drawImageOnCanvas } from "./utils/drawImageOnCanvas";
import { drawSplitImageOnCanvas } from "./utils/drawSplitImageOnCavas";

export const FullSizeImagePreview = ({
  image,
  onClose,
  size,
  newSize,
  isVerticalSplit,
}: {
  image: HTMLImageElement;
  onClose: () => void;
  size: { width: number; height: number };
  newSize: { width: number; height: number };
  isVerticalSplit: boolean;
}) => {
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  const styleProps: CSSProperties = useMemo(() => {
    const padding = 16;
    const viewportWidth = window.innerWidth - padding * 2;
    const viewportHeight = window.innerHeight - padding * 2;
    const canvas = canvasRef1.current;

    if (!canvas || !image) return {};

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const zoomWidth = viewportWidth / canvasWidth;
    const zoomHeight = viewportHeight / canvasHeight;
    const zoomLevel = Math.min(zoomWidth, zoomHeight);
    return {
      padding: padding,
      zIndex: 2,
      zoom: zoomLevel,
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    } as CSSProperties;
  }, [image]);

  useEffect(() => {
    if (!canvasRef1.current) {
      return;
    }

    if (!isVerticalSplit) {
      drawImageOnCanvas(
        image,
        size,
        canvasRef1.current,
        { width: document.body.clientWidth, height: document.body.clientHeight },
        {
          newSize,
          type: "scale-to-image",
        },
      );
    } else {
      drawSplitImageOnCanvas(
        image,
        size,
        canvasRef1.current,
        { width: document.body.clientWidth / 2, height: document.body.clientHeight },
        {
          newSize,
          type: "scale-to-image",
          splitPart: "left",
        },
      );
      if (!canvasRef2.current) {
        return;
      }

      drawSplitImageOnCanvas(
        image,
        size,
        canvasRef2.current,
        { width: document.body.clientWidth / 2, height: document.body.clientHeight },
        {
          newSize,
          type: "scale-to-image",
          splitPart: "right",
        },
      );
    }
  }, [newSize, size, image, isVerticalSplit]);

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 1,
        top: 0,
        right: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => onClose()}
    >
      <canvas ref={canvasRef1} style={styleProps} />
      {isVerticalSplit && <canvas ref={canvasRef2} style={styleProps} />}
    </Box>
  );
};
