import PublicLayout from '../../layouts/PublicLayout';
import AuthTemplate from '../../components/templates/AuthTemplate';
import TwoFactorForm from '../../features/auth/components/AuthForm/TwoFactorForm';
import { getTexts, AppLocale } from '../../utils/texts';
import { wrapperClass } from './styles';

const TwoFactorPage = () => {
  const locale: AppLocale = 'pt';
  const texts = getTexts('auth.twoFactor', locale);

  return (
    <PublicLayout>
      <div className={wrapperClass}>
        <AuthTemplate
          heading={texts.title}
          subtitle={texts.description}
          form={<TwoFactorForm />}
        />
      </div>
    </PublicLayout>
  );
};

export default TwoFactorPage;
