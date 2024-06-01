import { Fragment, useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { testingSlice } from '../../testingSlice';
import { OneAnswerForm } from '../../components/OneAnswerForm';
import { ManyAnswersForm } from '../../components/ManyAnswersForm';
import { ShortAnswerForm } from '../../components/ShortAnswerForm';
import { BigAnswerForm } from '../../components/BigAnswerForm';
import { QuestionView } from '../../components/QuestionView';
import { TestingTime } from '../../components/TestingTime';
import { TestingTitle } from '../../components/TestingTitle';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { PageLayout } from '~/ui/PageLayout';
import { routes } from '~/router/routes';
import { messageContract } from '~/contracts/testApi.contracts';
import { NavigateWidget } from '~/widgets/NavigateWidget';
import { Row } from '~/ui/Flex';
import { ProgressBar } from '~/ui/ProgressBar';
import { HelperText } from '~/ui/HelperText';

const PERSON_TEST_STATUS_POOLING_TIME = 2500;

export function TestingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const getPersonTestStepDataRequest = useAppSelector((state) => state.testing.getPersonTestStepDataRequest);
  const submitCurrentQuestionThunk = useAppSelector((state) => state.testing.submitCurrentQuestionRequest);
  const formReCreatorKey = useAppSelector((state) => state.testing.formReaCreatorKey);
  const isLoading = getPersonTestStepDataRequest.isLoading || submitCurrentQuestionThunk.isLoading;

  useEffect(() => {
    if (id) {
      dispatch(testingSlice.thunks.getPersonTestStepDataThunk({ personTestId: id }));
    }

    return () => {
      dispatch(testingSlice.actions.clear());
    };
  }, [id]);

  useEffect(() => {
    if (
      id &&
      (getPersonTestStepDataRequest.error?.errorMessage === messageContract.TEST_IS_DONE ||
        getPersonTestStepDataRequest.error?.errorMessage === messageContract.TEST_IS_TIME_LIMIT_FAILED)
    ) {
      const path = generatePath(routes.RESULT, { id });
      navigate(path);
    }
  }, [getPersonTestStepDataRequest.error, id]);

  const getPersonTestStatusRequest = useAppSelector((state) => state.testing.getPersonTestStatusRequest);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!id) {
        return;
      }
      if (getPersonTestStatusRequest.data === 'isTimeLimitFailed') {
        const path = generatePath(routes.RESULT, { id });
        navigate(path);
        return;
      }
      dispatch(testingSlice.thunks.getPersonTestStatusThunk({ personTestId: id }));
    }, PERSON_TEST_STATUS_POOLING_TIME);

    return () => {
      clearInterval(timerId);
    };
  }, [getPersonTestStatusRequest, id]);

  const handleSubmit = (answer: string[]) => {
    if (id) {
      dispatch(
        testingSlice.thunks.submitCurrentQuestionThunk({
          personTestId: id,
          answer,
          errorTestIsDoneCb: () => {
            const path = generatePath(routes.RESULT, { id });
            navigate(path);
          },
        }),
      );
    }
  };

  return (
    <PageLayout isLoading={isLoading}>
      <Row>
        <NavigateWidget title={'Перейти на главную страницу'} path={routes.MAIN} isLoading={isLoading} />
        <HelperText>{`<=`} тест можно будет продолжить с текущего шага</HelperText>
      </Row>
      {getPersonTestStepDataRequest.data && (
        <>
          <TestingTitle
            title={getPersonTestStepDataRequest.data.testTitle}
            timeLimitInMin={getPersonTestStepDataRequest.data.timeLimitInMin}
          />
          <TestingTime startUnixTime={getPersonTestStepDataRequest.data.testStartUnixTime} />
          <ProgressBar
            count={getPersonTestStepDataRequest.data.questionsCount}
            index={getPersonTestStepDataRequest.data.currentQuestionIndex}
          />
          <QuestionView text={getPersonTestStepDataRequest.data.questionData.question} />
        </>
      )}
      {/*
        ЗДЕСЬ МЫ ПОДКЛЮЧАЕМ ДЛЯ КАЖДОГО ТИПА ОТВЕТОВ, СВОЙ ФОРМУ ОБРАБОТКИ
        ЕСЛИ НУЖНО РАСШИРИТЬ ВАРИАНТЫ, ТО НУЖНО БУДЕТ ДОПОЛНИТЬ КОНТРАКТ QuestionDataContract в testApi.contracts
        СОЗДАТЬ ФОРМУ И ПОДКЛЮЧИТЬ ЕЕ В ЭТОМ БЛОКЕ
      */}
      <Fragment key={formReCreatorKey}>
        {getPersonTestStepDataRequest.data?.questionData.type === 'one' && (
          <OneAnswerForm
            answers={getPersonTestStepDataRequest.data.questionData.answerList}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        )}

        {getPersonTestStepDataRequest.data?.questionData.type === 'many' && (
          <ManyAnswersForm
            answers={getPersonTestStepDataRequest.data.questionData.answerList}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        )}

        {getPersonTestStepDataRequest.data?.questionData.type === 'short' && (
          <ShortAnswerForm isLoading={isLoading} onSubmit={handleSubmit} />
        )}

        {getPersonTestStepDataRequest.data?.questionData.type === 'big' && (
          <BigAnswerForm isLoading={isLoading} onSubmit={handleSubmit} />
        )}
      </Fragment>
    </PageLayout>
  );
}
