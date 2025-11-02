import baseConfig from './jest.config';

const unitConfig = {
  ...baseConfig,
  testMatch: ['**/__tests__/**/*.spec.ts?(x)', '**/*.spec.ts?(x)']
};

export default unitConfig;