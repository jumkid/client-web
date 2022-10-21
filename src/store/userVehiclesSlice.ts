import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataExchangeService from '../service/DataExchangeService';
import * as C from '../App.constants';
import { VehicleProfile } from './model/VehicleProfile';

export const fetchUserVehicles = createAsyncThunk('userVehicles/fetchUserVehicles', async () => {
  console.log('fetch user vehicles');
  const response = await dataExchangeService.getWithPromise(C.USER_VEHICLES_API, null);
  return (response != null) && response.data || [];
});

interface UserVehicleListState {
  data: VehicleProfile[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string | undefined
}

const initialState: UserVehicleListState = {
  data: [],
  status: 'idle',
  error: ''
};

export const userVehiclesSlice = createSlice({
  name: 'userVehicles',

  initialState,

  reducers: {

  },

  extraReducers (builder) {
    builder
      .addCase(fetchUserVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched posts to the array
        state.data = action.payload;
      })
      .addCase(fetchUserVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }

});

export default userVehiclesSlice.reducer;
