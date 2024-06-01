import classNames from 'classnames';
import styles from './Column.module.scss';

interface ColumnProps {
  children?: React.ReactNode;
  className?: string;
}
export function Column({ children, className }: ColumnProps) {
  return <div className={classNames(styles.Column, className)}>{children}</div>;
}
