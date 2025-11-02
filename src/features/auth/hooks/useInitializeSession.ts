import { useEffect } from 'react';
import { loadPersistedSession, persistTempToken } from '../services/authSession';
import { authStorage } from '../services/authStorage';

export const useInitializeSession = () => {
  useEffect(() => {
    loadPersistedSession();
    const tempToken = authStorage.loadTempToken();
    if (tempToken) {
      persistTempToken(tempToken);
    }
  }, []);
};
