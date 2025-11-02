import React, { ReactNode } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from '../store';
import { setLoading } from '../store/slices/uiSlice';
import { useGlobalLoading } from './useGlobalLoading';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const LoadingProbe = () => {
  const isLoading = useGlobalLoading();
  return <span data-testid="loading-state">{isLoading ? 'loading' : 'idle'}</span>;
};

describe('useGlobalLoading', () => {
  afterEach(() => {
    act(() => {
      store.dispatch(setLoading(false));
    });
  });

  it('reflects loading state changes', () => {
    render(
      <Wrapper>
        <LoadingProbe />
      </Wrapper>
    );
    expect(screen.getByTestId('loading-state').textContent).toBe('idle');

    act(() => {
      store.dispatch(setLoading(true));
    });
    expect(screen.getByTestId('loading-state').textContent).toBe('loading');

    act(() => {
      store.dispatch(setLoading(false));
    });
    expect(screen.getByTestId('loading-state').textContent).toBe('idle');
  });

  it('exposes typed store hooks for dispatch and selector', () => {
    const { result } = renderHook(
      () => {
        const dispatch = useAppDispatch();
        const pending = useAppSelector(state => state.ui.pendingRequests);
        return { dispatch, pending };
      },
      { wrapper: Wrapper as React.ComponentType<{ children: ReactNode }> }
    );

    expect(typeof result.current.dispatch).toBe('function');
    expect(result.current.pending).toBe(0);

    act(() => {
      result.current.dispatch(setLoading(true));
    });

    expect(store.getState().ui.pendingRequests).toBe(1);
  });
});
