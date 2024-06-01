import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CurrentStepDataContract,
  PersonTestIdContract,
  PersonTestStatusContract,
  messageContract,
} from '~/contracts/testApi.contracts';
import { RequestList, RequestStateProperty, makeRequestExtraReducer, makeRequestStateProperty } from '~/store/helpers';
import { testApi } from '~/testApi';
import { getApiErrors } from '~/testApi/common';
import { ApiError } from '~/testApi/common.types';

const SLICE_NAME = 'testing';

interface IS {
  getPersonTestStepDataRequest: RequestStateProperty<CurrentStepDataContract, ApiError>;
  submitCurrentQuestionRequest: RequestStateProperty;
  getPersonTestStatusRequest: RequestStateProperty<PersonTestStatusContract>;
  formReaCreatorKey: number;
}

const initialState: IS = {
  getPersonTestStepDataRequest: makeRequestStateProperty(),
  submitCurrentQuestionRequest: makeRequestStateProperty(),
  getPersonTestStatusRequest: makeRequestStateProperty(),
  formReaCreatorKey: 0,
};

const { reducer, actions } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
    formReCreatorKeyInc: (state) => {
      state.formReaCreatorKey += 1;
    },
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, getPersonTestStepDataThunk, 'getPersonTestStepDataRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, submitCurrentQuestionThunk, 'submitCurrentQuestionRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, getPersonTestStatusThunk, 'getPersonTestStatusRequest');
  },
});

interface getPersonTestStepDataThunkPayload {
  personTestId: PersonTestIdContract;
}

const getPersonTestStepDataThunk = createAsyncThunk(
  `${SLICE_NAME}/getPersonTestStepDataThunk`,
  async ({ personTestId }: getPersonTestStepDataThunkPayload, store) => {
    try {
      const id = await testApi.getPersonTestStepData(personTestId);
      store.dispatch(actions.formReCreatorKeyInc());
      return store.fulfillWithValue(id);
    } catch (e) {
      return store.rejectWithValue(getApiErrors(e));
    }
  },
);

interface SubmitCurrentQuestionThunkPayload {
  personTestId: PersonTestIdContract;
  answer: string[];
  errorTestIsDoneCb: () => void;
}

const submitCurrentQuestionThunk = createAsyncThunk(
  `${SLICE_NAME}/submitCurrentQuestionThunk`,
  async ({ personTestId, answer, errorTestIsDoneCb }: SubmitCurrentQuestionThunkPayload, store) => {
    try {
      const id = await testApi.submitCurrentQuestion(personTestId, answer);
      store.dispatch(getPersonTestStepDataThunk({ personTestId }));
      return store.fulfillWithValue(id);
    } catch (e) {
      const error = getApiErrors(e);
      if (
        error.errorMessage === messageContract.TEST_IS_DONE ||
        error.errorMessage === messageContract.TEST_IS_TIME_LIMIT_FAILED
      ) {
        errorTestIsDoneCb();
      }
      return store.rejectWithValue(getApiErrors(error));
    }
  },
);

interface getPersonTestStatusThunkPayload {
  personTestId: PersonTestIdContract;
}

const getPersonTestStatusThunk = createAsyncThunk(
  `${SLICE_NAME}/getPersonTestStatusThunk`,
  async ({ personTestId }: getPersonTestStatusThunkPayload, store) => {
    try {
      const status = await testApi.getPersonTestStatus(personTestId);
      return store.fulfillWithValue(status);
    } catch (e) {
      return store.rejectWithValue(getApiErrors(e));
    }
  },
);

export const testingSlice = {
  actions,
  thunks: { getPersonTestStepDataThunk, submitCurrentQuestionThunk, getPersonTestStatusThunk },
} as const;

export const testingReducer = reducer;
