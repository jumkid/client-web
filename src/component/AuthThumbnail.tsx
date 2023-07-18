import React, { useEffect, useState } from 'react';
import { CircularProgress, Paper, SxProps } from '@mui/material';
import { preloadContentThumbnail } from '../App.utils';
import * as _ from 'lodash';

interface Props {
  contentId:string | undefined,
  idx:number,
  sx?: SxProps
}

function AuthThumbnail ({contentId, idx, sx}:Props) {
  const [preLoadImage, setPreLoadImage] = useState('');

  useEffect(() => {
    try {
      preloadContentThumbnail(contentId, 'small').then((imageBase64) => {
        setPreLoadImage(imageBase64);
      });
    } catch (error) {
      console.error(error);
    }
  }, [contentId]);

  return (
    <Paper
      key={idx}
      sx={{
        ...sx,
        float: 'left',
        background: `url('${preLoadImage}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        cursor: 'pointer',
      }}
    >
      {_.isEmpty(preLoadImage) && <CircularProgress/>}
    </Paper>
  )
}

export default AuthThumbnail;
