import api from '../../../lib/axios';
import { store } from '../../../store';
import { setAuthenticatedSession, setTempToken, clearSession } from '../../../store/slices/sessionSlice';
import {
  applyAuthenticatedSession,
  persistTempToken,
  loadPersistedSession,
  clearAuthenticatedSession
} from './authSession';
import { authStorage } from './authStorage';

jest.mock('../../../lib/axios', () => ({
  __esModule: true,
  default: {
    defaults: { headers: { common: {} } }
  }
}));

jest.mock('../../../store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn()
  }
}));

jest.mock('../../../store/slices/sessionSlice', () => ({
  setAuthenticatedSession: jest.fn().mockImplementation(payload => ({ type: 'setAuthenticatedSession', payload })),
  setTempToken: jest.fn().mockImplementation(payload => ({ type: 'setTempToken', payload })),
  clearSession: jest.fn().mockImplementation(() => ({ type: 'clearSession' }))
}));

jest.mock('./authStorage', () => ({
  authStorage: {
    saveTokens: jest.fn(),
    clearTempToken: jest.fn(),
    saveTempToken: jest.fn(),
    loadTempToken: jest.fn(),
    loadTokens: jest.fn(),
    clearTokens: jest.fn()
  }
}));

const tokens = {
  accessToken: 'access',
  refreshToken: 'refresh',
  expiresAt: Date.now() + 1000,
  user: { id: '1', email: 'user@example.com', role: 'PROFESSIONAL' as const }
};

describe('authSession service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('aplica sessao autenticada e define header', () => {
    applyAuthenticatedSession(tokens);

    expect(api.defaults.headers.common.Authorization).toBe(`Bearer ${tokens.accessToken}`);
    expect(authStorage.saveTokens).toHaveBeenCalledWith(tokens);
    expect(authStorage.clearTempToken).toHaveBeenCalled();
    expect(setAuthenticatedSession).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'setTempToken', payload: null }));
  });

  it('persiste token temporario', () => {
    persistTempToken('temp');

    expect(authStorage.saveTempToken).toHaveBeenCalledWith('temp');
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'setTempToken', payload: 'temp' }));
  });

  it('carrega sessao persistida valida', () => {
    (authStorage.loadTokens as jest.Mock).mockReturnValue(tokens);

    const loaded = loadPersistedSession();

    expect(loaded).toBe(true);
    expect(authStorage.clearTokens).not.toHaveBeenCalled();
    expect(setAuthenticatedSession).toHaveBeenCalled();
  });

  it('limpa sessao quando expirada', () => {
    (authStorage.loadTokens as jest.Mock).mockReturnValue({ ...tokens, expiresAt: Date.now() - 100 });

    const loaded = loadPersistedSession();

    expect(loaded).toBe(false);
    expect(authStorage.clearTokens).toHaveBeenCalled();
    expect(clearSession).toHaveBeenCalled();
  });

  it('retorna false quando nao ha tokens', () => {
    (authStorage.loadTokens as jest.Mock).mockReturnValue(null);

    const loaded = loadPersistedSession();

    expect(loaded).toBe(false);
    expect(setAuthenticatedSession).not.toHaveBeenCalled();
  });

  it('limpa sessao autenticada', () => {
    clearAuthenticatedSession();

    expect(authStorage.clearTokens).toHaveBeenCalled();
    expect(authStorage.clearTempToken).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'clearSession' }));
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
  });
});
