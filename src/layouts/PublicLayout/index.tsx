import { PublicLayoutProps } from './interfaces';
import { containerClass, contentWrapperClass } from './styles';

const PublicLayout = ({ children }: PublicLayoutProps) => (
  <div className={`${containerClass} relative overflow-hidden`}>
    <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute top-24 right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
    <div className={contentWrapperClass}>{children}</div>
  </div>
);

export default PublicLayout;
