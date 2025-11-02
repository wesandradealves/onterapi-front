const postMock = jest.fn();

const SIGN_IN_ENDPOINT = '/auth/sign-in';
const PASSWORD_RESET_ENDPOINT = '/auth/password/reset/request';
const TWO_FACTOR_ENDPOINT = '/auth/two-factor/validate';
const USER_AGENT_HEADER = 'user-agent';
const DEFAULT_USER_AGENT = 'OnTerapiFrontend';
const DEFAULT_EMAIL = 'user@example.com';
const DEFAULT_PASSWORD = '123';
const ACCESS_TOKEN_RESPONSE = { data: { accessToken: 'token' } };

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

  let authApi: typeof import('./authApi');
  jest.isolateModules(() => {
    authApi = require('./authApi');
  });
  return authApi!;
};

describe('authApi service', () => {
  afterEach(() => {
    postMock.mockReset();
    restoreNavigator();
  });

  it('envia credenciais para sign-in com header de user-agent padrao', async () => {
    const { signIn } = loadAuthApi(undefined);
    postMock.mockResolvedValue(ACCESS_TOKEN_RESPONSE);

    const result = await signIn({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });

    expect(postMock).toHaveBeenCalledWith(
      SIGN_IN_ENDPOINT,
      { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD },
      expect.objectContaining({
        headers: expect.objectContaining({ [USER_AGENT_HEADER]: DEFAULT_USER_AGENT })
      })
    );
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('usa user-agent do navegador quando disponivel', async () => {
    const { signIn } = loadAuthApi({ userAgent: 'CustomAgent/1.0' } as Navigator);
    postMock.mockResolvedValue(ACCESS_TOKEN_RESPONSE);

    await signIn({ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD });

    expect(postMock).toHaveBeenCalledWith(
      SIGN_IN_ENDPOINT,
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({ [USER_AGENT_HEADER]: 'CustomAgent/1.0' })
      })
    );
  });

  it('valida codigo de two-factor', async () => {
    const { validateTwoFactor } = loadAuthApi(undefined);
    postMock.mockResolvedValue(ACCESS_TOKEN_RESPONSE);

    await validateTwoFactor({ tempToken: 'temp', code: '123456' });

    expect(postMock).toHaveBeenCalledWith(
      TWO_FACTOR_ENDPOINT,
      { tempToken: 'temp', code: '123456', trustDevice: undefined },
      expect.any(Object)
    );
  });

  it('solicita recuperacao de senha', async () => {
    const { requestPasswordReset } = loadAuthApi(undefined);
    postMock.mockResolvedValue({ data: { delivered: true } });

    await requestPasswordReset({ email: DEFAULT_EMAIL });

    expect(postMock).toHaveBeenCalledWith(
      PASSWORD_RESET_ENDPOINT,
      { email: DEFAULT_EMAIL },
      expect.any(Object)
    );
  });
});
