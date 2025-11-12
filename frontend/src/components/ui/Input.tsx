import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border ${
            error ? 'border-damage-critical' : 'border-neutral-300'
          } rounded-md px-3 py-2 text-neutral-900 bg-white focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-damage-critical' : 'focus:ring-primary-500'
          } focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed transition-shadow ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-damage-critical">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
