import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TextLink from './index';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

describe('TextLink atom', () => {
  it('renders anchor with href', () => {
    render(<TextLink href="/recover">Recuperar</TextLink>);
    const link = screen.getByRole('link', { name: /recuperar/i });
    expect(link).toHaveAttribute('href', '/recover');
  });
});
