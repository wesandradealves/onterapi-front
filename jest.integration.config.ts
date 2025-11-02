import baseConfig from './jest.config';

const integrationConfig = {
  ...baseConfig,
  testMatch: ['**/__tests__/**/*.int.ts?(x)', '**/*.int.ts?(x)']
};

export default integrationConfig;