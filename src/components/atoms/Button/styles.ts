import { ButtonSize, ButtonVariant } from './interfaces';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[#247d7d]',
  secondary: 'bg-white text-[var(--color-primary)] hover:bg-[#e6f3f3] border border-[rgba(255,255,255,0.4)]',
  ghost: 'bg-transparent text-white hover:bg-[rgba(255,255,255,0.1)]'
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base'
};

export const composeButtonClasses = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean
) => {
  const width = fullWidth ? 'w-full' : '';
  return [base, variantClasses[variant], sizeClasses[size], width].join(' ').trim();
};
