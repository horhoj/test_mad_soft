import { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <label className={styles.Checkbox}>
      <input {...props} className={classNames(styles.input, className)} ref={ref} type={'checkbox'} />
      <span
        className={classNames(styles.indicator, props.checked ? styles.indicatorChecked : styles.indicatorUnchecked)}
      />
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
