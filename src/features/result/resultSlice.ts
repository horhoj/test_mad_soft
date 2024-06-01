import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PersonTestIdContract, PersonTestResult } from '~/contracts/testApi.contracts';
import { RequestList, RequestStateProperty, makeRequestExtraReducer, makeRequestStateProperty } from '~/store/helpers';
import { testApi } from '~/testApi';
import { getApiErrors } from '~/testApi/common';

const SLICE_NAME = 'result';

interface IS {
  getPersonTestResultRequest: RequestStateProperty<PersonTestResult>;
}

const initialState: IS = {
  getPersonTestResultRequest: makeRequestStateProperty(),
};

const { actions, reducer } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, getPersonTestResultThunk, 'getPersonTestResultRequest');
  },
});

interface GetPersonTestResultThunk {
  personTestId: PersonTestIdContract;
}

const getPersonTestResultThunk = createAsyncThunk(
  `${SLICE_NAME}/getPersonTestResultThunk`,
  async ({ personTestId }: GetPersonTestResultThunk, store) => {
    try {
      const result = await testApi.getPersonTestResult(personTestId);
      return store.fulfillWithValue(result);
    } catch (e) {
      return store.rejectWithValue(getApiErrors(e));
    }
  },
);

export const resultSlice = { actions, thunks: { getPersonTestResultThunk } } as const;

export const resultReducer = reducer;
