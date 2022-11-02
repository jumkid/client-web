import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid,
  LinearProgress,
  Slide,
  Stack,
  TextField
} from '@mui/material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import * as C from '../../../App.constants';
import { Item, ItemHeader, ItemText } from '../../../layout/Layout.Theme';
import { Add, ArrowBackIos } from '@mui/icons-material';
import { RootState } from '../../../store';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { setConnectorStep } from '../../../store/connectedVehicleSlice';
import { fetchUserVehicles, saveNewVehicle } from '../../../store/userVehiclesSlice';

interface Prop {
  connectedVehicle: VehicleProfile
}

function AddToGarageStep ({connectedVehicle}:Prop) {
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const dispatch = useAppDispatch();

  const handleBackward = () => {
    dispatch(setConnectorStep(currentStep - 1));
  };

  const handleAdd = () => {
    if (isSubmitted) return;
    else setIsSubmitted(true);

    const newVehicle = { ...connectedVehicle, name };
    dispatch(saveNewVehicle(newVehicle)).then(
      (success) => {
        const pagingSearch = { keyword: '*', page: 1, size: C.DEFAULT_PAGE_SIZE }
        dispatch(fetchUserVehicles(pagingSearch)).then(
          () => {
            setIsSubmitted(false);
          }
        )
      }
    );
  };

  const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const isValid = name.length > 0;

  return (
    <>
      { isSubmitted && <CircularProgress size="1.5rem" sx={{ position: "absolute", mt: 3, ml: 20 }}/> }
      <Box mx={3} py={2}>
        <Button sx={{ fontSize: 'large', mr: 1 }} variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>Back
        </Button>
        <Button sx={{ fontSize: 'large' }} variant="outlined" onClick={handleAdd} disabled={!isValid}>
          <Add/>Add
        </Button>
      </Box>
      <Stack className="dashboard-viewer-box">
        <Fade in={true} mountOnEnter unmountOnExit>
          <Grid container spacing={2} columns={16}>
            <Grid item xs={12}>
              <ItemHeader sx={{ mb: 3 }}>
                <Avatar
                  variant="rounded"
                  src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${connectedVehicle.make}.png`}
                  sx={{ float: "left", mr: 2, width: 72, height: 80 }}
                />
                <TextField
                  sx={{ width: 380 }}
                  label="Vehicle Name"
                  variant="standard"
                  autoFocus={true}
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder={`say, ${connectedVehicle.model} ${connectedVehicle.trimLevel}`}
                  error={!isValid}
                  helperText="please name this vehicle in your garage"
                  inputProps={{ style: {fontSize: 22} }}
                />
              </ItemHeader>
              <Item>
                <Item>Make <ItemText>{connectedVehicle.make}</ItemText></Item>
                <Item>Model <ItemText>{connectedVehicle.model}</ItemText></Item>
              </Item>
              <Item>
                <Item>Trim Level <ItemText>{connectedVehicle.trimLevel}</ItemText></Item>
                <Item>Model Year <ItemText>{connectedVehicle.modelYear}</ItemText></Item>
              </Item>
            </Grid>
          </Grid>
        </Fade>
      </Stack>
    </>
  )
}

export default AddToGarageStep;
