import React, { forwardRef } from 'react';
import { Button, type ButtonProps } from '@mui/material';

import {
  gray300Color,
  primaryColor,
  textQuaternaryColor,
} from '../tokenColorTemporary';

export interface EliceButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const EliceButton = forwardRef<HTMLButtonElement, EliceButtonProps>(
  ({ children, variant = 'contained', disabled, sx, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        disabled={disabled}
        sx={{
          width: 'fit-content',
          borderRadius: '1.6rem',
          fontWeight: 700,
          fontSize: '2.2rem',
          lineHeight: '3.08rem',
          padding: '1.2rem 2rem',
          color: disabled
            ? textQuaternaryColor
            : variant === 'outlined'
            ? primaryColor
            : '#fff',
          backgroundColor:
            variant === 'outlined'
              ? '#ffffff'
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
