import api from '../../../lib/axios';
import { store } from '../../../store';
import { setAuthenticatedSession, setTempToken, clearSession } from '../../../store/slices/sessionSlice';
import { authStorage, StoredTokens } from './authStorage';

export const applyAuthenticatedSession = (tokens: StoredTokens) => {
  api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
  authStorage.saveTokens(tokens);
  authStorage.clearTempToken();
  store.dispatch(
    setAuthenticatedSession({
      isAuthenticated: true,
      role: tokens.user.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      user: tokens.user
    })
  );
  store.dispatch(setTempToken(null));
};

export const persistTempToken = (tempToken: string) => {
  authStorage.saveTempToken(tempToken);
  store.dispatch(setTempToken(tempToken));
};

export const loadPersistedSession = () => {
  const stored = authStorage.loadTokens();
  if (!stored) return false;
  if (Date.now() >= stored.expiresAt) {
    authStorage.clearTokens();
    store.dispatch(clearSession());
    return false;
  }

  applyAuthenticatedSession(stored);
  return true;
};

export const clearAuthenticatedSession = () => {
  authStorage.clearTokens();
  authStorage.clearTempToken();
  delete api.defaults.headers.common.Authorization;
  store.dispatch(clearSession());
};
