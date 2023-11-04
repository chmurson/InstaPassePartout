import { FC, FocusEventHandler, useEffect, useState } from 'react'
import { useStorePersistedState } from '../common/use-store-persisted-state.ts'
import { usePersistedState } from '../common/use-persisted-state.ts'
import { Ratio } from '../main-types.ts'
import {
  MenuItem,
  Select,
  SelectProps,
  FormControl,
  InputLabel,
  TextField,
  Stack,
  InputAdornment,
  Link,
} from '@mui/material'
import { Box } from '@mui/system'
import { UploadedImage } from './uploaded-image'
import { AlertButton, TertiaryButton } from '../common/buttons.tsx'
import { calcNewSize } from './calc-new-size'
import { AreYouSureButton } from '../common/are-you-sure-button.tsx'
import CloseIcon from '@mui/icons-material/Close'
import { DropZone } from './drop-zone.tsx'

const ratioDefaultValue = '4_5'
type Image = {
  fileSrc: string
  fileKey: string
  sizes: { width: number; height: number }
}
export const Calculator: FC<{ onBackToIntro: () => void }> = ({ onBackToIntro }) => {
  const { getAllFiles, addFile, removeFile } = useStorePersistedState()

  const [ratio, setRatio] = usePersistedState<Ratio>(ratioDefaultValue, 'Ratio')
  const [margin, setMargin] = usePersistedState<number>(3, 'Margin', {
    fromString: parseFloatSafely,
    toString: (x) => x.toString(),
  })
  const [marginInputValue, setMarginInputValue] = useState(margin.toString())

  const [images, setImages] = useState<Image[]>([])

  const handleRatioChange: SelectProps<Ratio>['onChange'] = (e) => {
    setRatio((e.target.value as Ratio) ?? ratioDefaultValue)
  }

  const handleMarginChange: FocusEventHandler<HTMLInputElement> = (e) => {
    setMarginInputValue(e.currentTarget.value)
  }

  const handleOnMarginChangeChange = (e: { currentTarget: { value: string } }) => {
    const newValue = Math.max(Math.min(parseFloatSafely(e.currentTarget.value), 100), 0)
    setMarginInputValue(newValue.toString())
    setMargin(newValue)
  }

  useEffect(() => {
    getAllFiles().then((x) => {
      for (const maybeFile of x ?? []) {
        const blob = new Blob([maybeFile.value as BlobPart])
        const img = new Image()

        img.onload = function () {
          const sizes = {
            width: img.width,
            height: img.height,
          }

          setImages((prevImages) => {
            if (prevImages.find((x) => x.fileKey === maybeFile.key)) {
              return prevImages
            }

            return [
              {
                fileSrc: img.src,
                fileKey: maybeFile.key as string,
                sizes,
              },
              ...prevImages,
            ]
          })
        }

        img.onerror = function () {
          removeFile(maybeFile.key as string).catch((e) => console.error(e))
        }

        img.src = URL.createObjectURL(blob)
      }
    })
  }, [getAllFiles, removeFile])

  const handleRemoveSingleFile = (image: Image) => {
    setImages((prevState) => prevState.filter((x) => x !== image))
    removeFile(image.fileKey)
  }

  const handleFildeAdded = (file: File) => {
    const img = new Image()

    img.onload = function () {
      const sizes = {
        width: img.width,
        height: img.height,
      }

      setImages((prevImages) => [...prevImages, { fileSrc: img.src, fileKey: img.src, sizes }])
      addFile(file, img.src)
      console.log(img.src, file)
    }

    const objectURL = URL.createObjectURL(file)

    img.src = objectURL
  }

  return (
    <>
      <Link
        color="inherit"
        underline="hover"
        variant="body2"
        sx={{ cursor: 'pointer' }}
        onClick={() => onBackToIntro()}
      >
        👈 Back to introduction
      </Link>
      <Box sx={{ display: 'flex', gap: '1em', textAlign: 'left', pt: 2 }}>
        <Stack spacing={2} direction="row">
          <FormControl variant="standard" sx={{ minWidth: 80 }}>
            <InputLabel>Ratio</InputLabel>
            <Select value={ratio} onChange={handleRatioChange}>
              <MenuItem value="4_5">4:5 Portrait Photo</MenuItem>
              <MenuItem value="1_1">1:1 Square Photo</MenuItem>
              <MenuItem value="1.91_1">1.91:1 Landscape Photo</MenuItem>
              <MenuItem value="9_16">9:16 Instagram Stories</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ maxWidth: 80 }}>
            <TextField
              label="Margins size"
              variant="standard"
              value={marginInputValue}
              onChange={handleMarginChange}
              onBlur={handleOnMarginChangeChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleOnMarginChangeChange({ currentTarget: { value: marginInputValue } })
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </FormControl>
        </Stack>
      </Box>
      <Box sx={{ my: 4 }}>
        <DropZone onFileAdded={handleFildeAdded} />
      </Box>
      {images.length > 1 && (
        <AreYouSureButton
          firstBtn={({ onClick }) => (
            <TertiaryButton startIcon={<CloseIcon />} onClick={onClick} size="small">
              Remove all
            </TertiaryButton>
          )}
          secondBtn={() => (
            <AlertButton onClick={() => images.forEach((x) => handleRemoveSingleFile(x))} size="small">
              Are you sure ?
            </AlertButton>
          )}
        />
      )}
      <Stack>
        {images.map((image) => (
          <UploadedImage
            key={image.fileSrc}
            src={image.fileSrc}
            size={image.sizes}
            newSize={calcNewSize(image.sizes, ratio, margin)}
            onRemove={() => handleRemoveSingleFile(image)}
          />
        ))}
      </Stack>
    </>
  )
}

function parseFloatSafely(maybeNumber: string) {
  const result = parseFloat(maybeNumber)
  if (!Number.isNaN(result)) {
    return result
  }
  return 0
}
