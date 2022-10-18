import { configureStore } from '@reduxjs/toolkit';
import vehiclePickerReducer from './vehiclePickerSlice';
import userVehiclesReducer from './userVehiclesSlice';

export default configureStore({
  reducer: {
    vehiclePicker: vehiclePickerReducer,
    userVehicles: userVehiclesReducer
  }
});
