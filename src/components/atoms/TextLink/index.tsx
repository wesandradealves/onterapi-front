import Link from 'next/link';
import { TextLinkProps } from './interfaces';
import { baseClass, variantClasses } from './styles';

const TextLink = ({ href, children, variant = 'primary' }: TextLinkProps) => {
  const className = `${baseClass} ${variantClasses[variant]}`.trim();
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default TextLink;
