import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { store } from '../store';
import { resetLoading, setLoading } from '../store/slices/uiSlice';

export const resolveBaseUrl = (value: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL) =>
  value ?? '';

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true
});

export const handleRequest = (config: InternalAxiosRequestConfig) => {
  store.dispatch(setLoading(true));
  return config;
};

export const handleRequestError = (error: AxiosError) => {
  store.dispatch(setLoading(false));
  return Promise.reject(error);
};

export const handleResponse = <T = unknown>(
  response: AxiosResponse<T>
): AxiosResponse<T> => {
  store.dispatch(setLoading(false));
  return response;
};

export const handleResponseError = (error: AxiosError) => {
  store.dispatch(setLoading(false));
  const { response } = error;
  if (response && response.status === 401) {
    store.dispatch(resetLoading());
  }
  return Promise.reject(error);
};

api.interceptors.request.use(handleRequest, handleRequestError);
api.interceptors.response.use(handleResponse, handleResponseError);

export default api;
