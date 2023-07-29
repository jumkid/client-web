import React from 'react';
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }}  children={props.children}/>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#fff',
    fontSize: 18
  },
  [`& .${tooltipClasses.tooltip}`]: {
    color: '#000',
    backgroundColor: '#fff',
    fontSize: 16,
    borderRadius: 9
  },
}));

export default BootstrapTooltip;