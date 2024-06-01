import { TestSchemaFactoryList } from './testApi.types';

export const testSchemaFactoryList: TestSchemaFactoryList = {
  '1': () => ({
    testTitle: 'Тест по зоологии',
    questionList: [
      { type: 'one', question: 'Какой из данных видов птица', answerList: ['крыса', 'пингвин', 'корова', 'мышь'] },
      { type: 'one', question: 'Какой из данных видов является хищником', answerList: ['свинья', 'тигр', 'мышь'] },
      { type: 'many', question: 'Выберите всех рыб', answerList: ['дельфин', 'семга', 'лосось'] },
      { type: 'short', question: 'Опишите коротко, что такое млекопитающие животные', answerList: null },
      {
        type: 'big',
        question: 'Дайте развернутый ответ, почему у хищников глаза сфокусированы в одну точку',
        answerList: null,
      },
    ],
    timeLimitInMin: 2,
  }),
  '2': () => ({
    testTitle: 'Короткий тест из 2 вопросов на проверку таймаута теста',
    questionList: [
      {
        type: 'one',
        question: 'Какой из языков программирования нативно поддерживается браузером',
        answerList: ['JavaScript', 'Java', 'Python', 'PHP'],
      },
      {
        type: 'many',
        question: 'Какие из языков программирования нативно не поддерживаются браузером',
        answerList: ['Java', 'Python', 'PHP', 'JavaScript'],
      },
    ],
    timeLimitInMin: 1,
  }),
};
