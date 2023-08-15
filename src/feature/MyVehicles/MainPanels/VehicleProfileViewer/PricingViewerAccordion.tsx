import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as _ from 'lodash';
import { Item, ItemText } from '../../../../layout/Layout.Theme';
import { VehicleProfile } from '../../../../store/model/VehicleProfile';
import { currencyFormatter } from '../../../../App.utils';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import * as C from '../../../../App.constants';

type Props = {
  mode: DISPLAY_MODE
  vehicleProfile: VehicleProfile
}

function PricingViewerAccordion ({mode, vehicleProfile}:Props) {
  const vehiclePricing = vehicleProfile!.vehiclePricing;

  return(
    <Accordion defaultExpanded={mode === C.MODE_ACTIVE}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Prices</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack>
          <Item>MSRP <ItemText>{_.isNil(vehiclePricing) ? '--' : currencyFormatter(vehiclePricing!.msrp)}</ItemText></Item>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default PricingViewerAccordion;