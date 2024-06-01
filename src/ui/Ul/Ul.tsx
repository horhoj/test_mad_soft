import classNames from 'classnames';
import styles from './Ul.module.scss';

interface UlProps {
  children?: React.ReactNode;
  className?: string;
}
export function Ul({ children, className }: UlProps) {
  return <ul className={classNames(styles.Ul, className)}>{children}</ul>;
}
