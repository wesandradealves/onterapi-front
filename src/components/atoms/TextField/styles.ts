const baseContainer = 'flex flex-col gap-2';
const labelClass = 'text-sm font-semibold text-[var(--color-secondary)]';

const baseInput =
  'w-full rounded-full border border-[rgba(255,255,255,0.5)] bg-white/80 px-6 py-3 text-[var(--color-secondary)] placeholder:text-[rgba(31,84,98,0.6)] shadow-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40';

const inputError =
  'border-[rgba(235,87,87,0.5)] focus:border-[rgba(235,87,87,0.8)] focus:ring-[rgba(235,87,87,0.4)]';

const helperTextClass = 'text-xs text-[rgba(31,84,98,0.7)]';
const errorTextClass = 'text-xs text-[rgba(235,87,87,0.9)]';

export const styles = {
  container: baseContainer,
  label: labelClass,
  helper: helperTextClass,
  error: errorTextClass,
  input: baseInput,
  inputError
};
