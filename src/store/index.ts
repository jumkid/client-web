import { configureStore } from '@reduxjs/toolkit';
import vehiclePickerReducer from './vehiclePickerSlice';
import userVehiclesReducer from './userVehiclesSlice';
import tokenUserReducer from './tokenUserSlice';

export const store = configureStore({
  reducer: {
    vehiclePicker: vehiclePickerReducer,
    userVehicles: userVehiclesReducer,
    tokenUser: tokenUserReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
