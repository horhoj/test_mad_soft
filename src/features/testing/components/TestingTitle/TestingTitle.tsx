import { Row } from '~/ui/Flex';
import { HelperText } from '~/ui/HelperText';
import { Strong } from '~/ui/Strong';

interface TestingTitleProps {
  title: string;
  timeLimitInMin: number;
}
export function TestingTitle({ title, timeLimitInMin }: TestingTitleProps) {
  return (
    <Row>
      <Row>
        <Strong>Текущий тест: </Strong>
        <HelperText>{title}</HelperText>
      </Row>
      <Row>
        <Strong>Лимит времени: </Strong>
        <HelperText>{timeLimitInMin} мин.</HelperText>
      </Row>
    </Row>
  );
}
