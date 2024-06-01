import { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Radio.module.scss';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => {
  return (
    <label className={styles.Radio}>
      <input {...props} className={classNames(styles.input, className)} ref={ref} type={'radio'} />
      <span
        className={classNames(styles.indicator, props.checked ? styles.indicatorChecked : styles.indicatorUnchecked)}
      />
    </label>
  );
});

Radio.displayName = 'Radio';
