import { Button, type ButtonProps } from "@mui/material";
import type { FC } from "react";

export const PrimaryButton: FC<Omit<ButtonProps, "variant">> = (props) => <Button variant="contained" {...props} />;

export const SecondaryButton: FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="outlined" color="primary" {...props} />
);

export const TertiaryButton: FC<Omit<ButtonProps, "variant">> = ({ sx, ...restOfProps }) => (
  <Button variant="text" color="primary" sx={{ textTransform: "none", ...(sx ?? {}) }} {...restOfProps} />
);
export const AlertButton: FC<Omit<ButtonProps, "variant">> = (props) => (
  <Button variant="contained" color="error" {...props} />
);
