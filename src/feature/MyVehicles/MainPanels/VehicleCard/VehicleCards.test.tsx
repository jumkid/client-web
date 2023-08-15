import React from 'react';
import VehicleCards from './VehicleCards';
import { blankVehicleProfile } from '../../../../store/model/VehicleProfile';
import { render } from '@testing-library/react';

describe(VehicleCards, () => {
  it('should render correctly', () => {
    const testCallBack = () => {
      console.log("test callback")
    }

    render(
        <VehicleCards
          vehicles={[blankVehicleProfile]}
          detailsLnkCallback={testCallBack}
          copyDoneCallback={testCallBack}
        />
      );
    expect(screen).toMatchSnapshot();
  })
})