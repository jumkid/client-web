import React, { useState } from 'react';
import { Avatar, Button, Grid, IconButton } from '@mui/material';
import { Delete, Lock, LockOpen } from '@mui/icons-material';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import * as C from '../../../../App.constants';
import VehicleNameTools from './VehicleNameTools';
import { Item, ItemHeader, ItemText } from '../../../../layout/Layout.Theme';
import * as _ from 'lodash';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import { useAppDispatch } from '../../../../App.hooks';
import {
  changeAccessScope, changePick,
  deleteVehicle,
  syncUpdatedVehicleToList,
  updateVehicle
} from '../../../../store/userVehiclesSlice';
import { APIResponse } from '../../../../service/model/Response';
import ConfirmDialog from '../../../../component/ConfirmDialog';

type Props = {
  mode: DISPLAY_MODE
  showName?: boolean
  vehicleProfile: VehicleProfile
}

function ViewerSummary ({ mode, showName, vehicleProfile}:Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const showEditableName = _.isUndefined(showName) ? true : showName;
  const dispatch = useAppDispatch();

  const toggleAccessScope = ():void => {
    const accessScope = (vehicleProfile.accessScope === C.PRIVATE) ? C.PUBLIC : C.PRIVATE;
    dispatch(changeAccessScope(accessScope));
    dispatch(updateVehicle({id:vehicleProfile.id!, vehicle: {accessScope, modificationDate: vehicleProfile.modificationDate}})).then(
      (response) => {
        const apiResponse = response.payload as APIResponse<VehicleProfile>;
        dispatch(syncUpdatedVehicleToList(apiResponse.data));
      }
    );
  }

  const handleDelete = async () => {
    const response = await dispatch(deleteVehicle(vehicleProfile.id!));

    if (response.type.endsWith('/fulfilled')) {
      dispatch(changePick(0));
    }
  }

  return (
    <>
      <Grid container spacing={1} columns={11}>
        <Grid item xs={9}>
          <Avatar
            className="brand-avatar"
            variant="rounded"
            src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicleProfile.make}.png`}
          />
          { showEditableName && <VehicleNameTools vehicleName={vehicleProfile.name!} vehicleId={vehicleProfile.id!} />}
        </Grid>
        <Grid item xs={2}>
          <Button className="vehicle-delete-btn" variant="outlined" onClick={() => setIsConfirmOpen(true)}>
            <Delete/> Delete
          </Button>
          <IconButton
            className="access-scope-btn"
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

      <ConfirmDialog
        title="Delete Vehicle"
        message="All related data will be removed. Are you sure to delete this vehicle?"
        isShown={isConfirmOpen}
        confirmCallback={ handleDelete }
        cancelCallback={ () => setIsConfirmOpen(false) }
      />
    </>
  );
}

export default ViewerSummary;
