import { FormHTMLAttributes, ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Form.module.scss';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(({ children, className, ...props }, ref) => {
  return (
    <form {...props} className={classNames(styles.Form, className)} ref={ref}>
      {children}
    </form>
  );
});

Form.displayName = 'Form';
