import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GalleryPanel from './GalleryPanel';

interface Props {
  mediaGalleryId?: string | null
}

function GalleryAccordion ({mediaGalleryId}:Props) {

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Gallery</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <GalleryPanel mediaGalleryId={mediaGalleryId}/>
      </AccordionDetails>
    </Accordion>
  )
}

export default GalleryAccordion;
