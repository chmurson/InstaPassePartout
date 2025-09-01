import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import { CircularProgress, Typography } from "@mui/material";
import { type FC, type ImgHTMLAttributes, type SyntheticEvent, useEffect, useRef, useState } from "react";
import { AreYouSureButton } from "../../common/are-you-sure-button.tsx";
import { AlertButton, SecondaryButton, TertiaryButton } from "../../common/buttons.tsx";
import { imageMaxHeight, imageMaxWidth } from "./consts.ts";
import { FullSizeImagePreview } from "./full-size-image-preview.tsx";
import { UploadedImageLayout } from "./uploaded-image-layout.tsx";
import { drawImageOnCanvas } from "./utils/drawImageOnCanvas.ts";

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

  useEffect(() => {
    if (!canvasRef.current || !loadedImageRef.current || !isImageLoaded) {
      return;
    }
    drawImageOnCanvas(
      loadedImageRef.current,
      size,
      canvasRef.current,
      { width: imageMaxWidth, height: imageMaxHeight },
      {
        newSize,
        type: "scale-to-canvas",
      },
    );
    canvasZoomRef.current = canvasRef.current.style.zoom;
  }, [isImageLoaded, newSize, size]);

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
        <div
          style={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <OriginalImage src={src} onLoad={handleOnLoad} alt="original" />
          <Typography
            variant="body2"
            sx={{ alignSelf: "flex-end" }}
            display="flex"
            flexDirection="column"
            alignItems="end"
          >
            {printSize(size, { showAprroxNiceRatio: true })}
          </Typography>
        </div>
      }
      secondImage={
        <>
          <canvas ref={canvasRef} onClick={() => setIsPreview(false)} style={{ width: "100%" }} />
          {isPreview && loadedImageRef.current && (
            <FullSizeImagePreview
              image={loadedImageRef.current}
              newSize={newSize}
              onClose={() => setIsPreview(false)}
              size={size}
            />
          )}
          <Typography
            variant="body2"
            sx={{ alignSelf: "flex-end" }}
            display="flex"
            flexDirection="column"
            alignItems="end"
          >
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

function printSize(
  { height, width }: { height: number; width: number },
  { showAprroxNiceRatio = false }: { showAprroxNiceRatio?: boolean } = {},
) {
  const { ratioText, isNice } = calculateAspectRatio(width, height);

  const humanReadableRatioText =
    !isNice && showAprroxNiceRatio ? findApproximateNiceRatioText(width, height) : ratioText;

  return (
    <>
      <span>
        {width} x {height}
      </span>
      <span>{humanReadableRatioText}</span>
    </>
  );
}

/**
 * Finds the closest "nice ratio" for given dimensions.
 * A nice ratio uses simple whole numbers (1-19) for both numerator and denominator.
 * For example, 4684 x 3122 (≈1.5) would be closest to 3:2.
 */
function findApproximateNiceRatioText(width: number, height: number): string {
  const actualRatio = width / height;
  let closestRatio = { numerator: 1, denominator: 1, difference: Math.abs(actualRatio - 1) };

  // Check all combinations of 1-19 for numerator and denominator
  for (let num = 1; num <= 19; num++) {
    for (let den = 1; den <= 19; den++) {
      const ratio = num / den;
      const difference = Math.abs(actualRatio - ratio);

      if (difference < closestRatio.difference) {
        closestRatio = { numerator: num, denominator: den, difference };
      }
    }
  }

  return `~${closestRatio.numerator}:${closestRatio.denominator}`;
}

function calculateAspectRatio(width: number, height: number): { ratioText: string; isNice: boolean } {
  // Find the greatest common divisor
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;

  return {
    ratioText: `${ratioWidth}:${ratioHeight}`,
    isNice: ratioHeight < 20 && ratioWidth < 20,
  };
}
