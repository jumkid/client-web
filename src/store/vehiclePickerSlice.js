import { createSlice } from '@reduxjs/toolkit';

export const vehiclePickerSlice = createSlice({
  name: 'vehiclePicker',

  initialState: {
    value: 0
  },

  reducers: {
    changePick: (state, action) => {
      state.value = action.payload;
    }
  }

});

export const { changePick } = vehiclePickerSlice.actions;

export default vehiclePickerSlice.reducer;
