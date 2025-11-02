import React from 'react';
import { config } from 'dotenv';

config({ path: '.env', override: false, quiet: true });

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://onterapi.vercel.app';
}

jest.mock('next/head', () => {
  return function HeadMock({ children }: { children: React.ReactNode }) {
    return React.createElement(React.Fragment, null, children);
  };
});
