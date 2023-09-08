import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { changeConnectedVehicleName, setConnectedVehicle } from '../../../../store/connectedVehicleSlice';
import { saveNewVehicle } from '../../../../store/userVehiclesSlice';
import { Avatar, Box, IconButton, Stack, TextField } from '@mui/material';
import { Item, ItemHeader, ItemText } from '../../../../layout/Layout.Theme';
import * as C from '../../../../App.constants';
import { RootState } from '../../../../store';
import * as _ from 'lodash';
import { VehicleConnectorContext } from '../VehicleConnectorContext';
import { preloadContentThumbnail } from '../../../../App.utils';
import { Lock, LockOpen } from '@mui/icons-material';

function AddToGarageStepUserView () {
  const [preLoadImage, setPreLoadImage] = useState('');

  const connectedVehicle = useAppSelector((state:RootState) => state.connectedVehicle.vehicle);
  const status = useAppSelector((state:RootState) => state.userVehicles.status);

  const {setConnectorStep} = useContext(VehicleConnectorContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changeConnectedVehicleName(''));

    try {
      if (!_.isNil(connectedVehicle)) {
        preloadContentThumbnail(connectedVehicle.mediaGalleryId!, 'large').then((imageBase64) => {
          setPreLoadImage(imageBase64);
        });
      }
    } catch (error) {
      console.error(error);
    }

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

  const toggleAccessScope = () => {
    const accessScope = connectedVehicle!.accessScope === C.PRIVATE ? C.PUBLIC : C.PRIVATE;
    dispatch(setConnectedVehicle({...connectedVehicle, accessScope}));
  }

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
      <ItemHeader>
        <Avatar
          className="brand-avatar"
          variant="rounded"
          src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${connectedVehicle!.make}.png`}
        />
        <TextField
          className="name-text"
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
          inputProps={{ style: {fontSize: 'x-large'} }}
        />
        <IconButton
          className="access-scope-btn"
          component="label"
          aria-label="access scope"
          onClick={toggleAccessScope}
        >
          { connectedVehicle!.accessScope === C.PRIVATE ? <Lock fontSize="large"/> : <LockOpen fontSize="large"/> }
        </IconButton>
      </ItemHeader>

      <Item>
        <Item>Make <ItemText>{connectedVehicle!.make}</ItemText></Item>
        <Item>Model <ItemText>{connectedVehicle!.model}</ItemText></Item>
        <Item>Trim Level <ItemText>{connectedVehicle!.trimLevel}</ItemText></Item>
        <Item>Model Year <ItemText>{connectedVehicle!.modelYear}</ItemText></Item>
      </Item>

      <Stack alignItems="center" height="380px">
        <Box
          my={2}
          sx={{
            width: '60%',
            height: '100%',
            background: `url('${preLoadImage}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
        />
      </Stack>
    </Stack>
  )
}

export default AddToGarageStepUserView;