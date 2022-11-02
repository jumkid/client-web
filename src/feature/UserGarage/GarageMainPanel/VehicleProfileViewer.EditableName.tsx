import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { Clear, Delete, ModeEdit, Save } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { deleteVehicle, updateCurrentName, updateUserVehicleName } from '../../../store/userVehiclesSlice';
import { AppDispatch, RootState } from '../../../store';
import ConfirmDialog from '../../../component/ConfirmDialog';

interface Prop {
  vehicleName: string
  vehicleId: string
}

function EditableVehicleName ({ vehicleName, vehicleId }:Prop) {
  const [name, setName] = useState(vehicleName);
  const [editable, setEditable] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentPick = useAppSelector((state:RootState) => state.userVehicles.currentPick);
  const currentVehicle = useAppSelector((state:RootState) => state.userVehicles.vehicles[currentPick - 2]);

  const dispatch = useAppDispatch();
  const nameUpdateAction = (id:string, name:string, modificationDate:string) => {
    return (dispatch:AppDispatch) => {
      dispatch(updateCurrentName(name));
      return dispatch(updateUserVehicleName({ id, vehicle:{name, accessScope:null, modificationDate} }));
    }
  }

  useEffect(() => {
    setEditable(false);
    setName(vehicleName);
  }, [vehicleId])

  const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const toggleNameEditable = () => {
    setEditable(prevState => !prevState);
  }

  const handleCancel = ():void => {
    setName(vehicleName);
    setEditable(false);
  }

  const handleSave = ():void => {
    if (isSubmitted) return;
    else setIsSubmitted(true);

    setEditable(false);
    dispatch(nameUpdateAction(vehicleId, name, currentVehicle.modificationDate!)).then(
      () => {
        setIsSubmitted(false);
      }
    )
  }

  const confirmDelete = ():void => {
    setDialogOpen(true);
  }

  const dialogConfirm = ():void => {
    setDialogOpen(false);

    if (isSubmitted) return;
    else setIsSubmitted(true);

    setEditable(false);
    dispatch(deleteVehicle(vehicleId)).then(
      () => {
        setIsSubmitted(false);

        //TODO
      }
    )
  };

  const dialogCancel = ():void => {
    setDialogOpen(false);
  };

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <>
      { editable &&
      <TextField
        sx={{ width: 480 }}
        variant="standard"
        autoFocus={true}
        required
        onChange={handleNameChange}
        onKeyPress={handleEnterKeyPress}
        value={name}
        placeholder="a custom name for this vehicle"
        InputProps={{
          style: {fontSize: 22},
          endAdornment: (<>
            <Button sx={{ mr: 2 }} onClick={handleSave} variant="text"><Save/>save</Button>
            <Button variant="text" onClick={handleCancel}><Clear/>cancel</Button>
          </>)
        }}
      />}
      { !editable &&
      <Box>
        {name}
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
          action="delete"
          isShown={dialogOpen}
          confirmCallback={dialogConfirm}
          cancelCallback={dialogCancel}
        />
      </Box>
    </>)
}

export default EditableVehicleName;
