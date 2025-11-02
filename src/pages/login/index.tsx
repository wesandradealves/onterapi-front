import PublicLayout from '../../layouts/PublicLayout';
import AuthTemplate from '../../components/templates/AuthTemplate';
import LoginForm from '../../features/auth/components/AuthForm/LoginForm';
import { getTexts, AppLocale } from '../../utils/texts';
import { wrapperClass } from './styles';

const LoginPage = () => {
  const locale: AppLocale = 'pt';
  const layoutTexts = getTexts('auth.layout', locale);
  const loginTexts = getTexts('auth.login', locale);

  return (
    <PublicLayout>
      <div className={wrapperClass}>
        <AuthTemplate
          heading={layoutTexts.title}
          subtitle={layoutTexts.subtitle}
          form={<LoginForm />}
        />
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
