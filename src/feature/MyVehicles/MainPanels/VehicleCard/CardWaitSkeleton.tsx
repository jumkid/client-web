import React from 'react';
import { Skeleton, Box } from '@mui/material';
import { useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import * as _ from 'lodash';
import './index.css';

type Props = {
  isShown: boolean
}

function CardWaitSkeleton ({isShown}:Props) {
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const count = matchVehicles.length < 1 ? 1 : matchVehicles.length;

  return (
    <>
      { isShown &&
        <Box>
          {_.times(count, (i) => (
            <Skeleton key={i} variant="rectangular" width="366px" height="240px"/>
          ))}
        </Box>
      }
    </>
  )
}

export default CardWaitSkeleton;
