import React from 'react';
import AdvanceSearchStepper from './AdvanceSearchStepper';
import { render } from '@testing-library/react';

describe(AdvanceSearchStepper, () => {
  it('should render correctly', () => {
    render(
      <AdvanceSearchStepper currentStep={1} steps={['step 1', 'step2']}/>
    )
    expect(screen).toMatchSnapshot();
  });
});