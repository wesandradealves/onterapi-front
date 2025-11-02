import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getApiErrorMessage } from '../../../utils/apiError';
import { applyAuthenticatedSession, persistTempToken } from '../services/authSession';
import { signIn } from '../services/authApi';
import { UserRole } from '../../../store/slices/sessionSlice';

export interface SignInFormValues {
  email: string;
  password: string;
}

const DEFAULT_EXPIRATION = 900;

export const useSignInForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submit = form.handleSubmit(async values => {
    setServerError(null);
    try {
      const response = await signIn({
        email: values.email,
        password: values.password
      });

      if (response.requiresTwoFactor && response.tempToken) {
        persistTempToken(response.tempToken);
        router.push('/two-factor');
        return;
      }

      if (response.accessToken && response.refreshToken && response.user) {
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
        return;
      }

      setServerError('Resposta inesperada do servidor.');
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Nao foi possivel entrar. Tente novamente.'));
    }
  });

  return {
    form,
    onSubmit: submit,
    serverError,
    isSubmitting: form.formState.isSubmitting
  };
};
