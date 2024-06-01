import styles from './DevView.module.scss';

interface DevViewProps {
  data: unknown;
  title: string;
}
export function DevView({ data, title }: DevViewProps) {
  if (data) {
    return (
      <div className={styles.DevView}>
        <div>
          <strong>{title}</strong>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }
  return null;
}
