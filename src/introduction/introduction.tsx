import { FC } from 'react'
import styled from '@emotion/styled'
import img1WihoutFrameUrl from '../assets/images/_DSF1602_wo_frame.jpg'
import img2WihoutFrameUrl from '../assets/images/_DSF4510_wo_frame.jpg'
import img1WithFrameUrl from '../assets/images/_DSF1602_w_frame.jpg'
import img2WithFrameUrl from '../assets/images/_DSF4510_w_frame.jpg'
import { Box } from '@mui/system'
import Grid2 from '@mui/material/Unstable_Grid2'
import { PrimaryButton } from '../common/buttons.tsx'

const height = 240

const ImageFirst = styled.img`
  height: ${height}px;
  left: 0;
`
const ImageSecond = styled.img`
  height: ${height}px;
  top: 25%;
  left: 64px;
  position: absolute;
`

type Props = { onLetsGo: () => void }
export const Introduction: FC<Props> = ({ onLetsGo }) => {
  return (
    <div>
      <Grid2 container>
        <Grid2 xs={12} md={8}>
          <h3>What is it?</h3>
          <p>
            Instagram has a tendency to trim parts of images when they are included in a single post. This tool is
            designed to prevent that from happening.
          </p>

          <h3>Example</h3>
          <p>Two following images were resized to new dimensions of ratio 4:5 and margin 3%.</p>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <Box sx={{ position: 'relative', width: 190, height: 320, alignSelf: 'center' }}>
            <ImageFirst alt="1st picture without frame" src={img2WihoutFrameUrl} />
            <ImageSecond alt="2nd picture without frame" src={img1WihoutFrameUrl} />
          </Box>
        </Grid2>
        <Grid2
          xs={12}
          md={1}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          into
        </Grid2>
        <Grid2 xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <Box sx={{ position: 'relative', width: 258, height: 320 }}>
            <ImageFirst alt="1st picture without frame" src={img2WithFrameUrl} />
            <ImageSecond alt="2nd picture without frame" src={img1WithFrameUrl} />
          </Box>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 sx={{ mb: 2 }} xs={12} md={8}>
          <PrimaryButton onClick={onLetsGo} style={{ marginTop: 96, width: '100%' }}>
            Ok, let's go
          </PrimaryButton>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 xs={12} md={8}>
          <h3>What does it do exactly?</h3>
          <p>This tool performs the following actions:</p>
          <p>
            <b>Calculating new dimensions:</b> <br />
            Instead of directly resizing the image, the tool computes the new dimensions that the image should have in
            order to match a specific aspect ratio.
          </p>

          <p>
            <b>Adding a margin</b>: <br />
            It also includes the addition of a margin to the image. This margin is essentially empty space that
            surrounds the original content of the image.
          </p>
          <p>
            <b>Preserving the original content pixel ratio:</b> <br /> Importantly, the tool won't distort or stretch
            the actual content of the original image. It maintains the pixel ratio of the original image's content. The
            added margin is what changes the overall dimensions to match the specific aspect ratio you've specified.
          </p>
        </Grid2>
      </Grid2>
    </div>
  )
}
