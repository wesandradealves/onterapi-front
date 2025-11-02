import { muiTheme } from './theme';

describe('muiTheme', () => {
  it('uses tokens for palette', () => {
    expect(muiTheme.palette.primary?.main).toBe('#2a8d8d');
    expect(muiTheme.palette.background?.default).toBe('#f5f7fa');
  });

  it('uses tokens for typography', () => {
    expect(muiTheme.typography.fontFamily).toContain('Inter');
    expect(muiTheme.typography.h1?.fontFamily).toContain('Nunito');
  });
});
