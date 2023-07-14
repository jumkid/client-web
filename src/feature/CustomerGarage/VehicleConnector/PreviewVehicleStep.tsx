import React, { useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { RootState } from '../../../store';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { setConnectorStep } from '../../../store/connectedVehicleSlice';
import { setCurrentVehicle } from '../../../store/userVehiclesSlice';
import * as C from '../../../App.constants';
import VehicleProfileSummary from '../GarageMainPanel/VehicleProfileViewer.Summary';
import GalleryAccordion from '../GarageMainPanel/VehicleProfileViewer.GalleryAccordion';
import PricingViewerAccordion from '../GarageMainPanel/VehicleProfileViewer.PricingAccordion';
import DetailsAccordion from '../GarageMainPanel/VehicleProfileViewer.DetailsAccordion';

interface Prop {
  connectedVehicle: VehicleProfile
}

function PreviewVehicleStep ({connectedVehicle}:Prop) {
  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentVehicle(null));
  }, [connectedVehicle]);

  const handleBackward = (): void => {
    dispatch(setConnectorStep(currentStep - 1));
  };

  const handleForward = (): void => {
    dispatch(setConnectorStep(currentStep + 1));
  };

  return (
    <>
      <Box mx={3} pt={1}>
        <Button sx={{ fontSize: 'large', mr: 1 }} variant="outlined" onClick={handleBackward}>
          <ArrowBackIos/>Back
        </Button>
        <Button sx={{ fontSize: 'large' }} variant="outlined" onClick={handleForward}>
          Next<ArrowForwardIos/>
        </Button>
      </Box>
      <Stack className="dashboard-viewer-box">

        <VehicleProfileSummary showName={false} vehicleProfile={connectedVehicle}/>

        <GalleryAccordion mode={C.MODE_SIMPLE} mediaGalleryId={connectedVehicle.mediaGalleryId}/>

        <PricingViewerAccordion mode={C.MODE_ACTIVE} vehicleProfile={connectedVehicle} />

        <DetailsAccordion mode={C.MODE_ACTIVE} vehicleProfile={connectedVehicle}/>

      </Stack>
    </>
  )
}

export default PreviewVehicleStep;