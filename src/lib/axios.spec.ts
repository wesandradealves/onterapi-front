import {
  handleRequest,
  handleRequestError,
  handleResponse,
  handleResponseError,
  resolveBaseUrl
} from './axios';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { resetLoading } from '../store/slices/uiSlice';

describe('axios interceptors', () => {
  beforeEach(() => {
    store.dispatch(resetLoading());
  });

  it('resolves base URL with fallback', () => {
    expect(resolveBaseUrl(undefined)).toBe('');
    expect(resolveBaseUrl('https://onterapi.test')).toBe('https://onterapi.test');
  });

  const createConfig = (): InternalAxiosRequestConfig =>
    ({
      headers: {},
      method: 'get',
      url: '/'
    } as InternalAxiosRequestConfig);

  const createResponse = (): AxiosResponse => ({
    data: null,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: createConfig()
  });

  it('increments loading on request and decrements on response', () => {
    handleRequest(createConfig());
    expect(store.getState().ui.pendingRequests).toBe(1);

    handleResponse(createResponse());
    expect(store.getState().ui.pendingRequests).toBe(0);
  });

  it('handles response errors', async () => {
    const config = createConfig();
    const errorResponse = { ...createResponse(), status: 401 };
    const error = new AxiosError('unauthorized', undefined, config, undefined, errorResponse);

    handleRequest(config);
    expect(store.getState().ui.pendingRequests).toBe(1);

    await expect(handleResponseError(error)).rejects.toBe(error);
    expect(store.getState().ui.pendingRequests).toBe(0);
  });

  it('clears loading for non-401 response errors without resetting session', async () => {
    const config = createConfig();
    const errorResponse = { ...createResponse(), status: 500 };
    const error = new AxiosError('server error', undefined, config, undefined, errorResponse);

    handleRequest(config);
    expect(store.getState().ui.pendingRequests).toBe(1);

    await expect(handleResponseError(error)).rejects.toBe(error);
    expect(store.getState().ui.pendingRequests).toBe(0);
  });

  it('propagates request errors after clearing loading state', async () => {
    const config = createConfig();
    const requestError = new AxiosError('network', 'ERR_NETWORK', config);

    handleRequest(config);
    expect(store.getState().ui.pendingRequests).toBe(1);

    await expect(handleRequestError(requestError)).rejects.toBe(requestError);
    expect(store.getState().ui.pendingRequests).toBe(0);
  });

  it('clears loading for errors without response payload', async () => {
    const config = createConfig();
    const networkError = new AxiosError('timeout', 'ETIMEDOUT', config);

    handleRequest(config);
    expect(store.getState().ui.pendingRequests).toBe(1);

    await expect(handleResponseError(networkError)).rejects.toBe(networkError);
    expect(store.getState().ui.pendingRequests).toBe(0);
  });
});
