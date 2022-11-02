import React from 'react';
import { Stack } from '@mui/material';
import GarageSideTabs from './GarageSideTabs';

function GarageSideBar () {
  return (
    <Stack maxHeight="70%" pt="18px" m="auto" alignItems="center">
      <GarageSideTabs/>
    </Stack>
  );
}

export default GarageSideBar;
