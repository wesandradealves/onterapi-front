import { routeAccessRules } from './index';

describe('route exports', () => {
  it('provides access to configured route rules', () => {
    expect(routeAccessRules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pattern: expect.any(RegExp) })
      ])
    );
  });
});
