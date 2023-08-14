import React, { useLayoutEffect } from 'react';
import VehicleProfileForm from '../../../MyVehicles/MainPanels/VeichleProfileForm/VehicleProfileForm';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { setCurrentVehicle } from '../../../../store/userVehiclesSlice';
import { RootState } from '../../../../store';
import * as _ from 'lodash';
import { blankVehicleProfile } from '../../../../store/model/VehicleProfile';

function AddToGarageStepAdminView () {
  const currentVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);
  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(setCurrentVehicle(connectedVehicle));
    // clean up
    return () => {
      dispatch(setCurrentVehicle(blankVehicleProfile));
    }
  }, []);

  return (
    <>
      { !_.isNil(currentVehicle.id) && <VehicleProfileForm /> }
    </>
  )
}

export default AddToGarageStepAdminView;