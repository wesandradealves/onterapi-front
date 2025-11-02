import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getApiErrorMessage } from '../../../utils/apiError';
import { requestPasswordReset } from '../services/authApi';

export interface RecoverFormValues {
  email: string;
}

export const useRecoverPasswordForm = () => {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const form = useForm<RecoverFormValues>({
    defaultValues: {
      email: ''
    }
  });

  const submit = form.handleSubmit(async values => {
    setServerMessage(null);
    setHasError(false);
    try {
      const response = await requestPasswordReset(values);
      setServerMessage(response.message ?? 'Se o email existir, enviaremos as instrucoes.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      setServerMessage(getApiErrorMessage(error, 'Nao foi possivel enviar as instrucoes.'));
      setHasError(true);
    }
  });

  return {
    form,
    onSubmit: submit,
    serverMessage,
    hasError,
    isSubmitting: form.formState.isSubmitting
  };
};
