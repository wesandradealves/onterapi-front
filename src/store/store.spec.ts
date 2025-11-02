import { store } from './index';
import { clearSession, setAuthenticatedSession, setTempToken } from './slices/sessionSlice';
import { setLoading, resetLoading } from './slices/uiSlice';

const sampleSession = {
  isAuthenticated: true,
  role: 'CLINIC_OWNER' as const,
  accessToken: 'access',
  refreshToken: 'refresh',
  expiresAt: Date.now() + 1000,
  user: {
    id: '1',
    email: 'user@example.com',
    role: 'CLINIC_OWNER' as const
  }
};

describe('redux store', () => {
  beforeEach(() => {
    store.dispatch(clearSession());
    store.dispatch(resetLoading());
  });

  it('provides initial state', () => {
    const state = store.getState();
    expect(state.session.isAuthenticated).toBe(false);
    expect(state.session.accessToken).toBeNull();
    expect(state.ui.pendingRequests).toBe(0);
  });

  it('updates session slice with authenticated session', () => {
    store.dispatch(setAuthenticatedSession(sampleSession));
    expect(store.getState().session.user?.email).toBe('user@example.com');
    expect(store.getState().session.accessToken).toBe('access');

    store.dispatch(clearSession());
    expect(store.getState().session.isAuthenticated).toBe(false);
    expect(store.getState().session.role).toBe('');
  });

  it('stores temp token when required', () => {
    store.dispatch(setTempToken('temp-token'));
    expect(store.getState().session.tempToken).toBe('temp-token');
    expect(store.getState().session.isAuthenticated).toBe(false);
  });

  it('updates ui slice', () => {
    store.dispatch(setLoading(true));
    expect(store.getState().ui.pendingRequests).toBe(1);
    store.dispatch(setLoading(false));
    expect(store.getState().ui.pendingRequests).toBe(0);
    store.dispatch(setLoading(true));
    store.dispatch(resetLoading());
    expect(store.getState().ui.pendingRequests).toBe(0);
  });
});
