import type { Config } from 'jest';

const baseConfig: Config = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }]
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/pages/**/index.tsx',
    '!src/**/*.stories.tsx',
    '!src/**/*.stories.ts',
    '!src/**/interfaces.ts',
    '!src/**/styles.ts'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};

export default baseConfig;
