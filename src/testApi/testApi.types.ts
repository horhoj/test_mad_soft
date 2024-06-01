import { PersonTestStatusContract, QuestionDataContract } from '~/contracts/testApi.contracts';

export interface TestSchema {
  testTitle: string;
  questionList: QuestionDataContract[];
  timeLimitInMin: number;
}

export type TestSchemaFactory = () => TestSchema;

export type GenerateUniqueId = () => string;

export type TestSchemaFactoryList = Record<string, TestSchemaFactory>;

export type GetCurrentUnixTime = () => number;

export type Delay = () => Promise<void>;

export type Logger = (msg: string, params: unknown) => void;

export interface PersonTest {
  id: string;
  testSchemaId: string;
  currentQuestionIndex: number;
  testStartUnixTime: number;
  testEndUnixTime: number | null;
  personName: string;
  answers: Record<string, string[]>;
  status: PersonTestStatusContract;
}

export interface PersonTestStoreType {
  getPersonTest(personTestId: string): PersonTest | null;
  updatePersonTest(personTestId: string, personTestData: PersonTest): void;
  addPersonTest(personTestData: PersonTest): void;
  getPersonTestList(): PersonTest[];
}
