import React from 'react';
import { Avatar, Grid, IconButton } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import * as C from '../../../../App.constants';
import VehicleNameTools from './VehicleProfileViewer.VehicleNameTools';
import { Item, ItemHeader, ItemText } from '../../../../layout/Layout.Theme';
import * as _ from 'lodash';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import { useAppDispatch } from '../../../../App.hooks';
import { changeAccessScope, syncCurrentVehicleToList, updateVehicle } from '../../../../store/userVehiclesSlice';

type Props = {
  mode: DISPLAY_MODE
  showName?: boolean
  vehicleProfile: VehicleProfile
}

function VehicleProfileSummary ({ mode, showName, vehicleProfile}:Props) {
  const showEditableName = _.isUndefined(showName) ? true : showName;
  const dispatch = useAppDispatch();

  const toggleAccessScope = ():void => {
    const accessScope = (vehicleProfile.accessScope === C.PRIVATE) ? C.PUBLIC : C.PRIVATE;
    dispatch(changeAccessScope(accessScope));
    dispatch(updateVehicle({id:vehicleProfile.id!, vehicle: {accessScope, modificationDate: vehicleProfile.modificationDate}})).then(
      (response) => {
        // update vehicleProfile locally
        dispatch(syncCurrentVehicleToList());
      }
    );
  }

  return (
    <>
      <Grid container spacing={1} columns={16}>
        <Grid item xs={12}>
          <ItemHeader>
            <Avatar
              variant="rounded"
              src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicleProfile.make}.png`}
              sx={{ float: "left", mb: 1, mr: 2, width: 58, height: 64 }}
            />
            { showEditableName &&
              <VehicleNameTools vehicleName={vehicleProfile.name!} vehicleId={vehicleProfile.id!} />
            }
          </ItemHeader>
        </Grid>
        <Grid item xs={4}>
          <IconButton
            sx={{ float: 'right', mt: 3.5 }}
            component="label"
            disabled={mode === C.MODE_SIMPLE}
            aria-label="access scope"
            onClick={toggleAccessScope}
          >
            { vehicleProfile.accessScope === C.PRIVATE ? <Lock fontSize="large"/> : <LockOpen fontSize="large"/> }
          </IconButton>
        </Grid>
      </Grid>
      <Item>
        <Item>Make <ItemText>{ vehicleProfile.make }</ItemText></Item>
        <Item>Model <ItemText>{ vehicleProfile.model }</ItemText></Item>
        <Item>Trim Level <ItemText>{ vehicleProfile.trimLevel }</ItemText></Item>
        <Item>Model Year <ItemText>{ vehicleProfile.modelYear }</ItemText></Item>
      </Item>
    </>
  );
}

export default VehicleProfileSummary;
