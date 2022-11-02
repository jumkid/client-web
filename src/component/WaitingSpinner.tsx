import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

interface Prop {
  isShown: true | false
}

function WaitingSpinner ({isShown}:Prop) {
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isShown}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default WaitingSpinner;
