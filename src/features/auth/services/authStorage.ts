export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const ACCESS_KEY = 'onterapi.accessToken';
const REFRESH_KEY = 'onterapi.refreshToken';
const EXPIRES_KEY = 'onterapi.expiresAt';
const USER_KEY = 'onterapi.user';
const TEMP_TOKEN_KEY = 'onterapi.tempToken';

const storageAvailable = () => typeof window !== 'undefined';

export const authStorage = {
  saveTokens(tokens: StoredTokens) {
    if (!storageAvailable()) return;
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    localStorage.setItem(EXPIRES_KEY, tokens.expiresAt.toString());
    localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
  },
  loadTokens(): StoredTokens | null {
    if (!storageAvailable()) return null;
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const expiresAt = localStorage.getItem(EXPIRES_KEY);
    const rawUser = localStorage.getItem(USER_KEY);

    if (!accessToken || !refreshToken || !expiresAt || !rawUser) return null;
    return {
      accessToken,
      refreshToken,
      expiresAt: Number(expiresAt),
      user: JSON.parse(rawUser)
    };
  },
  clearTokens() {
    if (!storageAvailable()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);
  },
  saveTempToken(tempToken: string) {
    if (!storageAvailable()) return;
    sessionStorage.setItem(TEMP_TOKEN_KEY, tempToken);
  },
  loadTempToken() {
    if (!storageAvailable()) return null;
    return sessionStorage.getItem(TEMP_TOKEN_KEY);
  },
  clearTempToken() {
    if (!storageAvailable()) return;
    sessionStorage.removeItem(TEMP_TOKEN_KEY);
  }
};
