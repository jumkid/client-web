import React from 'react';
import { Stack } from '@mui/material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import * as _ from 'lodash';
import GalleryAccordion from './VehicleProfileViewer.GalleryAccordion';
import DetailsAccordion from './VehicleProfileViewer.DetailsAccordion';
import ActivityAccordion from './VehicleProfileViewer.ActivityAccordion';
import PricingViewerAccordion from './VehicleProfileViewer.PricingAccordion';
import { DISPLAY_MODE } from '../../../service/model/CommonTypes';
import VehicleProfileSummary from './VehicleProfileViewer.Summary';

type Props = {
  showName?: boolean
  vehicleProfile: VehicleProfile
  mode: DISPLAY_MODE
}

function VehicleProfileViewer ({ showName, vehicleProfile, mode }:Props) {
  const showEditableName = _.isUndefined(showName) ? true : showName;

  return (
    <Stack className="dashboard-viewer-box">
      <VehicleProfileSummary showName={showName} vehicleProfile={vehicleProfile}/>

      <GalleryAccordion mode={mode} mediaGalleryId={vehicleProfile.mediaGalleryId}/>

      <ActivityAccordion mode={mode} vehicleId={vehicleProfile.id!}/>

      <PricingViewerAccordion mode={mode} vehicleProfile={vehicleProfile} />

      <DetailsAccordion mode={mode} vehicleProfile={vehicleProfile}/>
    </Stack>
  );
}

export default VehicleProfileViewer;
