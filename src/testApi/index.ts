import { TestApi } from './testApi';
import { PersonTestStore } from './personTestStore';
import { testSchemaFactoryList } from './testApi.schemas';
import { getUUID } from '~/utils/getUUID';
import { delay } from '~/utils/delay';
import { logger } from '~/utils/logger';

export const personTestStore = new PersonTestStore();

export const testApi = new TestApi(
  testSchemaFactoryList,
  personTestStore,
  () => getUUID(),
  () => new Date().getTime(),
  () => delay(300),
  logger,
);
