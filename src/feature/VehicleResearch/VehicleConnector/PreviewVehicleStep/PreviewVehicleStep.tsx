import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import { RootState } from '../../../../store';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { setConnectorStep } from '../../../../store/connectedVehicleSlice';
import * as C from '../../../../App.constants';
import ViewerSummary from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerSummary';
import ViewerGalleryAccordion from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerGalleryAccordion';
import PricingViewerAccordion from '../../../MyVehicles/MainPanels/VehicleProfileViewer/PricingViewerAccordion';
import ViewerDetailsAccordion from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerDetailsAccordion';

interface Prop {
  connectedVehicle: VehicleProfile
}

function PreviewVehicleStep ({connectedVehicle}:Prop) {
  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const dispatch = useAppDispatch();

  const handleBackward = (): void => {
    dispatch(setConnectorStep(currentStep - 1));
  };

  const handleForward = (): void => {
    dispatch(setConnectorStep(currentStep + 1));
  };

  return (
    <>
      <Box className="tool-bar-container">
        <Button variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>Back
        </Button>
        <Button variant="outlined" onClick={handleForward}>
          Next<ArrowForwardIos/>
        </Button>
      </Box>

      <Stack className="main-container">

        <ViewerSummary mode={C.MODE_SIMPLE} showName={false} vehicleProfile={connectedVehicle}/>

        <ViewerGalleryAccordion mode={C.MODE_SIMPLE} mediaGalleryId={connectedVehicle.mediaGalleryId}/>

        <PricingViewerAccordion mode={C.MODE_ACTIVE} vehicleProfile={connectedVehicle} />

        <ViewerDetailsAccordion mode={C.MODE_ACTIVE} vehicleProfile={connectedVehicle}/>

      </Stack>
    </>
  )
}

export default PreviewVehicleStep;