import React from 'react';
import { Skeleton, Box } from '@mui/material';

type Props = {
  isShown: boolean
}

function CardWaitSkeleton ({isShown}:Props) {
  return (
    <>
      { isShown &&
        <Box>
          <Skeleton variant="rectangular" width={240} height={160} sx={{ float: 'left' }}/>
          <Skeleton variant="rectangular" width={240} height={160} sx={{ float: 'left', ml: 2  }}/>
          <Skeleton variant="rectangular" width={240} height={160} sx={{ float: 'left', ml: 2 }} />
        </Box>
      }
    </>
  )
}

export default CardWaitSkeleton;
