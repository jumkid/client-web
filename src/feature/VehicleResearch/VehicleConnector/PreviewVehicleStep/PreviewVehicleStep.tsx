import React, { useContext } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import * as C from '../../../../App.constants';
import ViewerSummary from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerSummary';
import ViewerGalleryAccordion from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerGalleryAccordion';
import PricingViewerAccordion from '../../../MyVehicles/MainPanels/VehicleProfileViewer/PricingViewerAccordion';
import ViewerDetailsAccordion from '../../../MyVehicles/MainPanels/VehicleProfileViewer/ViewerDetailsAccordion';
import { VehicleConnectorContext } from '../VehicleConnectorContext';

interface Prop {
  connectedVehicle: VehicleProfile
}

function PreviewVehicleStep ({connectedVehicle}:Prop) {
  const {setConnectorStep} = useContext(VehicleConnectorContext);

  const handleBackward = (): void => {
    setConnectorStep(prevState => prevState - 1);
  };

  const handleForward = (): void => {
    setConnectorStep(prevState => prevState + 1);
  };

  return (
    <>
      <Box className="tool-bar-container">
        <Button variant="contained" onClick={handleBackward}>
          <ArrowBackIos/>Back
        </Button>
        <Button variant="contained" onClick={handleForward}>
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