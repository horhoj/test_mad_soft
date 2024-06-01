import {
  PersonTest,
  PersonTestStoreType,
  TestSchemaFactoryList,
  GenerateUniqueId,
  GetCurrentUnixTime,
  TestSchema,
  Delay,
  Logger,
} from './testApi.types';
import {
  CurrentStepDataContract,
  PersonTestIdContract,
  PersonTestListItemContract,
  PersonTestResult,
  PersonTestStatusContract,
  TestApiContract,
  TestListItemContract,
  messageContract,
} from '~/contracts/testApi.contracts';

export class TestApi implements TestApiContract {
  private testSchemaFactoryList: TestSchemaFactoryList;
  private personTestStore: PersonTestStoreType;
  private generateUniqueId: GenerateUniqueId;
  private getCurrentUnixTime: GetCurrentUnixTime;
  private delay: Delay;
  private logger: Logger;

  public constructor(
    testSchemaFactoryList: TestSchemaFactoryList,
    personTestStore: PersonTestStoreType,
    generateUniqueId: GenerateUniqueId,
    getCurrentUnixTime: GetCurrentUnixTime,
    delay: Delay,
    logger: Logger,
  ) {
    this.testSchemaFactoryList = testSchemaFactoryList;
    this.personTestStore = personTestStore;
    this.generateUniqueId = generateUniqueId;
    this.getCurrentUnixTime = getCurrentUnixTime;
    this.delay = delay;
    this.logger = logger;

    setInterval(() => this.checkTestTimeLimit(), 1000);
  }

  private checkTestTimeLimit() {
    const personTestList = this.personTestStore.getPersonTestList();
    personTestList.forEach((personTest) => {
      if (personTest.status === 'inProgress') {
        const testSchema = this.getTestSchema(personTest.testSchemaId);
        const testExecutionTime = this.getCurrentUnixTime() - personTest.testStartUnixTime;
        const isTimeLimitFailed = testExecutionTime > testSchema.timeLimitInMin * 60 * 1000;
        if (isTimeLimitFailed) {
          this.personTestStore.updatePersonTest(personTest.id, { ...personTest, status: 'isTimeLimitFailed' });
        }
      }
    });
  }

  private async system(msg: string, params: unknown) {
    await this.delay();
    this.logger(`TEST_API: ${msg}`, params);
  }

  private getTestSchema(testSchemaId: string): TestSchema {
    const testSchemaFactory = this.testSchemaFactoryList[testSchemaId];
    if (testSchemaFactory === undefined) {
      throw new Error(messageContract.UNKNOWN_TEST_SCHEMA);
    }

    return testSchemaFactory();
  }

  private getPersonTest(personTestId: string): PersonTest {
    const personTest = this.personTestStore.getPersonTest(personTestId);
    if (personTest === null) {
      throw new Error(messageContract.UNKNOWN_PERSON_TEST);
    }
    return personTest;
  }

  public async getPersonTestList(): Promise<PersonTestListItemContract[]> {
    await this.system('getPersonTestList', {});
    return this.personTestStore.getPersonTestList().map((personTest) => {
      const testSchema = this.getTestSchema(personTest.testSchemaId);
      return {
        id: personTest.id,
        status: personTest.status,
        testTitle: testSchema.testTitle,
        personName: personTest.personName,
        currentQuestionIndex: personTest.currentQuestionIndex,
        questionsCount: testSchema.questionList.length,
        testStartUnixTime: personTest.testStartUnixTime,
        timeLimitInMin: testSchema.timeLimitInMin,
        testEndUnixTime: personTest.testEndUnixTime,
      };
    });
  }

  public async createPersonTest(testSchemaId: string, personName: string): Promise<string> {
    await this.system('createPersonTest', { testSchemaId, personName });
    const id = this.generateUniqueId();
    const personTest: PersonTest = {
      id,
      personName,
      currentQuestionIndex: 0,
      testSchemaId,
      testStartUnixTime: this.getCurrentUnixTime(),
      answers: {},
      status: 'inProgress',
      testEndUnixTime: null,
    };
    this.personTestStore.addPersonTest(personTest);

    return id;
  }

  public async getPersonTestStepData(personTestId: string): Promise<CurrentStepDataContract> {
    await this.system('getPersonTestStepData', { personTestId });
    const personTest = this.getPersonTest(personTestId);
    if (personTest.status === 'isDone') {
      throw new Error(messageContract.TEST_IS_DONE);
    }
    if (personTest.status === 'isTimeLimitFailed') {
      throw new Error(messageContract.TEST_IS_TIME_LIMIT_FAILED);
    }
    const testSchema = this.getTestSchema(personTest.testSchemaId);

    return {
      currentQuestionIndex: personTest.currentQuestionIndex,
      personName: personTest.personName,
      questionsCount: testSchema.questionList.length,
      testStartUnixTime: personTest.testStartUnixTime,
      testTitle: testSchema.testTitle,
      questionData: testSchema.questionList[personTest.currentQuestionIndex],
      timeLimitInMin: testSchema.timeLimitInMin,
    };
  }

  public async submitCurrentQuestion(personTestId: string, answer: string[]): Promise<void> {
    await this.system('submitCurrentQuestion', { personTestId, answer });
    const personTest = this.getPersonTest(personTestId);
    if (personTest.status === 'isDone') {
      throw new Error(messageContract.TEST_IS_DONE);
    }
    if (personTest.status === 'isTimeLimitFailed') {
      throw new Error(messageContract.TEST_IS_TIME_LIMIT_FAILED);
    }
    const testSchema = this.getTestSchema(personTest.testSchemaId);
    const isDone = personTest.currentQuestionIndex + 1 === testSchema.questionList.length;

    this.personTestStore.updatePersonTest(personTestId, {
      ...personTest,
      currentQuestionIndex: isDone ? 0 : personTest.currentQuestionIndex + 1,
      answers: { ...personTest.answers, [personTest.currentQuestionIndex]: answer },
      status: isDone ? 'isDone' : personTest.status,
      testEndUnixTime: isDone ? this.getCurrentUnixTime() : null,
    });
  }

  public async getPersonTestResult(personTestId: PersonTestIdContract): Promise<PersonTestResult> {
    await this.system('getPersonTestResult', { personTestId });
    const personTest = this.getPersonTest(personTestId);
    const testSchema = this.getTestSchema(personTest.testSchemaId);

    return {
      id: personTest.id,
      personName: personTest.personName,
      testTitle: testSchema.testTitle,
      status: personTest.status,
      questionsData: testSchema.questionList,
      answersData: personTest.answers,
      questionsCount: testSchema.questionList.length,
      testStartUnixTime: personTest.testStartUnixTime,
      testEndUnixTime: personTest.testEndUnixTime,
    };
  }

  public async getTestList(): Promise<TestListItemContract[]> {
    await this.system('getTestList', {});
    const schemaFactoryKeyList = Object.keys(this.testSchemaFactoryList);
    return schemaFactoryKeyList.map((schemaKey) => {
      const schema = this.getTestSchema(schemaKey);

      return { id: schemaKey, questionCount: schema.questionList.length, testTitle: schema.testTitle };
    });
  }

  public async getPersonTestStatus(personTestId: PersonTestIdContract): Promise<PersonTestStatusContract> {
    await this.system('getPersonTestStatus', { personTestId });
    const personTest = this.getPersonTest(personTestId);

    return personTest.status;
  }
}
