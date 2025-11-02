import PublicLayout from '../../layouts/PublicLayout';
import AuthTemplate from '../../components/templates/AuthTemplate';
import TwoFactorForm from '../../features/auth/components/AuthForm/TwoFactorForm';
import { getTexts } from '../../utils/texts';
import { wrapperClass } from './styles';

const TwoFactorPage = () => {
  const texts = getTexts('auth.twoFactor');

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
