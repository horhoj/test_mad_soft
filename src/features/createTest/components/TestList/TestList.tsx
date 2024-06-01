import styles from './TestList.module.scss';
import { Button } from '~/ui/Button';
import { TestListItemContract, TestSchemaIdContract } from '~/contracts/testApi.contracts';
import { Column } from '~/ui/Column/Column';
import { Ul } from '~/ui/Ul';
import { Li } from '~/ui/Li';
import { Row } from '~/ui/Flex';
import { Strong } from '~/ui/Strong';

interface TestListProps {
  testList: TestListItemContract[];
  onSelect: (testSchemaId: TestSchemaIdContract) => void;
  isLoading: boolean;
}

export function TestList({ testList, onSelect, isLoading }: TestListProps) {
  return (
    <Column>
      <Row>
        <Strong>Доступные тесты</Strong>
      </Row>
      <Ul>
        {testList.map((test) => (
          <Li key={test.id} className={styles.testItem}>
            <Row>
              <Button onClick={() => onSelect(test.id)} disabled={isLoading}>
                Пройти
              </Button>
              {test.testTitle}
            </Row>
          </Li>
        ))}
      </Ul>
    </Column>
  );
}
