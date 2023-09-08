import React from 'react';
import { Skeleton, Box } from '@mui/material';
import './index.css';

type Props = {
  isShown: boolean
}

function CardWaitSkeleton ({isShown}:Props) {
  return (
    <>
      { isShown &&
        <Box>
          <Skeleton variant="rectangular" width="366px" height="240px"/>
        </Box>
      }
    </>
  )
}

export default CardWaitSkeleton;
