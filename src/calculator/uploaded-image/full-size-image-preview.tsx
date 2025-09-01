import { Box } from "@mui/system";
import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import { drawImageOnCanvas } from "./utils/drawImageOnCanvas";

export const FullSizeImagePreview = ({
  image,
  onClose,
  size,
  newSize,
}: {
  image: HTMLImageElement;
  onClose: () => void;
  size: { width: number; height: number };
  newSize: { width: number; height: number };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasZoomRef = useRef<string>("");

  const styleProps: CSSProperties = useMemo(() => {
    const padding = 16;
    const viewportWidth = window.innerWidth - padding * 2;
    const viewportHeight = window.innerHeight - padding * 2;
    const canvas = canvasRef.current;

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
    if (!canvasRef.current) {
      return;
    }

    drawImageOnCanvas(
      image,
      size,
      canvasRef.current,
      { width: document.body.clientWidth, height: document.body.clientHeight },
      {
        newSize,
        type: "scale-to-canvas",
      },
    );
    canvasZoomRef.current = canvasRef.current.style.zoom;
  }, [newSize, size, image]);

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
      <canvas ref={canvasRef} style={styleProps} />
    </Box>
  );
};
