import { Controller } from 'react-hook-form';
import ShieldIcon from '@mui/icons-material/Shield';
import TextField from '../../../../components/atoms/TextField';
import Button from '../../../../components/atoms/Button';
import TextLink from '../../../../components/atoms/TextLink';
import { useTwoFactorForm } from '../../hooks/useTwoFactorForm';
import { getTexts } from '../../../../utils/texts';

const twoFactorTexts = getTexts('auth.twoFactor');

const TwoFactorForm = () => {
  const { form, onSubmit, serverError, isSubmitting } = useTwoFactorForm();
  const {
    control,
    formState: { errors }
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Controller
        name="code"
        control={control}
        rules={{
          required: 'Informe o codigo recebido.',
          pattern: {
            value: /^[0-9]{6}$/,
            message: 'Informe os 6 digitos.'
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={twoFactorTexts.codeLabel}
            placeholder={twoFactorTexts.codePlaceholder}
            inputMode="numeric"
            maxLength={6}
            errorMessage={errors.code?.message}
            leadingIcon={<ShieldIcon fontSize="small" />}
          />
        )}
      />

      {serverError && <p className="text-sm font-semibold text-[rgba(235,87,87,0.9)]">{serverError}</p>}

      <Button label={twoFactorTexts.submit} size="lg" fullWidth isLoading={isSubmitting} type="submit" />

      <div className="text-sm text-[rgba(31,84,98,0.75)]">
        <TextLink href="/login" variant="primary">
          {twoFactorTexts.backToLogin}
        </TextLink>
      </div>
    </form>
  );
};

export default TwoFactorForm;
