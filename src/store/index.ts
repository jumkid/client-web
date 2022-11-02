import { configureStore } from '@reduxjs/toolkit';
import userVehiclesReducer from './userVehiclesSlice';
import connectedVehicleReducer from './connectedVehicleSlice';
import tokenUserReducer from './tokenUserSlice';

export const store = configureStore({
  reducer: {
    userVehicles: userVehiclesReducer,
    connectedVehicle: connectedVehicleReducer,
    tokenUser: tokenUserReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
