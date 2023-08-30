import { createSlice } from '@reduxjs/toolkit';
import { VehicleProfile } from './model/VehicleProfile';

interface ConnectedVehicleState {
  vehicle: VehicleProfile | undefined
}

const initialState:ConnectedVehicleState = {
  vehicle: undefined
}

export const connectedVehicleSlice = createSlice({
  name: "connectedVehicle",

  initialState,

  reducers: {
    setConnectedVehicle: (state, action) => {
      state.vehicle = action.payload
    },
    changeConnectedVehicleName: (state, action) => {
      state.vehicle!.name = action.payload
    }
  }

});

export const { setConnectedVehicle, changeConnectedVehicleName } = connectedVehicleSlice.actions;

export default connectedVehicleSlice.reducer;
