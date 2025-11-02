import { useState } from 'react';
import { Controller } from 'react-hook-form';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TextField from '../../../../components/atoms/TextField';
import Button from '../../../../components/atoms/Button';
import TextLink from '../../../../components/atoms/TextLink';
import { useSignInForm } from '../../hooks/useSignInForm';
import { getTexts } from '../../../../utils/texts';

const loginTexts = getTexts('auth.login');

const LoginForm = () => {
  const { form, onSubmit, serverError, isSubmitting } = useSignInForm();
  const {
    control,
    formState: { errors }
  } = form;
  const [showPassword, setShowPassword] = useState(false);

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
            label={loginTexts.emailLabel}
            placeholder={loginTexts.emailPlaceholder}
            type="email"
            errorMessage={errors.email?.message}
            leadingIcon={<MailOutlineIcon fontSize="small" />}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Informe sua senha.'
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={loginTexts.passwordLabel}
            placeholder={loginTexts.passwordPlaceholder}
            type={showPassword ? 'text' : 'password'}
            errorMessage={errors.password?.message}
            leadingIcon={<LockOutlinedIcon fontSize="small" />}
            trailingIcon={showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            trailingIconAction={() => setShowPassword(previous => !previous)}
            trailingIconButtonLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          />
        )}
      />

      <div className="flex justify-end text-sm text-[rgba(31,84,98,0.75)]">
        <TextLink href="/recover" variant="primary">
          {loginTexts.forgot}
        </TextLink>
      </div>

      {serverError && <p className="text-sm font-semibold text-[rgba(235,87,87,0.9)]">{serverError}</p>}

      <Button label={loginTexts.submit} size="lg" fullWidth isLoading={isSubmitting} type="submit" />
    </form>
  );
};

export default LoginForm;
