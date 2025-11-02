import PublicLayout from '../../layouts/PublicLayout';
import AuthTemplate from '../../components/templates/AuthTemplate';
import RecoverForm from '../../features/auth/components/AuthForm/RecoverForm';
import TextLink from '../../components/atoms/TextLink';
import { getTexts, AppLocale } from '../../utils/texts';
import { wrapperClass } from './styles';

const RecoverPage = () => {
  const locale: AppLocale = 'pt';
  const recoverTexts = getTexts('auth.recover', locale);

  return (
    <PublicLayout>
      <div className={wrapperClass}>
        <AuthTemplate
          heading={recoverTexts.title}
          subtitle={recoverTexts.description}
          form={<RecoverForm />}
          footer={
            <p className="text-sm text-[rgba(31,84,98,0.75)]">
              <TextLink href="/login" variant="primary">
                {recoverTexts.backToLogin}
              </TextLink>
            </p>
          }
        />
      </div>
    </PublicLayout>
  );
};

export default RecoverPage;
