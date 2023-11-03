import { FC, ReactNode, useState } from 'react'
import { SxProps } from '@mui/system'
import { Stack, useMediaQuery, useTheme } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { imageMaxHeight, imageMaxWidth } from './consts'

export const UploadedImageLayout: FC<{
  firstImage: ReactNode
  secondImage: ReactNode
  buttons: ReactNode
}> = ({ firstImage, buttons, secondImage }) => {
  const [isHover, setIsHover] = useState(false)

  const imageGridProps: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: imageMaxWidth,
    maxHeight: imageMaxHeight,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  }

  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid2
      container
      sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 3 }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Grid2 xs={5} sm={4} sx={imageGridProps}>
        {firstImage}
      </Grid2>
      <Grid2 xs={0} sm={1} sx={{ alignSelf: 'center', textAlign: 'center' }}>
        ▶
      </Grid2>
      <Grid2 xs={5} sm={4} sx={imageGridProps}>
        {secondImage}
      </Grid2>
      <Grid2 xs={12} sm={3} sx={{ alignSelf: 'stretch', display: 'flex' }}>
        <Stack
          flexDirection={isXs ? 'row' : 'column'}
          display="flex"
          spacing={isXs ? 0 : 2}
          sx={{ maxWidth: isXs ? imageMaxWidth * 2.5 : `${180}px`, width: '100%' }}
          justifyContent={isXs ? 'space-between' : 'center'}
          alignItems={isXs ? 'center' : 'stretch'}
          alignSelf="stretch"
        >
          {(isHover || isXs) && buttons}
        </Stack>
      </Grid2>
    </Grid2>
  )
}
