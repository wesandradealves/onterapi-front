import { ReactNode } from 'react';

export interface AuthTemplateProps {
  heading: string;
  subtitle: string;
  form: ReactNode;
  footer?: ReactNode;
  localeSwitcher?: ReactNode;
  topAction?: ReactNode;
}
