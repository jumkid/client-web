import React, { useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { changeConnectedVehicleName } from '../../../../store/connectedVehicleSlice';
import { saveNewVehicle } from '../../../../store/userVehiclesSlice';
import { Avatar, Box, Fade, Grid, Stack, TextField } from '@mui/material';
import { Item, ItemHeader, ItemText } from '../../../../layout/Layout.Theme';
import * as C from '../../../../App.constants';
import { RootState } from '../../../../store';
import * as _ from 'lodash';
import { VehicleConnectorContext } from '../VehicleConnectorContext';

function AddToGarageStepUserView () {
  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const status = useAppSelector((state:RootState) => state.userVehicles.status);

  const {setConnectorStep} = useContext(VehicleConnectorContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changeConnectedVehicleName(''));
  }, []);

  const handleAdd = async (): Promise<void> => {
    if (status === C.LOADING) { return; }

    try {
      await dispatch(saveNewVehicle({...connectedVehicle!, id: null}));
      setConnectorStep(0);
    } catch (error) {
      console.error(error)
    }
  };

  const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeConnectedVehicleName(event.target.value));
  }

  const handleEnterKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isValid) {
      await handleAdd();
    }
  };

  const isValid = !_.isNil(connectedVehicle) && !_.isNil(connectedVehicle.name) && connectedVehicle.name.length > 1;

  return (
    <Stack className="main-container">
      <Fade in={true} mountOnEnter unmountOnExit>
        <Grid container columns={16}>
          <Grid item xs={12}>
            <ItemHeader sx={{ mb:3 }}>
              <Avatar
                variant="rounded"
                src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${connectedVehicle!.make}.png`}
                sx={{ float: "left", mr: 2, width: 72, height: 80 }}
              />
              <TextField
                sx={{ width:380 }}
                label="Vehicle Name"
                variant="standard"
                autoFocus={true}
                required
                value={connectedVehicle!.name}
                onChange={handleNameChange}
                onKeyPress={handleEnterKeyPress}
                placeholder={`say, ${connectedVehicle!.model} ${connectedVehicle!.trimLevel}`}
                error={!isValid}
                helperText="please name this vehicle in your garage"
                inputProps={{ style: {fontSize: 22} }}
              />
            </ItemHeader>
          </Grid>
          <Grid item>
            <Item>
              <Item>Make <ItemText>{connectedVehicle!.make}</ItemText></Item>
              <Item>Model <ItemText>{connectedVehicle!.model}</ItemText></Item>
              <Item>Trim Level <ItemText>{connectedVehicle!.trimLevel}</ItemText></Item>
              <Item>Model Year <ItemText>{connectedVehicle!.modelYear}</ItemText></Item>
            </Item>
          </Grid>
          <Grid width="90%" height="380px">
            <Stack alignItems="center" height="100%">
              <Box
                sx={{
                  width: '60%',
                  height: '100%',
                  background: `url(${C.CONTENT_STREAM_API}/${connectedVehicle!.mediaGalleryId})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center'
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Fade>
    </Stack>
  )
}

export default AddToGarageStepUserView;