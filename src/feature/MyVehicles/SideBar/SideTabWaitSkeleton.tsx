import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Theme } from '@emotion/react';
import styled from '@emotion/styled';

type Props = {
  isShown: boolean
}

type ItemProps = {
  theme: Theme
}

const S_Skeleton = styled(Skeleton)(({ theme }:ItemProps) => ({
  ...theme,
  mt: 1,
  float: 'right',
  width: '90%',
  height: 30,
  variant: 'rectangular'
}));

function SideTabWaitSkeleton ({isShown}:Props) {
  return (
    <>
      { isShown &&
      <Box width='100%'>
        <S_Skeleton/>
        <S_Skeleton/>
        <S_Skeleton/>
      </Box>
      }
    </>
  )
}

export default SideTabWaitSkeleton;
