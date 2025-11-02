import { forwardRef } from 'react';
import { ButtonProps } from './interfaces';
import { composeButtonClasses } from './styles';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      leadingIcon,
      trailingIcon,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className,
      ...rest
    },
    ref
  ) => {
    const classes = composeButtonClasses(variant, size, fullWidth);
    const finalClassName = className ? `${classes} ${className}` : classes;
    const isDisabled = disabled ?? isLoading;

    return (
      <button
        ref={ref}
        className={finalClassName}
        disabled={isDisabled}
        {...rest}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {!isLoading && leadingIcon}
        <span>{label}</span>
        {!isLoading && trailingIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
