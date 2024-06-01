import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PersonTestIdContract, TestListItemContract, TestSchemaIdContract } from '~/contracts/testApi.contracts';
import { RequestList, RequestStateProperty, makeRequestExtraReducer, makeRequestStateProperty } from '~/store/helpers';
import { testApi } from '~/testApi';
import { getApiErrors } from '~/testApi/common';

const SLICE_NAME = 'createTest';

interface IS {
  getTestListRequest: RequestStateProperty<TestListItemContract[]>;
  createPersonTestRequest: RequestStateProperty<PersonTestIdContract>;
}

const initialState: IS = {
  getTestListRequest: makeRequestStateProperty(),
  createPersonTestRequest: makeRequestStateProperty(),
};

const { actions, reducer } = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    makeRequestExtraReducer<RequestList<IS>>(builder, getTestListThunk, 'getTestListRequest');
    makeRequestExtraReducer<RequestList<IS>>(builder, createPersonTestThunk, 'createPersonTestRequest');
  },
});

const getTestListThunk = createAsyncThunk(`${SLICE_NAME}/getTestListThunk`, async (_, store) => {
  try {
    const testList = await testApi.getTestList();
    return store.fulfillWithValue(testList);
  } catch (e) {
    return store.rejectWithValue(getApiErrors(e));
  }
});

interface CreatePersonTestThunkPayload {
  testSchemaId: TestSchemaIdContract;
  personName: string;
  redirectCb: (id: string) => void;
}

const createPersonTestThunk = createAsyncThunk(
  `${SLICE_NAME}/createPersonTestThunk`,
  async ({ personName: testName, testSchemaId, redirectCb }: CreatePersonTestThunkPayload, store) => {
    try {
      const id = await testApi.createPersonTest(testSchemaId, testName);
      redirectCb(id);
      return store.fulfillWithValue(id);
    } catch (e) {
      return store.rejectWithValue(getApiErrors(e));
    }
  },
);

export const createTestSlice = { actions, thunks: { getTestListThunk, createPersonTestThunk } } as const;

export const createTestReducer = reducer;
