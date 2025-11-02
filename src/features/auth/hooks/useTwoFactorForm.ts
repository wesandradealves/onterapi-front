import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getApiErrorMessage } from '../../../utils/apiError';
import { applyAuthenticatedSession } from '../services/authSession';
import { authStorage } from '../services/authStorage';
import { validateTwoFactor } from '../services/authApi';
import { store } from '../../../store';
import { setTempToken } from '../../../store/slices/sessionSlice';
import type { UserRole } from '../../../store/slices/sessionSlice';

export interface TwoFactorFormValues {
  code: string;
  trustDevice: boolean;
}

const DEFAULT_EXPIRATION = 900;

export const useTwoFactorForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [tempToken, setTempTokenState] = useState<string | null>(null);

  useEffect(() => {
    const token = authStorage.loadTempToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setTempTokenState(token);
    store.dispatch(setTempToken(token));
  }, [router]);

  const form = useForm<TwoFactorFormValues>({
    defaultValues: {
      code: '',
      trustDevice: false
    }
  });

  const submit = form.handleSubmit(async values => {
    if (!tempToken) {
      router.replace('/login');
      return;
    }

    setServerError(null);
    try {
      const response = await validateTwoFactor({
        tempToken,
        code: values.code,
        trustDevice: values.trustDevice
      });

      const expiresIn = response.expiresIn ?? DEFAULT_EXPIRATION;
      const expiresAt = Date.now() + expiresIn * 1000;
      applyAuthenticatedSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt,
        user: {
          id: response.user.id,
          email: response.user.email,
          role: (response.user.role ?? '') as UserRole
        }
      });
      router.replace('/dashboard');
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Codigo invalido. Tente novamente.'));
    }
  });

  return {
    form,
    onSubmit: submit,
    serverError,
    isSubmitting: form.formState.isSubmitting
  };
};
