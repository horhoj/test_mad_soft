import { Column } from '../Column/Column';
import { Spinner } from '../Spinner';
import styles from './PageLayout.module.scss';

interface PageLayoutProps {
  children?: React.ReactNode;
  isLoading: boolean;
}
export function PageLayout({ children, isLoading }: PageLayoutProps) {
  return (
    <>
      <Spinner isShow={isLoading} />
      <Column className={styles.PageLayout}>{children}</Column>
    </>
  );
}
