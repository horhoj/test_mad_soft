import { PersonTestResult } from '~/contracts/testApi.contracts';
import { getUUID } from '~/utils/getUUID';

export const makeQuestionDataView = (personTestResult: PersonTestResult | null) => {
  if (personTestResult === null) {
    return null;
  }

  return personTestResult.questionsData.map((el, index) => {
    const answersData = personTestResult.answersData[index];
    const answers = answersData !== undefined ? answersData.map((value) => ({ id: getUUID(), value })) : [];
    return {
      id: getUUID(),
      question: el.question,
      type: el.type,
      answers,
    };
  });
};
