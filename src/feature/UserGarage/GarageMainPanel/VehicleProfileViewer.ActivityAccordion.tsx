import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Button, Toolbar, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ActivitiesPanel from './ActivityPanel';

interface Props {
  vehicleId: string
}

function ActivityAccordion ({vehicleId}:Props) {

  return (
    <Accordion defaultExpanded={true}>
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
