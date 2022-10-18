import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataExchangeService from '../service/DataExchangeService';
import C from '../App.constants';

export const fetchUserVehicles = createAsyncThunk('userVehicles/fetchUserVehicles', async () => {
  console.log('call user vehicles');
  const response = await dataExchangeService.getWithPromise(C.USER_VEHICLES_API);
  return response.data;
});

export const userVehiclesSlice = createSlice({
  name: 'userVehicles',

  initialState: {
    data: [],
    status: 'idle',
    error: null
  },

  reducers: {

  },

  extraReducers (builder) {
    builder
      .addCase(fetchUserVehicles.pending, (state, action) => {
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
