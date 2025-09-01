import { Stack, useMediaQuery, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import type { SxProps } from "@mui/system";
import { type FC, type ReactNode, useState } from "react";
import { imageMaxHeight, imageMaxWidth } from "./consts";

function lightenColor(hexColor: string, amount: number): string {
  // Normalize 3-char hex to 6-char hex (#fff -> #ffffff)
  let normalizedHex = hexColor;
  if (hexColor.match(/^#([0-9a-f]{3})$/i)) {
    const shortHex = hexColor.slice(1);
    normalizedHex = `#${shortHex[0]}${shortHex[0]}${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}`;
  }

  const rgb = normalizedHex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!rgb) return hexColor;

  const r = Number.parseInt(rgb[1], 16);
  const g = Number.parseInt(rgb[2], 16);
  const b = Number.parseInt(rgb[3], 16);
  const alpha = Math.max(0, Math.min(1, 1 - amount));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const UploadedImageLayout: FC<{
  firstImage: ReactNode;
  secondImage: ReactNode;
  buttons: ReactNode;
}> = ({ firstImage, buttons, secondImage }) => {
  const [isHover, setIsHover] = useState(false);
  const { palette } = useTheme();

  const imageGridProps: SxProps = {
    display: "flex",
    flexDirection: "column",
    maxWidth: imageMaxWidth,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    border: `1px solid ${palette.divider}`,
    backgroundColor: lightenColor(palette.background.paper, palette.mode === "dark" ? 0.1 : 0.75),
    boxSizing: "content-box",
  };

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid2
      container
      sx={{ py: 3 }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      spacing={2}
      justifyContent={isXs ? "space-between" : "flex-start"}
    >
      <Grid2 xs={5} sm={4} sx={imageGridProps}>
        {firstImage}
      </Grid2>
      <Grid2 xs={2} sm={1} sx={{ alignSelf: "center", textAlign: "center" }}>
        ▶
      </Grid2>
      <Grid2 xs={5} sm={4} sx={imageGridProps}>
        {secondImage}
      </Grid2>
      <Grid2 xs={12} sm={4} sx={{ alignSelf: "stretch", display: "flex" }}>
        <Stack
          flexDirection={isXs ? "row" : "column"}
          display="flex"
          spacing={isXs ? 0 : 2}
          sx={{ maxWidth: isXs ? imageMaxWidth * 2.5 : `${180}px`, width: "100%" }}
          justifyContent={isXs ? "space-between" : "flex-start"}
          alignItems={isXs ? "center" : "stretch"}
          padding={isXs ? 0 : 2}
          alignSelf="stretch"
        >
          {(isHover || isXs || true) /* true beucuse of performance issues */ && buttons}
        </Stack>
      </Grid2>
    </Grid2>
  );
};
