import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PersonTestListItemContract, PersonTestIdContract } from '~/contracts/testApi.contracts';
import { RequestList, RequestStateProperty, makeRequestExtraReducer, makeRequestStateProperty } from '~/store/helpers';
import { testApi } from '~/testApi';
import { getApiErrors } from '~/testApi/common';

const SLICE_NAME = 'main';

interface IS {
  getPersonTestListRequest: RequestStateProperty<PersonTestListItemContract[]>;
  deletePersonTestRequest: RequestStateProperty;
}

const initialState: IS = {
  getPersonTestListRequest: makeRequestStateProperty(),
  deletePersonTestRequest: makeRequestStateProperty(),
};

const { reducer, actions } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, getPersonTestListThunk, 'getPersonTestListRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, deletePersonTestThunk, 'deletePersonTestRequest');
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

interface DeletePersonTestThunkPayload {
  personTestId: PersonTestIdContract;
}

const deletePersonTestThunk = createAsyncThunk(
  `${SLICE_NAME}/deletePersonTestThunk`,
  async ({ personTestId }: DeletePersonTestThunkPayload, store) => {
    try {
      const personTestList = await testApi.deletePersonTest(personTestId);

      store.dispatch(getPersonTestListThunk());

      return store.fulfillWithValue(personTestList);
    } catch (e) {
      return store.rejectWithValue(getApiErrors(e));
    }
  },
);

export const mainSlice = { actions, thunks: { getPersonTestListThunk, deletePersonTestThunk } } as const;

export const mainReducer = reducer;
