import * as yup from 'yup';
import { useFormik } from 'formik';
import { getUUID } from '~/utils/getUUID';
import { Button } from '~/ui/Button';
import { Form } from '~/ui/Form';
import { Row } from '~/ui/Flex';
import { Ul } from '~/ui/Ul';
import { Li } from '~/ui/Li';
import { Label } from '~/ui/Label';
import { ErrorText } from '~/ui/ErrorText';
import { Checkbox } from '~/ui/Checker';
import { HelperText } from '~/ui/HelperText';

interface ManyAnswersFormProps {
  answers: string[];
  onSubmit: (values: string[]) => void;
  isLoading: boolean;
}

interface InitialValues {
  checked: string[];
}

const initialValues: InitialValues = {
  checked: [],
};

const validationSchema = yup.object({
  checked: yup.array(yup.string().required()).min(1, 'выберите хотя бы одно значение'),
});

export function ManyAnswersForm({ answers, isLoading, onSubmit }: ManyAnswersFormProps) {
  const answerItems = answers.map((value) => ({ value, id: getUUID() }));

  const formik = useFormik<InitialValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values.checked);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate autoComplete={'off'}>
      <Row>
        <HelperText>Выберите один или несколько вариантов ответа</HelperText>
      </Row>
      <Ul>
        {answerItems.map((answer) => (
          <Li key={answer.id}>
            <Label key={answer.id}>
              <Checkbox
                key={answer.id}
                onChange={formik.handleChange}
                name={formik.getFieldProps('checked').name}
                disabled={isLoading}
                value={answer.value}
                checked={formik.values.checked.includes(answer.value)}
              />
              {answer.value}
            </Label>
          </Li>
        ))}
      </Ul>
      <Row>
        <ErrorText>
          {Boolean(formik.touched.checked) && Boolean(formik.errors.checked) && formik.errors.checked}
        </ErrorText>
      </Row>
      <Row>
        <Button disabled={isLoading} type={'submit'}>
          Ответить
        </Button>
      </Row>
    </Form>
  );
}
