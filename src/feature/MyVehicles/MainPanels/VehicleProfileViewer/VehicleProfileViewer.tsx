import React from 'react';
import { Stack } from '@mui/material';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import ViewerGalleryAccordion from './ViewerGalleryAccordion';
import ViewerDetailsAccordion from './ViewerDetailsAccordion';
import ViewerActivityAccordion from './ViewerActivityAccordion';
import PricingViewerAccordion from './PricingViewerAccordion';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import ViewerSummary from './ViewerSummary';
import './index.css';

type Props = {
  showName?: boolean
  vehicleProfile: VehicleProfile
  mode: DISPLAY_MODE
}

function VehicleProfileViewer ({ showName, vehicleProfile, mode }:Props) {
  return (
    <Stack className="main-container">
      <ViewerSummary mode={mode} showName={showName} vehicleProfile={vehicleProfile}/>

      <ViewerGalleryAccordion mode={mode} mediaGalleryId={vehicleProfile.mediaGalleryId}/>

      <ViewerActivityAccordion mode={mode} vehicleId={vehicleProfile.id!}/>

      <PricingViewerAccordion mode={mode} vehicleProfile={vehicleProfile} />

      <ViewerDetailsAccordion mode={mode} vehicleProfile={vehicleProfile}/>
    </Stack>
  );
}

export default VehicleProfileViewer;
