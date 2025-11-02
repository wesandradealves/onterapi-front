import { forwardRef } from 'react';
import { TextFieldProps } from './interfaces';
import { styles } from './styles';

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leadingIcon,
      trailingIcon,
      trailingIconAction,
      trailingIconButtonLabel,
      fullWidth = true,
      className,
      ...rest
    },
    ref
  ) => {
    const wrapperClass = fullWidth ? `${styles.container} w-full` : styles.container;
    const inputBase = errorMessage ? `${styles.input} ${styles.inputError}` : styles.input;
    const inputClass = className ? `${inputBase} ${className}` : inputBase;

    const trailing = trailingIconAction ? (
      <button
        type="button"
        onClick={trailingIconAction}
        className="absolute right-4 flex h-6 w-6 items-center justify-center text-[var(--color-secondary)]"
        aria-label={trailingIconButtonLabel}
      >
        {trailingIcon}
      </button>
    ) : trailingIcon ? (
      <span className="pointer-events-none absolute right-4 text-[var(--color-secondary)]/70">
        {trailingIcon}
      </span>
    ) : null;

    return (
      <label className={wrapperClass}>
        <span className={styles.label}>{label}</span>
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="pointer-events-none absolute left-4 text-[var(--color-secondary)]/70">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`${inputClass} ${leadingIcon ? 'pl-10' : ''} ${trailingIcon ? 'pr-12' : ''}`.trim()}
            {...rest}
          />
          {trailing}
        </div>
        {errorMessage ? (
          <span className={styles.error}>{errorMessage}</span>
        ) : helperText ? (
          <span className={styles.helper}>{helperText}</span>
        ) : null}
      </label>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
