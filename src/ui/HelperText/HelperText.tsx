import styles from './HelperText.module.scss';

interface HelperTextProps {
  children?: React.ReactNode;
}
export function HelperText({ children }: HelperTextProps) {
  return <span className={styles.HelperText}>{children}</span>;
}
