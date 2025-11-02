import { InputHTMLAttributes, ReactNode } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorMessage?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  trailingIconAction?: () => void;
  trailingIconButtonLabel?: string;
  fullWidth?: boolean;
}
