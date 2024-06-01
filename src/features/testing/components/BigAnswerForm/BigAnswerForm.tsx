import * as yup from 'yup';
import { useFormik } from 'formik';
import { Button } from '~/ui/Button';
import { Form } from '~/ui/Form';
import { Row } from '~/ui/Flex';
import { ErrorText } from '~/ui/ErrorText';
import { TextArea } from '~/ui/TextArea';
import { HelperText } from '~/ui/HelperText';

interface BigAnswerFormProps {
  onSubmit: (values: string[]) => void;
  isLoading: boolean;
}

interface InitialValues {
  big: string;
}

const initialValues: InitialValues = {
  big: '',
};

const validationSchema = yup.object({
  big: yup.string().required('не должно быть пустым'),
});

export function BigAnswerForm({ isLoading, onSubmit }: BigAnswerFormProps) {
  const formik = useFormik<InitialValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit([values.big]);
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit} noValidate autoComplete={'off'}>
      <Row>
        <HelperText>Введите развернутый ответ</HelperText>
      </Row>
      <TextArea {...formik.getFieldProps('big')} disabled={isLoading} />
      <Row>
        <ErrorText>{Boolean(formik.touched.big) && Boolean(formik.errors.big) && formik.errors.big}</ErrorText>
      </Row>
      <Row>
        <Button disabled={isLoading} type={'submit'}>
          Ответить
        </Button>
      </Row>
    </Form>
  );
}
