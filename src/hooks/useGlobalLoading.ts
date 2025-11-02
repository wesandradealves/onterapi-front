import { useSyncExternalStore } from 'react';
import { store } from '../store';

export const useGlobalLoading = (): boolean => {
  const selectPending = () => store.getState().ui.pendingRequests > 0;
  return useSyncExternalStore(store.subscribe, selectPending, selectPending);
};
