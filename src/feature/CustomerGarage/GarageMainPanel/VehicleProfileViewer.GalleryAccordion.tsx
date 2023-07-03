import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GalleryPanel from './GalleryPanel';

interface Props {
  mode: 'simple' | 'active'
  mediaGalleryId?: string | null
}

function GalleryAccordion ({mode, mediaGalleryId}:Props) {

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Gallery</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <GalleryPanel mode={mode} mediaGalleryId={mediaGalleryId}/>
      </AccordionDetails>
    </Accordion>
  )
}

export default GalleryAccordion;
