import { configureStore } from '@reduxjs/toolkit';
import userVehiclesReducer from './userVehiclesSlice';
import connectedVehicleReducer from './connectedVehicleSlice';
import searchVehiclesReducer from './searchVehiclesSlice';
import tokenUserReducer from './tokenUserSlice';
import vehicleActivitiesReducer from './vehicleActivitiesSlice';
import userNotificationsReducer from './userNotificationsSlice';

export const store = configureStore({
  reducer: {
    userNotifications: userNotificationsReducer,
    userVehicles: userVehiclesReducer,
    connectedVehicle: connectedVehicleReducer,
    searchVehicles: searchVehiclesReducer,
    tokenUser: tokenUserReducer,
    vehicleActivities: vehicleActivitiesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
