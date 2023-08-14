import React from 'react';
import { Alert, Slide, Snackbar } from '@mui/material';
import './WarningSignText.css';

type Props = {
  open: boolean
  closeCallBack?: () => void
  message: string
}

function CenterWarningBar ({open, closeCallBack, message}:Props) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={closeCallBack}
      transitionDuration={1}
    >
      <Alert severity="warning">{message}</Alert>
    </Snackbar>
  )
}

export default CenterWarningBar;