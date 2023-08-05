import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ActivitiesPanel from '../ActivityPanel';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import * as C from '../../../../App.constants';

interface Props {
  mode: DISPLAY_MODE
  vehicleId: string
}

function ActivityAccordion ({mode, vehicleId}:Props) {

  return (
    <Accordion defaultExpanded={mode === C.MODE_ACTIVE}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Activity</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ActivitiesPanel vehicleId={vehicleId}/>
      </AccordionDetails>
    </Accordion>
  )
}

export default ActivityAccordion;
