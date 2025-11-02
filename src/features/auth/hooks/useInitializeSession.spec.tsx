import { renderHook } from '@testing-library/react';
import { useInitializeSession } from './useInitializeSession';
import { loadPersistedSession, persistTempToken } from '../services/authSession';
import { authStorage } from '../services/authStorage';

jest.mock('../services/authSession', () => ({
  loadPersistedSession: jest.fn(),
  persistTempToken: jest.fn()
}));

jest.mock('../services/authStorage', () => ({
  authStorage: {
    loadTempToken: jest.fn()
  }
}));

describe('useInitializeSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carrega sessao persistida e temp token', () => {
    (authStorage.loadTempToken as jest.Mock).mockReturnValue('temp-token');

    renderHook(() => useInitializeSession());

    expect(loadPersistedSession).toHaveBeenCalled();
    expect(authStorage.loadTempToken).toHaveBeenCalled();
    expect(persistTempToken).toHaveBeenCalledWith('temp-token');
  });

  it('nao persiste token quando inexistente', () => {
    (authStorage.loadTempToken as jest.Mock).mockReturnValue(null);

    renderHook(() => useInitializeSession());

    expect(persistTempToken).not.toHaveBeenCalled();
  });
});
