import { useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { type ChangeEvent, type FC, useState } from "react";

type Props = {
  onFileAdded: (file: File) => void;
};
export const DropZone: FC<Props> = ({ onFileAdded }) => {
  const [isDragOn, setIsDragOn] = useState(false);
  const { palette } = useTheme();
  return (
    <Box
      id="drop_zone"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2,
        borderStyle: "dashed",
        borderWidth: "1px",
        borderColor: palette.text.secondary,
        backgroundColor: `${palette.text.primary}0f`,
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        textAlign: "center",
        ...(isDragOn ? { borderStyle: "solid", backgroundColor: `${palette.text.primary}3f` } : {}),
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOn(true);
      }}
      onDragLeave={() => setIsDragOn(false)}
      onDrop={(ev) => {
        ev.preventDefault();
        const files = ev.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          onFileAdded(file);
        }
        setIsDragOn(false);
      }}
    >
      <span>
        {!isDragOn && "Drag and drop images here"}
        {isDragOn && "Drop files here"}
      </span>
      <input
        type="file"
        id="input"
        accept="image/*"
        multiple
        onChange={function handleFileUpload(this: HTMLInputElement, e: ChangeEvent<HTMLInputElement>) {
          const input = e.currentTarget;
          for (const file of input.files ?? []) {
            onFileAdded(file);
          }
        }}
      />
    </Box>
  );
};
