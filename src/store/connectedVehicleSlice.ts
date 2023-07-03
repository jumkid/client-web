import { createSlice } from '@reduxjs/toolkit';
import { VehicleProfile } from './model/VehicleProfile';

interface ConnectedVehicleState {
  connectorStep: number
  vehicle: VehicleProfile | undefined
}

const initialState:ConnectedVehicleState = {
  connectorStep: 0,
  vehicle: undefined
}

export const connectedVehicleSlice = createSlice({
  name: "connectedVehicle",

  initialState,

  reducers: {
    setConnectedVehicle: (state, action) => {
      state.vehicle = action.payload
    },
    setConnectorStep: (state, action) => {
      state.connectorStep = action.payload
    },
    changeConnectedVehicleName: (state, action) => {
      state.vehicle!.name = action.payload
    }
  }

});

export const { setConnectedVehicle, setConnectorStep, changeConnectedVehicleName } = connectedVehicleSlice.actions;

export default connectedVehicleSlice.reducer;
