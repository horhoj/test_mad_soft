import classNames from 'classnames';
import styles from './Strong.module.scss';

interface StrongProps {
  children?: React.ReactNode;
  className?: string;
}
export function Strong({ children, className }: StrongProps) {
  return <strong className={classNames(styles.Strong, className)}>{children}</strong>;
}
