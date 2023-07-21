import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GalleryPanel from '../GalleryPanel';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import { useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import * as C from '../../../../App.constants'

type Props = {
  mode: DISPLAY_MODE
}

function GalleryAccordion ({mode}:Props) {
  const vehicleProfile = useAppSelector((state: RootState) => state.userVehicles.currentVehicle)
    || {accessScope: C.PUBLIC};

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Gallery</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <GalleryPanel mode={mode} mediaGalleryId={vehicleProfile.mediaGalleryId}/>
      </AccordionDetails>
    </Accordion>
  )
}

export default GalleryAccordion;
