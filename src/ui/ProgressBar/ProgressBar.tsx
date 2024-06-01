import { useMemo } from 'react';
import classNames from 'classnames';
import styles from './ProgressBar.module.scss';
import { getUUID } from '~/utils/getUUID';

interface ProgressBarProps {
  index: number;
  count: number;
}

export function ProgressBar({ count, index }: ProgressBarProps) {
  const elements: string[] = useMemo(
    () =>
      Array(count)
        .fill(null)
        .map(() => getUUID()),
    [count],
  );

  return (
    <div className={styles.ProgressBar}>
      {elements.map((el, i) => (
        <div
          key={el}
          className={classNames(
            styles.element,
            i < index && styles.prev,
            i === index && styles.current,
            i > index && styles.next,
          )}
        />
      ))}
    </div>
  );
}
