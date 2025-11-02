import { authStorage } from './authStorage';

const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    }
  };
};

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

describe('authStorage', () => {
  const originalWindowDescriptor = Object.getOwnPropertyDescriptor(global, 'window');
  const originalLocalDescriptor = Object.getOwnPropertyDescriptor(global, 'localStorage');
  const originalSessionDescriptor = Object.getOwnPropertyDescriptor(global, 'sessionStorage');

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'window', {
      value: {
        localStorage: localStorageMock,
        sessionStorage: sessionStorageMock
      },
      configurable: true
    });
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      configurable: true
    });
    Object.defineProperty(global, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true
    });
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  afterEach(() => {
    if (originalWindowDescriptor) {
      Object.defineProperty(global, 'window', originalWindowDescriptor);
    } else {
      delete (global as any).window;
    }

    if (originalLocalDescriptor) {
      Object.defineProperty(global, 'localStorage', originalLocalDescriptor);
    } else {
      delete (global as any).localStorage;
    }

    if (originalSessionDescriptor) {
      Object.defineProperty(global, 'sessionStorage', originalSessionDescriptor);
    } else {
      delete (global as any).sessionStorage;
    }
  });

  const tokens = {
    accessToken: 'access',
    refreshToken: 'refresh',
    expiresAt: 123456,
    user: { id: '1', email: 'user@example.com', role: 'PROFESSIONAL' }
  };

  it('persiste tokens em localStorage', () => {
    authStorage.saveTokens(tokens);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(4);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('onterapi.accessToken', 'access');
  });

  it('carrega tokens quando disponiveis', () => {
    authStorage.saveTokens(tokens);
    const loaded = authStorage.loadTokens();
    expect(loaded).toEqual(tokens);
  });

  it('retorna null quando dados incompletos', () => {
    authStorage.saveTokens(tokens);
    localStorageMock.removeItem('onterapi.refreshToken');
    expect(authStorage.loadTokens()).toBeNull();
  });

  it('limpa tokens de localStorage', () => {
    authStorage.saveTokens(tokens);
    authStorage.clearTokens();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('onterapi.accessToken');
  });

  it('persiste token temporario', () => {
    authStorage.saveTempToken('temp');
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('onterapi.tempToken', 'temp');
  });

  it('carrega token temporario', () => {
    authStorage.saveTempToken('temp');
    expect(authStorage.loadTempToken()).toBe('temp');
  });

  it('limpa token temporario', () => {
    authStorage.saveTempToken('temp');
    authStorage.clearTempToken();
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('onterapi.tempToken');
  });

  it('ignora operacoes fora do browser', () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
      configurable: true
    });
    Object.defineProperty(global, 'localStorage', {
      value: undefined,
      configurable: true
    });
    Object.defineProperty(global, 'sessionStorage', {
      value: undefined,
      configurable: true
    });
    expect(authStorage.loadTokens()).toBeNull();
    authStorage.saveTokens(tokens);
    authStorage.clearTokens();
    authStorage.saveTempToken('temp');
    expect(authStorage.loadTempToken()).toBeNull();
    authStorage.clearTempToken();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    expect(sessionStorageMock.removeItem).not.toHaveBeenCalled();
  });
});
