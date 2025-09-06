import styled from "@emotion/styled";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import type { FC } from "react";
import img1WithFrameUrl from "../assets/images/_DSF1602_w_frame.jpg";
import img1WihoutFrameUrl from "../assets/images/_DSF1602_wo_frame.jpg";
import img2WithFrameUrl from "../assets/images/_DSF4510_w_frame.jpg";
import img2WihoutFrameUrl from "../assets/images/_DSF4510_wo_frame.jpg";
import { PrimaryButton } from "../common/buttons.tsx";

const height = 240;

const ImageFirst = styled.img`
  height: ${height}px;
  left: 0;
`;
const ImageSecond = styled.img`
  height: ${height}px;
  top: 25%;
  left: 64px;
  position: absolute;
`;

type Props = { onLetsGo: () => void };
export const Introduction: FC<Props> = ({ onLetsGo }) => {
  return (
    <div>
      <Grid2 container>
        <Grid2 xs={12} md={8}>
          <h3>Welcome to InstaPassepartout</h3>
          <p>
            <b>Transform your photo collection into perfectly proportioned images</b> — whether you're preparing for
            Instagram or just want consistent framing across all your photos.
          </p>

          <h3>What does it do?</h3>
          <p>
            InstaPassepartout resizes your images by adding white margins (like a passepartout frame) instead of
            cropping. This means:
          </p>
          <ul>
            <li>
              <b>No more Instagram cropping</b> — Upload photos with Instagram-optimized aspect ratios (4:5, 1:1, etc.)
              so your full image is always visible
            </li>
            <li>
              <b>Batch processing</b> — Transform multiple photos with different proportions into a uniform set with the
              same aspect ratio
            </li>
            <li>
              <b>Preserve every pixel</b> — Your original image remains intact, with white margins added to achieve the
              target proportions
            </li>
            <li>
              <b>Smart splitting</b> — Large landscape images can be automatically split into two matching portrait
              images, perfect for creating Instagram carousels
            </li>
            <li>
              <b>Consistent presentation</b> — Even photos with the same proportions benefit from uniform margin
              treatment
            </li>
            <li>
              <b>Privacy first</b> — All processing happens in your browser. Your photos never leave your device
            </li>
          </ul>

          <h3>Visual Example</h3>
          <p>Two photos with different original proportions, transformed to uniform 4:5 ratio with 3% margins:</p>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 xs={12} md={4} sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Box sx={{ position: "relative", width: 190, height: 320, alignSelf: "center" }}>
            <ImageFirst alt="1st picture without frame" src={img2WihoutFrameUrl} />
            <ImageSecond alt="2nd picture without frame" src={img1WihoutFrameUrl} />
          </Box>
        </Grid2>
        <Grid2
          xs={12}
          md={1}
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          →
        </Grid2>
        <Grid2 xs={12} md={4} sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Box sx={{ position: "relative", width: 258, height: 320 }}>
            <ImageFirst alt="1st picture without frame" src={img2WithFrameUrl} />
            <ImageSecond alt="2nd picture without frame" src={img1WithFrameUrl} />
          </Box>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 sx={{ mb: 2 }} xs={12} md={8}>
          <PrimaryButton onClick={onLetsGo} style={{ marginTop: 48, width: "100%" }}>
            Let's get started!
          </PrimaryButton>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 xs={12} md={8}>
          <details style={{ marginTop: 32 }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Technical details (for the curious)</summary>
            <div style={{ marginTop: 16 }}>
              <p>
                <b>How it works:</b>
              </p>
              <ol>
                <li>
                  <b>Aspect ratio calculation</b> — The tool calculates the exact dimensions needed to achieve your
                  chosen aspect ratio (4:5, 1:1, 16:9, etc.)
                </li>
                <li>
                  <b>Margin addition</b> — White space is added around your image to reach the target dimensions. The
                  margins are calculated to both preserve every pixel of your original image and maintain the desired
                  aspect ratio. For example, with a 10% margin setting on a 100x200px target size, the final image will
                  be 110x220px
                </li>
                <li>
                  <b>Pixel-perfect preservation</b> — Your original image content is never stretched, compressed, or
                  distorted — only framed
                </li>
                <li>
                  <b>Optional splitting</b> — For wide landscape images, the tool can create two separate images that,
                  when posted together, recreate the original panorama
                </li>
                <li>
                  <b>Client-side processing</b> — Everything happens directly in your browser. Your photos never leave
                  your device, ensuring complete privacy. Note: Some browsers (especially on mobile devices) may have
                  memory limitations that could affect processing very large image collections
                </li>
              </ol>
            </div>
          </details>
        </Grid2>
      </Grid2>
    </div>
  );
};
