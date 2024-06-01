import styles from './ErrorText.module.scss';

interface ErrorTextProps {
  children?: React.ReactNode;
}
export function ErrorText({ children }: ErrorTextProps) {
  return <span className={styles.ErrorText}>{children}</span>;
}
