import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GalleryPanel from '../GalleryPanel';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';

type Props = {
  mode: DISPLAY_MODE
}

function GalleryAccordion ({mode}:Props) {

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Gallery</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <GalleryPanel mode={mode} />
      </AccordionDetails>
    </Accordion>
  )
}

export default GalleryAccordion;
