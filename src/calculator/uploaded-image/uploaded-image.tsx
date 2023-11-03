import { FC, ImgHTMLAttributes, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import { AreYouSureButton } from '../../common/are-you-sure-button.tsx'
import { AlertButton, SecondaryButton, TertiaryButton } from '../../common/buttons.tsx'
import { imageMaxHeight, imageMaxWidth } from './consts.ts'
import { UploadedImageLayout } from './uploaded-image-layout.tsx'

type Props = {
  src: string
  size: {
    width: number
    height: number
  }
  newSize: {
    width: number
    height: number
  }
  onRemove: () => void
}

export const UploadedImage: FC<Props> = ({ src, size, newSize, onRemove }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadedImageRef = useRef<HTMLImageElement>()

  const drawImageOnCanvas = useCallback(() => {
    const marginX = (newSize.width - size.width) / 2
    if (!canvasRef.current || !loadedImageRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }
    const marginY = (newSize.height - size.height) / 2

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvasRef.current.style.zoom = Math.min(imageMaxHeight / newSize.height, imageMaxWidth / newSize.width).toFixed(3)
    canvasRef.current.width = newSize.width
    canvasRef.current.height = newSize.height
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    ctx.drawImage(loadedImageRef.current, marginX, marginY, size.width, size.height)
  }, [newSize.height, newSize.width, size.height, size.width])

  useEffect(() => {
    drawImageOnCanvas()
  }, [drawImageOnCanvas])

  function handleOnLoad(e: SyntheticEvent<HTMLImageElement>) {
    loadedImageRef.current = e.currentTarget
    drawImageOnCanvas()
  }

  const [downloading, setDownloading] = useState(false)

  function handleDownload() {
    if (downloading) {
      return
    }

    setDownloading(true)

    setTimeout(() => {
      if (!canvasRef.current) {
        return
      }

      const downloadLink = document.createElement('a')
      downloadLink.href = canvasRef.current.toDataURL('image/png')
      downloadLink.download = 'image_with_margins.png'
      downloadLink.click()

      setDownloading(false)
    }, 125)
  }

  return (
    <UploadedImageLayout
      firstImage={
        <>
          <OriginalImage src={src} onLoad={handleOnLoad} />
          <Typography variant="body2" sx={{ alignSelf: 'flex-end' }}>
            {printSize(size)}
          </Typography>
        </>
      }
      secondImage={
        <>
          <canvas ref={canvasRef} />
          <Typography variant="body2" sx={{ alignSelf: 'flex-end' }}>
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
              <AlertButton onClick={onRemove} size="small" startIcon={<CloseIcon />}>
                Are you sure ?
              </AlertButton>
            )}
          />
          <SecondaryButton
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            endIcon={
              <CircularProgress sx={{ visibility: downloading ? 'visible' : 'hidden' }} color="inherit" size={16} />
            }
            size="small"
            disabled={downloading}
          >
            <Typography>Download</Typography>
          </SecondaryButton>
        </>
      }
    />
  )
}

const OriginalImage: FC<ImgHTMLAttributes<HTMLImageElement>> = ({ style, ...restOfProps }) => {
  return (
    <img
      style={{
        maxHeight: `${imageMaxHeight}px`,
        maxWidth: `${imageMaxWidth}px`,
        height: 'auto',
        width: 'auto',
        ...(style ?? {}),
      }}
      {...restOfProps}
    />
  )
}

function printSize({ height, width }: { height: number; width: number }) {
  return `${width} x ${height}`
}
