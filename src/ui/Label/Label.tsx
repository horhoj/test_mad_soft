import styles from './Label.module.scss';

interface LabelProps {
  children?: React.ReactNode;
}
export function Label({ children }: LabelProps) {
  return <label className={styles.Label}>{children}</label>;
}
