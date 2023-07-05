import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as _ from 'lodash';
import { Item, ItemText } from '../../../layout/Layout.Theme';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import { currencyFormatter } from '../../../App.utils';

type Props = {
  expanded: boolean
  vehicleProfile: VehicleProfile
}

function PricingViewerAccordion ({expanded, vehicleProfile}:Props) {
  const vehiclePricing = vehicleProfile!.vehiclePricing;

  return(
    <Accordion defaultExpanded={expanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Prices</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack className='dashboard-viewer-box'>
          <Item>MSRP <ItemText>{_.isNil(vehiclePricing) ? '--' : currencyFormatter(vehiclePricing!.msrp)}</ItemText></Item>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default PricingViewerAccordion;