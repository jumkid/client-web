import React, { useContext } from 'react';
import { Save } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import * as C from '../../../../App.constants';
import * as _ from 'lodash';
import { ErrorsContext } from '../VehicleProfileContext';
import { saveNewVehicle } from '../../../../store/userVehiclesSlice';

function AddButton () {
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const status = useAppSelector((state:RootState) => state.userVehicles.currentVehicleStatus);
  const dispatch = useAppDispatch();

  const {errors, setErrors} = useContext(ErrorsContext);

  const handleAdd = async (): Promise<void> => {
    if (status === C.LOADING || _.isNil(currentVehicle)) { return; }

    dispatch(saveNewVehicle(currentVehicle)).then(() => {
      setErrors({hasUpdate:false});
    });
  }

  const isFormValid = (Object.values(errors).length === 1 && errors.hasUpdate);

  return (
    <>
      <Button
        sx={{ ml:1.5, width:100, fontSize:'large' }}
        onClick={handleAdd}
        color="primary"
        variant="outlined"
        disabled={!isFormValid}
        startIcon={<Save/>}
      >
        add
      </Button>
      { status === C.LOADING &&
        <CircularProgress
          size={30}
          sx={{
            position: 'absolute',
            top: 191,
            left: 365
          }}
        />
      }
    </>
  )
}

export default AddButton;