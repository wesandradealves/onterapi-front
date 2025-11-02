import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/layouts/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
    './src/utils/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)'
      },
      fontFamily: {
        sans: ['var(--font-family-sans)', 'sans-serif'],
        display: ['var(--font-family-display)', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;