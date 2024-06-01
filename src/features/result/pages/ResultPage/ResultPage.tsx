import { useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { resultSlice } from '../../resultSlice';
import styles from './ResultPage.module.scss';
import { makeQuestionDataView } from './ResultPage.helpers';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { PageLayout } from '~/ui/PageLayout';
import { NavigateWidget } from '~/widgets/NavigateWidget';
import { routes } from '~/router/routes';
import { Row } from '~/ui/Flex';
import { Strong } from '~/ui/Strong';
import { Ul } from '~/ui/Ul';
import { Li } from '~/ui/Li';
import { Column } from '~/ui/Column/Column';
import { HelperText } from '~/ui/HelperText';

export function ResultPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const getPersonTestResultRequest = useAppSelector((state) => state.result.getPersonTestResultRequest);
  const isLoading = getPersonTestResultRequest.isLoading;

  useEffect(() => {
    if (id) {
      dispatch(resultSlice.thunks.getPersonTestResultThunk({ personTestId: id }));
    }

    return () => {
      dispatch(resultSlice.actions.clear());
    };
  }, [id]);

  const questionDataView = useMemo(
    () => makeQuestionDataView(getPersonTestResultRequest.data),
    [getPersonTestResultRequest.data],
  );

  return (
    <PageLayout isLoading={isLoading}>
      <Row>
        <NavigateWidget title={'Перейти на главную страницу'} path={routes.MAIN} isLoading={isLoading} />
      </Row>
      {getPersonTestResultRequest.data && (
        <>
          <Row>
            <Strong>Имя тестируемого: </Strong>
            <HelperText>{getPersonTestResultRequest.data.personName}</HelperText>
          </Row>
          <Row>
            <Strong>Время начала теста: </Strong>
            <HelperText>{new Date(getPersonTestResultRequest.data.testStartUnixTime).toLocaleString()}</HelperText>
          </Row>
          {getPersonTestResultRequest.data.testEndUnixTime !== null && (
            <Row>
              <Strong>Время окончания теста: </Strong>
              <HelperText>{new Date(getPersonTestResultRequest.data.testEndUnixTime).toLocaleString()}</HelperText>
            </Row>
          )}
          <Row>
            <Strong>Статус теста: </Strong>
            <HelperText>
              {getPersonTestResultRequest.data.status === 'isDone' && <>Завершен</>}
              {getPersonTestResultRequest.data.status === 'inProgress' && <>В процессе выполнения</>}
              {getPersonTestResultRequest.data.status === 'isTimeLimitFailed' && <>Тест провален по лимиту времени</>}
            </HelperText>
          </Row>
          <Row>
            <Strong>Ответы на вопросы: </Strong>
          </Row>
          {questionDataView !== null && (
            <Ul>
              {questionDataView.map((question) => (
                <Li key={question.id} className={styles.questionCard}>
                  <Column>
                    <Row>
                      <Strong>Вопрос: </Strong>
                      <HelperText>{question.question}</HelperText>
                    </Row>
                    <Row>
                      <Strong>Ответы тестируемого: </Strong>
                    </Row>
                    <Ul className={styles.answerList}>
                      {question.answers.length === 0 && <HelperText>Ответ не предоставлен</HelperText>}
                      {question.answers.map((answer) => (
                        <Li key={answer.id}>
                          {'- '}
                          <HelperText>{answer.value}</HelperText>
                        </Li>
                      ))}
                    </Ul>
                  </Column>
                </Li>
              ))}
            </Ul>
          )}
        </>
      )}
    </PageLayout>
  );
}
