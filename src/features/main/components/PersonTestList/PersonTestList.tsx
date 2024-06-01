import { generatePath } from 'react-router-dom';
import styles from './PersonTestList.module.scss';
import { PersonTestIdContract, PersonTestListItemContract } from '~/contracts/testApi.contracts';
import { Row } from '~/ui/Flex';
import { Column } from '~/ui/Column/Column';
import { Strong } from '~/ui/Strong';
import { Ul } from '~/ui/Ul';
import { Li } from '~/ui/Li';
import { HelperText } from '~/ui/HelperText';
import { NavigateWidget } from '~/widgets/NavigateWidget';
import { routes } from '~/router/routes';

export type PersonTestListGoTo = (personTestId: PersonTestIdContract, to: 'result' | 'return') => void;

interface PersonTestListProps {
  personTestList: PersonTestListItemContract[];
  isLoading: boolean;
}
export function PersonTestList({ personTestList, isLoading }: PersonTestListProps) {
  return (
    <Column>
      <Row>
        <Strong>Список текущих тестов</Strong>
      </Row>
      {personTestList.length === 0 && <HelperText>Нет выполненных тестов или тестов в процессе выполнения</HelperText>}
      <Ul>
        {personTestList
          .slice()
          .reverse()
          .map((personTest) => (
            <Li key={personTest.id} className={styles.item}>
              <Column>
                <Row>
                  <Strong>Имя тестируемого: </Strong>
                  <HelperText>{personTest.personName}</HelperText>
                </Row>
                <Row>
                  <Strong>Наименование теста: </Strong>
                  <HelperText>{personTest.testTitle}</HelperText>
                </Row>
                <Row>
                  <Strong>Время начала: </Strong>
                  <HelperText>{new Date(personTest.testStartUnixTime).toLocaleString()}</HelperText>
                </Row>
                {personTest.testEndUnixTime && (
                  <Row>
                    <Strong>Время окончания: </Strong>
                    <HelperText>{new Date(personTest.testEndUnixTime).toLocaleString()}</HelperText>
                  </Row>
                )}
                <Row>
                  <Strong>Статус теста: </Strong>

                  <HelperText>
                    {personTest.status === 'isDone' && <>Завершен</>}
                    {personTest.status === 'inProgress' && (
                      <>
                        В процессе выполнения ({personTest.currentQuestionIndex + 1} из {personTest.questionsCount})
                      </>
                    )}
                    {personTest.status === 'isTimeLimitFailed' && <>Тест провален по лимиту времени</>}
                  </HelperText>
                </Row>
                <Row>
                  <NavigateWidget
                    title={'Результат'}
                    path={generatePath(routes.RESULT, { id: personTest.id })}
                    isLoading={isLoading}
                  />
                  {personTest.status === 'inProgress' && (
                    <NavigateWidget
                      title={'Продолжить'}
                      path={generatePath(routes.TESTING, { id: personTest.id })}
                      isLoading={isLoading}
                    />
                  )}
                </Row>
              </Column>
            </Li>
          ))}
      </Ul>
    </Column>
  );
}
