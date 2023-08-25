import React from 'react';
import { Alert, Box, IconButton, Link, Slide, Snackbar } from '@mui/material';
import './WarningSignText.css';
import { Close } from '@mui/icons-material';
import { useAppDispatch } from '../App.hooks';
import { setUserCenterWarning } from '../store/userNotificationsSlice';

type Props = {
  open: boolean
  closeCallBack?: () => void
  message: string
  actionButton?: string | null
  actionButtonCallBack?: () => void
}

function CenterWarningBar ({open, message, closeCallBack, actionButton, actionButtonCallBack}:Props) {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setUserCenterWarning(false));
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={closeCallBack}
      action={
        <Alert severity="warning" onClose={handleClose} action={
          <Box>
            { actionButton &&
            <><Link fontSize="small" color="secondary" onClick={actionButtonCallBack}>{actionButton}</Link>&nbsp;</>
            }
            <IconButton onClick={handleClose}>
              <Close fontSize="small"/>
            </IconButton>
          </Box>
        }>
          {message}
        </Alert>
      }
    />
  )
}

export default CenterWarningBar;