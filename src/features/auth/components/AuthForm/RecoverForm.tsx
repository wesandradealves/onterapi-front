import { Controller } from 'react-hook-form';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextField from '../../../../components/atoms/TextField';
import Button from '../../../../components/atoms/Button';
import { useRecoverPasswordForm } from '../../hooks/useRecoverPasswordForm';
import { getTexts } from '../../../../utils/texts';

const recoverTexts = getTexts('auth.recover');

const RecoverForm = () => {
  const { form, onSubmit, serverMessage, hasError, isSubmitting } = useRecoverPasswordForm();
  const {
    control,
    formState: { errors }
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Informe seu email.',
          pattern: {
            value: /.+@.+\..+/,
            message: 'Email invalido.'
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={recoverTexts.emailLabel}
            placeholder={recoverTexts.emailPlaceholder}
            type="email"
            errorMessage={errors.email?.message}
            leadingIcon={<MailOutlineIcon fontSize="small" />}
          />
        )}
      />

      {serverMessage && (
        <p
          className={`text-sm font-semibold ${
            hasError ? 'text-[rgba(235,87,87,0.9)]' : 'text-[var(--color-secondary)]'
          }`}
        >
          {serverMessage}
        </p>
      )}

      <Button label={recoverTexts.submit} size="lg" fullWidth isLoading={isSubmitting} type="submit" />
    </form>
  );
};

export default RecoverForm;
