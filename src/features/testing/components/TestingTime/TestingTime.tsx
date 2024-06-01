import { useEffect, useRef, useState } from 'react';
import styles from './TestingTime.module.scss';
import { Strong } from '~/ui/Strong';
import { leadTime } from '~/utils/leadTime';

interface TestingTimeProps {
  startUnixTime: number;
}

export function TestingTime({ startUnixTime }: TestingTimeProps) {
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState<ReturnType<typeof leadTime>>({ min: '00', sec: '00' });

  useEffect(() => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }

    timerId.current = setInterval(() => {
      const currentTime = leadTime(startUnixTime, new Date().getTime());
      setTime(currentTime);
    }, 100);
  }, [startUnixTime]);

  return (
    <div className={styles.TestingTime}>
      <Strong className={styles.title}>Тестирование</Strong>
      <span className={styles.timer}>
        {time.min}:{time.sec}
      </span>
    </div>
  );
}
