import React, { useContext, useEffect, useReducer } from 'react';
import { Box, Button, CircularProgress, IconButton, TextField } from '@mui/material';
import { Add, Delete, ModeEdit, Save } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import {
  changePick,
  deleteVehicle, removeVehicleFromList,
  saveNewVehicle,
  syncCurrentVehicleToList,
  updateUserVehicleName,
  updateVehicle
} from '../../../../store/userVehiclesSlice';
import { RootState } from '../../../../store';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import { ErrorsContext } from '../VehicleProfileContext';
import * as _ from 'lodash';
import * as C from '../../../../App.constants';
import { setConnectorStep } from '../../../../store/connectedVehicleSlice';
import UserProfile from '../../../../security/AuthUser/UserProfile';

type ComponentState = {
  name: string
  editable: boolean
  isDialogOpen: boolean
}

type Action =
  | { type: 'setName', payload: string }
  | { type: 'setEditable', payload: boolean }
  | { type: 'setIsDialogOpen', payload: boolean }

const reducer = (state:ComponentState, action: Action):ComponentState => {
  switch (action.type) {
  case 'setName':
    return {...state, name: action.payload};
  case 'setEditable':
    return {...state, editable: action.payload};
  case 'setIsDialogOpen':
    return {...state, isDialogOpen: action.payload};
  default:
    return state;
  }
}

type Prop = {
  vehicleName: string
  vehicleId: string | null
}

function VehicleNameTools ({ vehicleName, vehicleId }:Prop) {
  const [state, dispatch] = useReducer(reducer,
    {name: vehicleName, editable: false, isDialogOpen: false});
  const {errors, setErrors} = useContext(ErrorsContext);
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const currentPick = useAppSelector((state:RootState) => state.userVehicles.currentPick);
  const status = useAppSelector((state:RootState) => state.userVehicles.currentVehicleStatus);

  const appDispatch = useAppDispatch();

  useEffect(() => {
    dispatch({type: 'setEditable', payload: false});
    dispatch({type: 'setName', payload: vehicleName});
  }, [vehicleId])

  const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch({type: 'setName', payload: event.target.value});
  }

  const toggleNameEditable = () => {
    dispatch({type: 'setEditable', payload: !state.editable});
  }

  const handleCancel = ():void => {
    dispatch({type: 'setName', payload: vehicleName});
    dispatch({type: 'setEditable', payload: false});
  }

  const handleSaveName = ():void => {
    if (status === C.LOADING || _.isNull(vehicleId) || _.isNull(currentVehicle)) return;

    appDispatch(updateUserVehicleName({ id:vehicleId, vehicle:{name: state.name, accessScope:null, modificationDate:currentVehicle.modificationDate!} }))
      .then(() => {
        dispatch({type: 'setEditable', payload: false});
      });
  }

  const handleSave = ():void => {
    if (status === C.LOADING || _.isNull(vehicleId) || _.isNull(currentVehicle)) {
      return;
    }

    appDispatch(updateVehicle({id:vehicleId, vehicle:currentVehicle}))
      .then(() => {
        appDispatch(syncCurrentVehicleToList());
        setErrors({hasUpdate:false});
      });
  }

  const handleSaveNew = ():void => {
    if (status === C.LOADING || _.isNull(vehicleId) || _.isNull(currentVehicle)) {
      return;
    }

    appDispatch(saveNewVehicle({id:null, ...currentVehicle}))
      .then(() => {
        setErrors({hasUpdate:false});
        appDispatch(changePick(0));
        appDispatch(setConnectorStep(0));
      });
  }

  const confirmDelete = ():void => {
    if (!_.isNull(vehicleId)) {
      dispatch({type: 'setIsDialogOpen', payload: true});
    }
  }

  const doConfirm = async (): Promise<void> => {
    dispatch({type: 'setIsDialogOpen', payload: false});

    if (status === C.LOADING) {
      return;
    }

    dispatch({type: 'setEditable', payload: false});
    await appDispatch(deleteVehicle(vehicleId!));
    appDispatch(removeVehicleFromList(currentPick - 2));
    appDispatch(changePick(1));
  };

  const doCancel = ():void => {
    dispatch({type: 'setIsDialogOpen', payload: false});
  };

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveName();
    }
  };

  const isFormValid = (Object.values(errors).length === 1 && errors.hasUpdate);

  return (
    <Box mb={1}>
      { state.editable &&
      <TextField
        sx={{ width: 480 }}
        variant="standard"
        autoFocus={true}
        required
        onChange={handleNameChange}
        onKeyPress={handleEnterKeyPress}
        value={state.name}
        placeholder="a custom name for this vehicle"
        InputProps={{
          style: {fontSize: 22},
          endAdornment: (<>
            <Button onClick={handleSaveName} variant="text">save</Button>
            &#160;
            <Button onClick={handleCancel} variant="text">cancel</Button>
          </>)
        }}
      />}
      { !state.editable &&
      <Box>
        {state.name}
        <IconButton onClick={toggleNameEditable} color="primary">
          <ModeEdit/>
        </IconButton>
      </Box>
      }
      <Box sx={{ mt: 1 }}>
        { UserProfile.isAdmin() &&
          <Button onClick={handleSave} color="primary" variant="outlined" disabled={!isFormValid} startIcon={<Save/>}>
            save
          </Button>
        }
        { status === C.LOADING && (
          <CircularProgress
            size={30}
            sx={{
              position: 'absolute',
              top: 135,
              left: 450
            }}
          />
        )}
        &nbsp;
        <Button onClick={confirmDelete} color="primary" variant="outlined" startIcon={<Delete/>}>
          Delete
        </Button>
        &nbsp;
        { UserProfile.isAdmin() &&
        <Button onClick={handleSaveNew} color="primary" variant="outlined" disabled={!isFormValid} startIcon={<Add/>}>
          save as new
        </Button>
        }

        <ConfirmDialog
          title="Delete Vehicle"
          message="All related data will be removed. Are you sure to delete this vehicle?"
          isShown={state.isDialogOpen}
          confirmCallback={doConfirm}
          cancelCallback={doCancel}
        />
      </Box>
    </Box>)
}

export default VehicleNameTools;
