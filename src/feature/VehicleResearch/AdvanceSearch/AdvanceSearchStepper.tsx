import React from 'react';
import { Step, StepLabel, Stepper, Typography } from '@mui/material';

type Props = {
  currentStep: number
  steps: string[]
}

function AdvanceSearchStepper ({currentStep, steps}:Props) {
  return (
    <Stepper activeStep={currentStep} >
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>
            <Typography color="alpha" variant="body1">{label}</Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default AdvanceSearchStepper;