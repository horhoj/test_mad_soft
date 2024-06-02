import { PersonTest, PersonTestStoreType } from './testApi.types';

const PERSON_TEST_STORAGE_LS_KEY = 'PERSON_TEST_STORAGE_LS_KEY';

export class PersonTestStore implements PersonTestStoreType {
  private personTestList: PersonTest[] = [];

  public constructor() {
    this.loadFromLS();
  }
  public deletePersonTest(personTestId: string): void {
    this.personTestList = this.personTestList.filter((el) => el.id !== personTestId);
  }

  private saveToLS() {
    localStorage.setItem(PERSON_TEST_STORAGE_LS_KEY, JSON.stringify(this.personTestList));
  }

  private loadFromLS() {
    this.personTestList = JSON.parse(localStorage.getItem(PERSON_TEST_STORAGE_LS_KEY) ?? '[]');
  }

  public getPersonTest(personTestId: string): PersonTest | null {
    const personTest = this.personTestList.find((el) => el.id === personTestId);
    return personTest === undefined ? null : personTest;
  }

  public updatePersonTest(personTestId: string, personTestData: PersonTest): void {
    const index = this.personTestList.findIndex((el) => el.id === personTestId);
    if (index === -1) {
      throw new Error('unknown personTest');
    }
    this.personTestList[index] = personTestData;
    this.saveToLS();
  }

  public addPersonTest(personTestData: PersonTest): void {
    this.personTestList.push(personTestData);
    this.saveToLS();
  }

  public getPersonTestList(): PersonTest[] {
    return this.personTestList;
  }
}
