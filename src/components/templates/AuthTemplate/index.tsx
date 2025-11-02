import { AuthTemplateProps } from './interfaces';
import { containerClass, cardClass, badgeClass, headingClass, subtitleClass } from './styles';

const AuthTemplate = ({ heading, subtitle, form, footer, localeSwitcher, topAction }: AuthTemplateProps) => (
  <div className={`${containerClass} relative`}>
    {localeSwitcher && (
      <div className="absolute right-0 top-0 flex items-center gap-3">{localeSwitcher}</div>
    )}
    {topAction && <div className="absolute left-0 top-0">{topAction}</div>}
    <div className={cardClass}>
      <div className={badgeClass} aria-hidden>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" width="4" height="36" rx="2" fill="white" />
          <rect y="16" width="36" height="4" rx="2" fill="white" />
        </svg>
      </div>
      <h1 className={headingClass}>{heading}</h1>
      <p className={subtitleClass}>{subtitle}</p>
      <div className="w-full">{form}</div>
      {footer && <div className="w-full text-sm text-[rgba(31,84,98,0.75)]">{footer}</div>}
    </div>
  </div>
);

export default AuthTemplate;
