const postMock = jest.fn();

jest.mock('../../../lib/axios', () => ({
  __esModule: true,
  default: {
    post: postMock,
    defaults: { headers: { common: {} } }
  }
}));

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(global, 'navigator');

const restoreNavigator = () => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(global, 'navigator', originalNavigatorDescriptor);
  } else {
    delete (global as any).navigator;
  }
};

const loadAuthApi = (navigatorValue: Navigator | undefined) => {
  if (navigatorValue === undefined) {
    Object.defineProperty(global, 'navigator', {
      value: undefined,
      configurable: true,
      enumerable: false,
      writable: true
    });
  } else {
    Object.defineProperty(global, 'navigator', {
      value: navigatorValue,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }

  let module: typeof import('./authApi');
  jest.isolateModules(() => {
    module = require('./authApi');
  });
  return module!;
};

describe('authApi service', () => {
  afterEach(() => {
    postMock.mockReset();
    restoreNavigator();
  });

  it('envia credenciais para sign-in com header de user-agent padrao', async () => {
    const { signIn } = loadAuthApi(undefined);
    postMock.mockResolvedValue({ data: { accessToken: 'token' } });

    const result = await signIn({ email: 'user@example.com', password: '123' });

    expect(postMock).toHaveBeenCalledWith(
      '/auth/sign-in',
      { email: 'user@example.com', password: '123' },
      expect.objectContaining({ headers: expect.objectContaining({ 'user-agent': 'OnTerapiFrontend' }) })
    );
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('usa user-agent do navegador quando disponivel', async () => {
    const { signIn } = loadAuthApi({ userAgent: 'CustomAgent/1.0' } as Navigator);
    postMock.mockResolvedValue({ data: { accessToken: 'token' } });

    await signIn({ email: 'user@example.com', password: '123' });

    expect(postMock).toHaveBeenCalledWith(
      '/auth/sign-in',
      expect.any(Object),
      expect.objectContaining({ headers: expect.objectContaining({ 'user-agent': 'CustomAgent/1.0' }) })
    );
  });

  it('valida codigo de two-factor', async () => {
    const { validateTwoFactor } = loadAuthApi(undefined);
    postMock.mockResolvedValue({ data: { accessToken: 'token' } });

    await validateTwoFactor({ tempToken: 'temp', code: '123456' });

    expect(postMock).toHaveBeenCalledWith(
      '/auth/two-factor/validate',
      { tempToken: 'temp', code: '123456', trustDevice: undefined },
      expect.any(Object)
    );
  });

  it('solicita recuperacao de senha', async () => {
    const { requestPasswordReset } = loadAuthApi(undefined);
    postMock.mockResolvedValue({ data: { delivered: true } });

    await requestPasswordReset({ email: 'user@example.com' });

    expect(postMock).toHaveBeenCalledWith(
      '/auth/password/reset/request',
      { email: 'user@example.com' },
      expect.any(Object)
    );
  });
});
