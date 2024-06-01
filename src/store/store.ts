import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as rp from 'redux-persist';
import { settingsReducer } from './settingsSlice';
import { mainReducer } from '~/features/main/mainSlice';
import { testingReducer } from '~/features/testing/testingSlice';
import { resultReducer } from '~/features/result/resultSlice';
import { createTestReducer } from '~/features/createTest/createTestSlice';

const reducers = combineReducers({
  settings: settingsReducer,
  main: mainReducer,
  testing: testingReducer,
  result: resultReducer,
  createTest: createTestReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    // whitelist: ['settings'],
    whitelist: [],
  },
  reducers,
);

export const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [rp.FLUSH, rp.REHYDRATE, rp.PAUSE, rp.PERSIST, rp.PURGE, rp.REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
