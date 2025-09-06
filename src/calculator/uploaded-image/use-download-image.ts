import { type MutableRefObject, useState } from "react";
import { delay } from "../../common/delay";
import { drawImageOnCanvas } from "./utils/drawImageOnCanvas";
import { drawSplitImageOnCanvas } from "./utils/drawSplitImageOnCavas";

export function useDownloadImage({
  isSplit,
  newSize,
  loadedImageRef,
  originalSize,
}: {
  isSplit: boolean;
  loadedImageRef: MutableRefObject<HTMLImageElement | undefined>;
  originalSize: { width: number; height: number };
  newSize: { width: number; height: number };
}) {
  const [downloading, setDownloading] = useState(false);

  function handleDownload() {
    if (downloading) {
      return;
    }

    setDownloading(true);

    setTimeout(async () => {
      if (!loadedImageRef.current) {
        return;
      }

      const canvases = [document.createElement("canvas")];
      if (isSplit) {
        canvases.push(document.createElement("canvas"));
      }

      if (!isSplit) {
        drawImageOnCanvas(loadedImageRef.current, originalSize, canvases[0], newSize, {
          newSize,
          type: "scale-to-image",
        });
        downloadCanvasImage(canvases[0]);
      } else {
        drawSplitImageOnCanvas(loadedImageRef.current, originalSize, canvases[0], newSize, {
          newSize,
          type: "scale-to-image",
          splitPart: "left",
        });
        downloadCanvasImage(canvases[0]);

        await delay(125);

        drawSplitImageOnCanvas(loadedImageRef.current, originalSize, canvases[1], newSize, {
          newSize,
          type: "scale-to-image",
          splitPart: "right",
        });
        downloadCanvasImage(canvases[1]);
      }

      setDownloading(false);
    }, 125);
  }

  return {
    downloading,
    handleDownload,
  };
}

function downloadCanvasImage(image: HTMLCanvasElement, name?: string) {
  const downloadLink = document.createElement("a");
  downloadLink.href = image.toDataURL("image/png");
  downloadLink.download = name ?? "image_with_margins.png";
  downloadLink.click();
}
