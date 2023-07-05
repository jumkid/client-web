import React from 'react';
import { Avatar, Grid, IconButton, Stack } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import * as C from '../../../App.constants';
import VehicleNameTools from './VehicleProfileViewer.VehicleNameTools';
import { Item, ItemHeader, ItemText } from '../../../layout/Layout.Theme';
import * as _ from 'lodash';
import GalleryAccordion from './VehicleProfileViewer.GalleryAccordion';
import DetailsAccordion from './VehicleProfileViewer.DetailsAccordion';
import ActivityAccordion from './VehicleProfileViewer.ActivityAccordion';
import PricingViewerAccordion from './VehicleProfileViewer.PricingAccordion';

type Props = {
  showName?: boolean
  vehicleProfile: VehicleProfile
  mode: 'simple' | 'active'
}

function VehicleProfileViewer ({ showName, vehicleProfile, mode }:Props) {
  const showEditableName = _.isUndefined(showName) ? true : showName;

  return (
    <Stack className="dashboard-viewer-box">
      <Grid container spacing={1} columns={16}>
        <Grid item xs={12}>
          <ItemHeader>
            <Avatar
              variant="rounded"
              src={`${C.DOMAIN_IMAGES_AUTO_BRAND_API}/${vehicleProfile.make}.png`}
              sx={{ float: "left", mb: 1, mr: 2, width: 58, height: 64 }}
            />
            { showEditableName &&
              <VehicleNameTools
                vehicleName={vehicleProfile.name!}
                vehicleId={vehicleProfile.id!}
              />
            }
          </ItemHeader>
        </Grid>
        <Grid item xs={4}>
          <IconButton sx={{ float: 'right', mt: 3.5 }} aria-label="access scope" component="label" disabled={true}>
            { vehicleProfile.accessScope === C.PRIVATE && <Lock fontSize="large"/> }
            { vehicleProfile.accessScope === C.PUBLIC && <LockOpen fontSize="large"/> }
          </IconButton>
        </Grid>
      </Grid>
      <Item>
        <Item>Make <ItemText>{ vehicleProfile.make }</ItemText></Item>
        <Item>Model <ItemText>{ vehicleProfile.model }</ItemText></Item>
        <Item>Trim Level <ItemText>{ vehicleProfile.trimLevel }</ItemText></Item>
        <Item>Model Year <ItemText>{ vehicleProfile.modelYear }</ItemText></Item>
      </Item>

      <GalleryAccordion mode={mode} mediaGalleryId={ vehicleProfile.mediaGalleryId } />

      { mode === C.MODE_ACTIVE && vehicleProfile.id && <ActivityAccordion vehicleId={ vehicleProfile.id }/> }

      <PricingViewerAccordion expanded={true} vehicleProfile={vehicleProfile} />

      <DetailsAccordion expanded={ mode === C.MODE_SIMPLE } vehicleProfile={vehicleProfile}/>

    </Stack>
  );
}

export default VehicleProfileViewer;
