import {
  colorTokens,
  typographyTokens,
  spacingTokens,
  radiusTokens
} from './styleguide';

describe('styleguide tokens', () => {
  it('exposes color tokens', () => {
    expect(colorTokens.primary).toBe('#2a8d8d');
    expect(colorTokens.surface).toBe('#ffffff');
  });

  it('exposes typography tokens', () => {
    expect(typographyTokens.sans).toContain('Inter');
    expect(typographyTokens.display).toContain('Nunito');
  });

  it('defines spacing and radius scales', () => {
    expect(spacingTokens.md).toBe('1rem');
    expect(radiusTokens.lg).toBe('1rem');
  });
});
