import { useFormik } from 'formik';
import * as yup from 'yup';
import { getUUID } from '~/utils/getUUID';
import { Button } from '~/ui/Button';
import { Row } from '~/ui/Flex';
import { Ul } from '~/ui/Ul';
import { Li } from '~/ui/Li';
import { Form } from '~/ui/Form';
import { ErrorText } from '~/ui/ErrorText';
import { Label } from '~/ui/Label';
import { Radio } from '~/ui/Radio';
import { HelperText } from '~/ui/HelperText';

interface OneAnswerFormProps {
  answers: string[];
  onSubmit: (values: string[]) => void;
  isLoading: boolean;
}

interface InitialValues {
  picked: string;
}

const initialValues: InitialValues = {
  picked: '',
};

const validationSchema = yup.object({
  picked: yup.string().required('Необходимо выбрать хотя бы один вариант'),
});

export function OneAnswerForm({ answers, isLoading, onSubmit }: OneAnswerFormProps) {
  const answerItems = answers.map((value) => ({ value, id: getUUID() }));

  const formik = useFormik<InitialValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit([values.picked]);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate autoComplete={'off'}>
      <Row>
        <HelperText>Выберите один из вариантов ответа</HelperText>
      </Row>
      <Ul>
        {answerItems.map((answer) => (
          <Li key={answer.id}>
            <Label>
              <Radio
                key={answer.id}
                {...formik.getFieldProps('picked')}
                value={answer.value}
                checked={answer.value === formik.getFieldProps('picked').value}
                disabled={isLoading}
              />
              {answer.value}
            </Label>
          </Li>
        ))}
      </Ul>
      <Row>
        <ErrorText>{Boolean(formik.touched.picked) && Boolean(formik.errors.picked) && formik.errors.picked}</ErrorText>
      </Row>
      <Row>
        <Button disabled={isLoading} type={'submit'}>
          Ответить
        </Button>
      </Row>
    </Form>
  );
}
