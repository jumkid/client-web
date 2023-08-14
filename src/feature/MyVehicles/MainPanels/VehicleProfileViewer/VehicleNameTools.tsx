import React, { useEffect, useReducer } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { ModeEdit } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { updateUserVehicleName } from '../../../../store/userVehiclesSlice';
import { RootState } from '../../../../store';
import * as _ from 'lodash';
import * as C from '../../../../App.constants';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';

type ComponentState = {
  name: string
  editable: boolean
}

type Action =
  | { type: 'setName', payload: string }
  | { type: 'setEditable', payload: boolean }

const reducer = (state:ComponentState, action: Action):ComponentState => {
  switch (action.type) {
  case 'setName':
    return {...state, name: action.payload};
  case 'setEditable':
    return {...state, editable: action.payload};
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
    {name: vehicleName, editable: false});
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.currentVehicle);
  const status = useAppSelector((state:RootState) => state.userVehicles.status);

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
    if (status === C.LOADING || _.isNull(vehicleId) || _.isNull(currentVehicle)) {
      return;
    }

    appDispatch(updateUserVehicleName({ id:vehicleId, vehicle:{name: state.name, accessScope:null, modificationDate:currentVehicle.modificationDate!} }))
      .then((response) => {
        dispatch({type: 'setEditable', payload: false});
        const updatedVehicle = response.payload as VehicleProfile;
      });
  }

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveName();
    }
  };

  return (
    <Box>
      { state.editable ?
        <TextField
          className="vehicle-name-input"
          variant="standard"
          autoFocus={true}
          required
          onChange={handleNameChange}
          onKeyPress={handleEnterKeyPress}
          value={state.name}
          placeholder="a custom name for this vehicle"
          InputProps={{
            style: {fontSize: 'x-large'},
            endAdornment: (<>
              <Button onClick={handleSaveName} variant="text">save</Button>
              &#160;
              <Button onClick={handleCancel} variant="text">cancel</Button>
            </>)
          }}
        />
        :
        <Box className="vehicle-name-text">
          <Typography fontSize="x-large">
            {state.name}
            <IconButton onClick={toggleNameEditable} color="primary"><ModeEdit/></IconButton>
          </Typography>
        </Box>
      }
    </Box>)
}

export default VehicleNameTools;
