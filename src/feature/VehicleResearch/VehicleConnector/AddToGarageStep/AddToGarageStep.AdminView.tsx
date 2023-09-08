import React, { useContext, useLayoutEffect } from 'react';
import VehicleProfileForm from '../../../MyVehicles/MainPanels/VeichleProfileForm/VehicleProfileForm';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { setCurrentVehicle } from '../../../../store/userVehiclesSlice';
import { RootState } from '../../../../store';
import { blankVehicleProfile } from '../../../../store/model/VehicleProfile';
import { ErrorsContext } from '../../../MyVehicles/MainPanels/VehicleProfileContext';
import * as _ from 'lodash';
import {
  initValidationErrors,
  ValidationErrors
} from '../../../MyVehicles/MainPanels/VeichleProfileForm/VehicleFormValidator';

function AddToGarageStepAdminView () {
  const { setErrors } = useContext(ErrorsContext);
  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const errors:ValidationErrors = {hasUpdate:false};
    if (_.isNil(connectedVehicle!.name)) { errors.name = initValidationErrors.name; }
    if (_.isNil(connectedVehicle!.make)) { errors.make = initValidationErrors.make; }
    if (_.isNil(connectedVehicle!.model)) { errors.model = initValidationErrors.model; }
    if (_.isNil(connectedVehicle!.modelYear)) { errors.modelYear = initValidationErrors.modelYear; }
    if (_.isNil(connectedVehicle!.trimLevel)) { errors.trimLevel = initValidationErrors.trimLevel; }
    setErrors(errors);

    dispatch(setCurrentVehicle(connectedVehicle));
    return () => { dispatch(setCurrentVehicle(blankVehicleProfile)); } // clean up
  }, []);

  return (
    <VehicleProfileForm />
  )
}

export default AddToGarageStepAdminView;