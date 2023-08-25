import React from 'react';
import { Stack } from '@mui/material';
import * as C from '../../../../App.constants';
import GalleryAccordion from './FormGalleryAccordion';
import DetailsFormAccordion from './DetailsFormAccordion';
import PricingFormAccordion from './PricingFormAccordion';
import SummaryForm from './SummaryForm';

function VehicleProfileForm () {
  return (
    <Stack className="main-container">
      <SummaryForm/>

      <GalleryAccordion mode={C.MODE_ACTIVE}/>

      <PricingFormAccordion mode={C.MODE_ACTIVE} />

      <DetailsFormAccordion mode={C.MODE_ACTIVE}/>
    </Stack>
  );
}

export default VehicleProfileForm;
