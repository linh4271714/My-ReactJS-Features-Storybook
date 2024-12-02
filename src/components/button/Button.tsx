import React, { forwardRef } from "react";
import { Button, type ButtonProps } from "@mui/material";

import {
  gray300Color,
  primaryColor,
  textQuaternaryColor,
} from "../tokenColorTemporary";

export interface EliceButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const EliceButton = forwardRef<HTMLButtonElement, EliceButtonProps>(
  ({ children, variant = "contained", disabled, sx, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        disabled={disabled}
        sx={{
          width: "fit-content",
          borderRadius: "16px",
          fontWeight: 700,
          fontSize: "22px",
          padding: "12px 20px",
          color: disabled
            ? textQuaternaryColor
            : variant === "outlined"
            ? primaryColor
            : "#fff",
          backgroundColor:
            variant === "outlined"
              ? "#ffffff"
              : disabled
              ? gray300Color
              : primaryColor,
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

export default EliceButton;
