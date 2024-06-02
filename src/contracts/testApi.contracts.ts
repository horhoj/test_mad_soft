export type PersonTestIdContract = string;
export type TestSchemaIdContract = string;

type QuestionDataContractTypeFactory<T extends string, A = null> = { question: string; type: T; answerList: A };

// РАСШИРЯЯ ДАННЫЙ ИНТЕРФЕЙС, МОЖНО ДОБАВИТЬ НОВЫЕ ТИПЫ ОТВЕТОВ
export type QuestionDataContract =
  | QuestionDataContractTypeFactory<'one', string[]>
  | QuestionDataContractTypeFactory<'many', string[]>
  | QuestionDataContractTypeFactory<'short', null>
  | QuestionDataContractTypeFactory<'big', null>;

export type AnswersDataContract = Record<string, string[]>;

export interface CurrentStepDataContract {
  personName: string;
  testTitle: string;
  questionsCount: number;
  currentQuestionIndex: number;
  testStartUnixTime: number;
  questionData: QuestionDataContract;
  timeLimitInMin: number;
}

export type PersonTestStatusContract = 'isDone' | 'inProgress' | 'isTimeLimitFailed';

export interface PersonTestListItemContract {
  id: PersonTestIdContract;
  testTitle: string;
  personName: string;
  status: PersonTestStatusContract;
  questionsCount: number;
  testStartUnixTime: number;
  testEndUnixTime: number | null;
  currentQuestionIndex: number;
  timeLimitInMin: number;
}

export interface PersonTestResult {
  id: PersonTestIdContract;
  testTitle: string;
  personName: string;
  status: PersonTestStatusContract;
  questionsCount: number;
  questionsData: QuestionDataContract[];
  answersData: AnswersDataContract;
  testStartUnixTime: number;
  testEndUnixTime: number | null;
}

export interface TestListItemContract {
  id: PersonTestIdContract;
  testTitle: string;
  questionCount: number;
}

export interface TestApiContract {
  createPersonTest(testSchemaId: TestSchemaIdContract, personName: string): Promise<PersonTestIdContract>;
  getPersonTestStepData(personTestId: PersonTestIdContract): Promise<CurrentStepDataContract>;
  submitCurrentQuestion(personTestId: PersonTestIdContract, answer: string[]): Promise<void>;
  getPersonTestList(): Promise<PersonTestListItemContract[]>;
  getPersonTestResult(personTestId: PersonTestIdContract): Promise<PersonTestResult>;
  getTestList(): Promise<TestListItemContract[]>;
  getPersonTestStatus(personTestId: PersonTestIdContract): Promise<PersonTestStatusContract>;
  deletePersonTest(personTestId: PersonTestIdContract): Promise<void>;
}

export enum messageContract {
  TEST_IS_DONE = 'TEST_IS_DONE',
  TEST_IS_TIME_LIMIT_FAILED = 'TEST_IS_TIME_LIMIT_FAILED',
  UNKNOWN_TEST_SCHEMA = 'UNKNOWN_TEST_SCHEMA',
  UNKNOWN_PERSON_TEST = 'UNKNOWN_PERSON_TEST',
}
