import { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { createTestSlice } from '../../createTestSlice';
import { TestList } from '../../components/TestList';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { PageLayout } from '~/ui/PageLayout';
import { TestSchemaIdContract } from '~/contracts/testApi.contracts';
import { routes } from '~/router/routes';
import { Row } from '~/ui/Flex';
import { NavigateWidget } from '~/widgets/NavigateWidget';

export function CreateTestPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getTestListRequest = useAppSelector((state) => state.createTest.getTestListRequest);
  const createPersonTestRequest = useAppSelector((state) => state.createTest.createPersonTestRequest);

  const isLoading = getTestListRequest.isLoading || createPersonTestRequest.isLoading;

  useEffect(() => {
    dispatch(createTestSlice.thunks.getTestListThunk());
    return () => {
      dispatch(createTestSlice.actions.clear());
    };
  }, []);

  const handleCreateTest = (testSchemaId: TestSchemaIdContract) => {
    dispatch(
      createTestSlice.thunks.createPersonTestThunk({
        personName: 'Тестируемый',
        testSchemaId,
        redirectCb: (id: string) => {
          const path = generatePath(routes.TESTING, { id });
          navigate(path);
        },
      }),
    );
  };

  return (
    <PageLayout isLoading={isLoading}>
      <Row>
        <NavigateWidget title={'Перейти на главную страницу'} path={routes.MAIN} isLoading={isLoading} />
      </Row>
      {getTestListRequest.data && (
        <TestList testList={getTestListRequest.data} onSelect={handleCreateTest} isLoading={isLoading} />
      )}
    </PageLayout>
  );
}
