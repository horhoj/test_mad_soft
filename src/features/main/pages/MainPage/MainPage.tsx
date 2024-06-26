import { useEffect } from 'react';
import { mainSlice } from '../../mainSlice';
import { PersonTestList } from '../../components/PersonTestList';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { routes } from '~/router/routes';
import { PageLayout } from '~/ui/PageLayout';
import { Row } from '~/ui/Flex';
import { NavigateWidget } from '~/widgets/NavigateWidget';
import { PersonTestIdContract } from '~/contracts/testApi.contracts';

const TEST_LIST_POOLING_TIME = 10000;

export function MainPage() {
  const dispatch = useAppDispatch();

  const getPersonTestListRequest = useAppSelector((state) => state.main.getPersonTestListRequest);
  const deletePersonTestRequest = useAppSelector((state) => state.main.deletePersonTestRequest);
  const isLoading = getPersonTestListRequest.isLoading || deletePersonTestRequest.isLoading;

  useEffect(() => {
    const fn = () => dispatch(mainSlice.thunks.getPersonTestListThunk());
    fn();
    const timerId = setInterval(fn, TEST_LIST_POOLING_TIME);
    return () => {
      clearInterval(timerId);
      dispatch(mainSlice.actions.clear());
    };
  }, []);

  const handleDelete = (personTestId: PersonTestIdContract) => {
    dispatch(mainSlice.thunks.deletePersonTestThunk({ personTestId }));
  };

  return (
    <PageLayout isLoading={isLoading}>
      <Row>
        <NavigateWidget title={'Пройти новый тест'} isLoading={isLoading} path={routes.CREATE_TEST} />
      </Row>
      {getPersonTestListRequest.data && (
        <PersonTestList isLoading={isLoading} personTestList={getPersonTestListRequest.data} onDelete={handleDelete} />
      )}
    </PageLayout>
  );
}
