import { Navigate, Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { MainPage } from '~/features/main/pages/MainPage';
import { TestingPage } from '~/features/testing/pages/TestingPage';
import { ResultPage } from '~/features/result/pages/ResultPage';
import { CreateTestPage } from '~/features/createTest/pages/CreateTestPage';

export function Router() {
  return (
    <>
      <Routes>
        <Route path={routes.MAIN} element={<MainPage />} />
        <Route path={routes.TESTING} element={<TestingPage />} />
        <Route path={routes.RESULT} element={<ResultPage />} />
        <Route path={routes.CREATE_TEST} element={<CreateTestPage />} />
        <Route path={'*'} element={<Navigate to={routes.MAIN} replace={true} />} />
      </Routes>
    </>
  );
}
