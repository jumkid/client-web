import { createSlice } from '@reduxjs/toolkit';

interface VehiclePickerState {
  value: number
}

const initialState: VehiclePickerState = {
  value: 0
};

export const vehiclePickerSlice = createSlice({
  name: 'vehiclePicker',

  initialState,

  reducers: {
    changePick: (state, action) => {
      state.value = action.payload;
    }
  }

});

export const { changePick } = vehiclePickerSlice.actions;

export default vehiclePickerSlice.reducer;
