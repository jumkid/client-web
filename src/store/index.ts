import { configureStore } from '@reduxjs/toolkit';
import userVehiclesReducer from './userVehiclesSlice';
import connectedVehicleReducer from './connectedVehicleSlice';
import searchVehiclesReducer from './searchVehiclesSlice';
import tokenUserReducer from './tokenUserSlice';

export const store = configureStore({
  reducer: {
    userVehicles: userVehiclesReducer,
    connectedVehicle: connectedVehicleReducer,
    searchVehicles: searchVehiclesReducer,
    tokenUser: tokenUserReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
