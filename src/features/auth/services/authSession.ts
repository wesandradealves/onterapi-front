import api from '../../../lib/axios';
import { store } from '../../../store';
import {
  setAuthenticatedSession,
  setTempToken,
  clearSession,
  UserRole
} from '../../../store/slices/sessionSlice';
import { authStorage, StoredTokens } from './authStorage';

const KNOWN_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'CLINIC_OWNER',
  'MANAGER',
  'PROFESSIONAL',
  'SECRETARY',
  'PATIENT',
  ''
];

const normalizeRole = (role: unknown): UserRole =>
  typeof role === 'string' && (KNOWN_ROLES as string[]).includes(role)
    ? (role as UserRole)
    : '';

export const applyAuthenticatedSession = (tokens: StoredTokens) => {
  const normalizedRole = normalizeRole(tokens.user.role);
  const normalizedTokens: StoredTokens = {
    ...tokens,
    user: {
      ...tokens.user,
      role: normalizedRole
    }
  };

  const sessionUser = {
    id: normalizedTokens.user.id,
    email: normalizedTokens.user.email,
    role: normalizedRole
  };

  api.defaults.headers.common.Authorization = `Bearer ${normalizedTokens.accessToken}`;
  authStorage.saveTokens(normalizedTokens);
  authStorage.clearTempToken();
  store.dispatch(
    setAuthenticatedSession({
      isAuthenticated: true,
      role: normalizedRole,
      accessToken: normalizedTokens.accessToken,
      refreshToken: normalizedTokens.refreshToken,
      expiresAt: normalizedTokens.expiresAt,
      user: sessionUser
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
