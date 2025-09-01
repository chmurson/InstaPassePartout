import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  type CSSProperties,
  type FC,
  type ImgHTMLAttributes,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AreYouSureButton } from "../../common/are-you-sure-button.tsx";
import { AlertButton, SecondaryButton, TertiaryButton } from "../../common/buttons.tsx";
import { imageMaxHeight, imageMaxWidth } from "./consts.ts";
import { UploadedImageLayout } from "./uploaded-image-layout.tsx";

type Props = {
  src: string;
  size: {
    width: number;
    height: number;
  };
  newSize: {
    width: number;
    height: number;
  };
  onRemove: () => void;
};

export const UploadedImage: FC<Props> = ({ src, size, newSize, onRemove }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement>();
  const canvasZoomRef = useRef<string>();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const drawImageOnCanvas = useCallback(() => {
    const marginX = (newSize.width - size.width) / 2;
    if (!canvasRef.current || !loadedImageRef.current || !isImageLoaded) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      console.error("CTX is null");
      return;
    }
    const marginY = (newSize.height - size.height) / 2;

    try {
      console.log([newSize.height, newSize.width, size.height, size.width]);
      const zoom = Math.min(imageMaxHeight / newSize.height, imageMaxWidth / newSize.width).toFixed(3);
      canvasZoomRef.current = zoom;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      canvasRef.current.style.zoom = zoom;
      canvasRef.current.width = newSize.width;
      canvasRef.current.height = newSize.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(loadedImageRef.current, marginX, marginY, size.width, size.height);
    } catch (e) {
      console.error("error", e);
    }
  }, [newSize.height, newSize.width, size.height, size.width, isImageLoaded]);

  useEffect(() => {
    drawImageOnCanvas();
  }, [drawImageOnCanvas]);

  function handleOnLoad(e: SyntheticEvent<HTMLImageElement>) {
    loadedImageRef.current = e.currentTarget;
    setIsImageLoaded(true);
  }

  const [downloading, setDownloading] = useState(false);

  function handleDownload() {
    if (downloading) {
      return;
    }

    setDownloading(true);

    setTimeout(() => {
      if (!canvasRef.current) {
        return;
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = canvasRef.current.toDataURL("image/png");
      downloadLink.download = "image_with_margins.png";
      downloadLink.click();

      setDownloading(false);
    }, 125);
  }

  const [isPreview, setIsPreview] = useState(false);
  const previewStyleProps: CSSProperties = useMemo(() => {
    if (!isPreview) {
      return { zoom: canvasZoomRef.current };
    }

    if (!canvasRef.current) {
      return {};
    }

    const padding = 16;
    const viewportWidth = window.innerWidth - padding * 2;
    const viewportHeight = window.innerHeight - padding * 2;
    const canvas = canvasRef.current;
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
  }, [isPreview]);
  const handleOnPreview = () => {
    setIsPreview(true);
  };

  useEffect(() => {
    const handler: (this: Document, ev: DocumentEventMap["keydown"]) => void = (ev) => {
      if (ev.key === "Escape") {
        setIsPreview(() => false);
      }
    };

    document.addEventListener("keydown", handler, { capture: true });
    return () => {
      document.removeEventListener("keydown", handler, { capture: true });
    };
  }, []);

  return (
    <UploadedImageLayout
      firstImage={
        <>
          <OriginalImage src={src} onLoad={handleOnLoad} alt="original" />
          <Typography variant="body2" sx={{ alignSelf: "flex-end" }}>
            {printSize(size)}
          </Typography>
        </>
      }
      secondImage={
        <>
          <canvas ref={canvasRef} style={previewStyleProps} onClick={() => setIsPreview(false)} />
          {isPreview && (
            <Box
              sx={{
                position: "fixed",
                zIndex: 1,
                top: 0,
                right: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "black",
                opacity: 0.75,
              }}
              onClick={() => setIsPreview(false)}
            />
          )}
          <Typography variant="body2" sx={{ alignSelf: "flex-end" }}>
            {printSize(newSize)}
          </Typography>
        </>
      }
      buttons={
        <>
          <AreYouSureButton
            firstBtn={({ onClick }) => (
              <TertiaryButton onClick={onClick} size="small" startIcon={<CloseIcon />}>
                Remove
              </TertiaryButton>
            )}
            secondBtn={() => (
              <AlertButton onClick={onRemove} size="small">
                You sure ?
              </AlertButton>
            )}
          />
          <SecondaryButton startIcon={<PreviewIcon />} size="small" onClick={handleOnPreview}>
            Preview
          </SecondaryButton>
          <SecondaryButton
            onClick={handleDownload}
            startIcon={downloading ? <CircularProgress color="inherit" size={13} /> : <DownloadIcon />}
            size="small"
            disabled={downloading}
          >
            <Typography variant="body2">Download</Typography>
          </SecondaryButton>
        </>
      }
    />
  );
};

const OriginalImage: FC<ImgHTMLAttributes<HTMLImageElement>> = ({ style, ...restOfProps }) => {
  return (
    // biome-ignore lint/a11y/useAltText: this is generic component
    <img
      style={{
        maxHeight: `${imageMaxHeight}px`,
        maxWidth: `${imageMaxWidth}px`,
        height: "auto",
        width: "auto",
        ...(style ?? {}),
      }}
      {...restOfProps}
    />
  );
};

function printSize({ height, width }: { height: number; width: number }) {
  return `${width} x ${height}`;
}
