import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PersonTestListItemContract } from '~/contracts/testApi.contracts';
import { RequestList, RequestStateProperty, makeRequestExtraReducer, makeRequestStateProperty } from '~/store/helpers';
import { testApi } from '~/testApi';
import { getApiErrors } from '~/testApi/common';

const SLICE_NAME = 'main';

interface IS {
  getPersonTestListRequest: RequestStateProperty<PersonTestListItemContract[]>;
}

const initialState: IS = {
  getPersonTestListRequest: makeRequestStateProperty(),
};

const { reducer, actions } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, getPersonTestListThunk, 'getPersonTestListRequest');
  },
});

const getPersonTestListThunk = createAsyncThunk(`${SLICE_NAME}/getPersonTestList`, async (_, store) => {
  try {
    const personTestList = await testApi.getPersonTestList();

    return store.fulfillWithValue(personTestList);
  } catch (e) {
    return store.rejectWithValue(getApiErrors(e));
  }
});

export const mainSlice = { actions, thunks: { getPersonTestListThunk } } as const;

export const mainReducer = reducer;
