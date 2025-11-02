import api from '../../../lib/axios';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  requiresTwoFactor?: boolean;
  tempToken?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ValidateTwoFAPayload {
  tempToken: string;
  code: string;
  trustDevice?: boolean;
}

export interface ValidateTwoFAResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface PasswordResetPayload {
  email: string;
}

export interface PasswordResetResponse {
  delivered: boolean;
  message: string;
}

const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'OnTerapiFrontend';

export const signIn = async (payload: SignInPayload) => {
  const { data } = await api.post<SignInResponse>('/auth/sign-in', payload, {
    headers: {
      'user-agent': userAgent
    }
  });

  return data;
};

export const validateTwoFactor = async (payload: ValidateTwoFAPayload) => {
  const { data } = await api.post<ValidateTwoFAResponse>('/auth/two-factor/validate', payload, {
    headers: {
      'user-agent': userAgent
    }
  });

  return data;
};

export const requestPasswordReset = async (payload: PasswordResetPayload) => {
  const { data } = await api.post<PasswordResetResponse>(
    '/auth/password/reset/request',
    payload,
    {
      headers: {
        'user-agent': userAgent
      }
    }
  );

  return data;
};
