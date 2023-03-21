import React, { useEffect, useReducer } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { Clear, Delete, ModeEdit, Save } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { deleteVehicle, updateUserVehicleName } from '../../../store/userVehiclesSlice';
import { RootState } from '../../../store';
import ConfirmDialog from '../../../component/ConfirmDialog';

type ComponentState = {
  name: string
  editable: boolean
  isSubmitted: boolean
  isDialogOpen: boolean
}

type Action =
  | { type: 'setName', payload: string }
  | { type: 'setEditable', payload: boolean }
  | { type: 'setIsSubmitted', payload: boolean }
  | { type: 'setIsDialogOpen', payload: boolean }

const reducer = (state:ComponentState, action: Action):ComponentState => {
  switch (action.type) {
  case 'setName':
    return {...state, name: action.payload};
  case 'setEditable':
    return {...state, editable: action.payload};
  case 'setIsSubmitted':
    return {...state, isSubmitted: action.payload};
  case 'setIsDialogOpen':
    return {...state, isDialogOpen: action.payload};
  default:
    return state;
  }
}

type Prop = {
  vehicleName: string
  vehicleId: string
}

function VehicleNameTools ({ vehicleName, vehicleId }:Prop) {
  const [state, dispatch] = useReducer(reducer,
    {name: vehicleName, editable: false, isSubmitted: false, isDialogOpen: false});

  const currentPick = useAppSelector((state:RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.vehicles[currentPick - 2]);

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

  const handleSave = ():void => {
    if (state.isSubmitted) return;
    else dispatch({type: 'setIsSubmitted', payload: true});

    appDispatch(updateUserVehicleName({ id:vehicleId, vehicle:{name: state.name, accessScope:null, modificationDate:currentVehicle.modificationDate!} }))
      .then(() => {
        dispatch({type: 'setIsSubmitted', payload: false});
        dispatch({type: 'setEditable', payload: false});
      });
  }

  const confirmDelete = ():void => {
    dispatch({type: 'setIsDialogOpen', payload: true});
  }

  const dialogConfirm = ():void => {
    dispatch({type: 'setIsDialogOpen', payload: false});

    if (state.isSubmitted) return;
    else dispatch({type: 'setIsSubmitted', payload: true});

    dispatch({type: 'setEditable', payload: false});
    appDispatch(deleteVehicle(vehicleId)).then(
      () => {
        dispatch({type: 'setIsSubmitted', payload: false});
      }
    )
  };

  const dialogCancel = ():void => {
    dispatch({type: 'setIsDialogOpen', payload: false});
  };

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <>
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
            <Button onClick={handleSave} variant="text">save</Button>
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
        <Button onClick={confirmDelete} color="primary" variant="outlined" startIcon={<Delete/>}>
          Delete
        </Button>
        <ConfirmDialog
          title="Delete Vehicle"
          message="All related data will be removed. Are you sure to delete this vehicle?"
          isShown={state.isDialogOpen}
          confirmCallback={dialogConfirm}
          cancelCallback={dialogCancel}
        />
      </Box>
    </>)
}

export default VehicleNameTools;
