import styles from './Row.module.scss';

interface RowProps {
  children?: React.ReactNode;
}

export function Row({ children }: RowProps) {
  return <div className={styles.Row}>{children}</div>;
}
