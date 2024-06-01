import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ children, className, ...props }, ref) => {
  return (
    <input {...props} className={classNames(styles.Input, className)} ref={ref}>
      {children}
    </input>
  );
});

Input.displayName = 'Button';
