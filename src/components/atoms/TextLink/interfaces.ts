import { ReactNode } from 'react';

export interface TextLinkProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'inverted';
}
