import classNames from 'classnames';
import styles from './Li.module.scss';

interface LiProps {
  children?: React.ReactNode;
  className?: string;
}
export function Li({ children, className }: LiProps) {
  return <li className={classNames(styles.Li, className)}>{children}</li>;
}
