import React from 'react'
import { Warning } from '@mui/icons-material';
import { Typography } from '@mui/material';
import './WarningSignText.css';

type Props = {
  message: string
}

function WarningSignText ({message}:Props) {
  return (
    <Typography className='warning-text'>
      <Warning sx={{verticalAlign: 'middle'}} fontSize='small'/> {message}
    </Typography>
  )
}

export default WarningSignText;