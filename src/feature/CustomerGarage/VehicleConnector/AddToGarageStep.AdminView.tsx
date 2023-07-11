import React, { useEffect } from 'react';
import VehicleProfileForm from '../GarageMainPanel/VehicleProfileForm';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { setCurrentVehicle } from '../../../store/userVehiclesSlice';
import { RootState } from '../../../store';
import * as _ from 'lodash';

function AddToGarageStepAdminView () {
  const currentVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);
  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentVehicle(connectedVehicle));
  }, []);

  return (
    <>
      { !_.isNil(currentVehicle) && <VehicleProfileForm /> }
    </>
  )
}

export default AddToGarageStepAdminView;