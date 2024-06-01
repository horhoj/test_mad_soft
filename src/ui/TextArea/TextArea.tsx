import { ReactNode, TextareaHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './TextArea.module.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ children, className, ...props }, ref) => {
  return (
    <textarea {...props} className={classNames(styles.TextArea, className)} ref={ref}>
      {children}
    </textarea>
  );
});

TextArea.displayName = 'TextArea';
