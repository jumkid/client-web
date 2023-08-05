import React from 'react';
import { Stack } from '@mui/material';
import * as C from '../../../../App.constants';
import GalleryAccordion from './VehicleProfileForm.GalleryAccordion';
import DetailsAccordion from './VehicleProfileForm.DetailsAccordion';
import PricingAccordion from './VehicleProfileForm.PricingAccordion';
import VehicleProfileSummaryForm from './VehicleProfileForm.Summary';

function VehicleProfileForm () {
  return (
    <Stack className="dashboard-viewer-box">

      <VehicleProfileSummaryForm/>

      <GalleryAccordion mode={C.MODE_ACTIVE}/>

      <PricingAccordion mode={C.MODE_ACTIVE} />

      <DetailsAccordion mode={C.MODE_ACTIVE}/>

    </Stack>
  );
}

export default VehicleProfileForm;
