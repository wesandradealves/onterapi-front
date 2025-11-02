import { AxiosError } from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) {
      const [firstMessage] = data.message as (string | undefined)[];
      return firstMessage ?? fallback;
    }
    if (typeof data?.message === 'string') {
      return data.message;
    }
    if (typeof error.message === 'string') {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
