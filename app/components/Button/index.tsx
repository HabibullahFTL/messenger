import clsx from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button = ({
  type = 'button',
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={typeof onClick === 'function' ? onClick : undefined}
      className={clsx(
        `flex justify-center rounded-md  px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-default',
        secondary ? 'text-gray-900' : 'text-white',
        danger &&
          'bg-rose-500 focus:bg-rose-600 focus-visible:outline-rose-600',
        !secondary && !danger
          ? 'bg-sky-500 focus:bg-sky-600 focus-visible:outline-sky-600'
          : ''
      )}
    >
      {children}
    </button>
  );
};

export default Button;
