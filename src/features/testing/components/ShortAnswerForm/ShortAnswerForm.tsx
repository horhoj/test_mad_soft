import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '~/ui/Button';
import { Form } from '~/ui/Form';
import { Row } from '~/ui/Flex';
import { ErrorText } from '~/ui/ErrorText';
import { Input } from '~/ui/Input';
import { HelperText } from '~/ui/HelperText';

interface ShortAnswerFormProps {
  onSubmit: (values: string[]) => void;
  isLoading: boolean;
}

interface InitialValues {
  shorted: string;
}

const initialValues: InitialValues = {
  shorted: '',
};

const validationSchema = yup.object({
  shorted: yup.string().required('не должно быть пустым'),
});

export function ShortAnswerForm({ isLoading, onSubmit }: ShortAnswerFormProps) {
  const formik = useFormik<InitialValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit([values.shorted]);
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit} noValidate autoComplete={'off'}>
      <Row>
        <HelperText>Введите краткий ответ</HelperText>
      </Row>
      <Input {...formik.getFieldProps('shorted')} disabled={isLoading} />
      <Row>
        <ErrorText>
          {Boolean(formik.touched.shorted) && Boolean(formik.errors.shorted) && formik.errors.shorted}
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
