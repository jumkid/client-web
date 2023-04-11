import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import * as _ from 'lodash';

interface Prop {
  title: string
  action?: string
  message?: string
  isShown: boolean
  confirmCallback: () => void
  cancelCallback: () => void
}

function ConfirmDialog ({title, action, message, isShown, confirmCallback, cancelCallback}:Prop) {
  return (
    <Dialog
      open={isShown}
      aria-labelledby="responsive-dialog-title"
      fullWidth={true}
    >
      <DialogTitle id="responsive-dialog-title">
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          { _.isEmpty(message) ? `Are you sure to perform ${action} action?`: message }
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={cancelCallback}>
          Cancel
        </Button>
        <Button onClick={confirmCallback} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;
