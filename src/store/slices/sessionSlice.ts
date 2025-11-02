import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CLINIC_OWNER'
  | 'MANAGER'
  | 'PROFESSIONAL'
  | 'SECRETARY'
  | 'PATIENT'
  | '';

interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

interface SessionState {
  isAuthenticated: boolean;
  role: UserRole;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: SessionUser | null;
  tempToken: string | null;
}

const initialState: SessionState = {
  isAuthenticated: false,
  role: '',
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
  tempToken: null
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAuthenticatedSession(state, action: PayloadAction<Omit<SessionState, 'tempToken'>>) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
      state.tempToken = null;
    },
    setTempToken(state, action: PayloadAction<string | null>) {
      state.tempToken = action.payload;
      if (action.payload) {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresAt = null;
      }
    },
    clearSession() {
      return initialState;
    }
  }
});

export const { setAuthenticatedSession, setTempToken, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
