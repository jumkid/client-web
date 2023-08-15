import React from 'react';
import VehicleNameTools from './VehicleNameTools';
import { Provider } from 'react-redux';
import { store } from '../../../../store';
import authenticationManager from '../../../../security/Auth/AuthenticationManager';
import { getTestJwtToken } from '../../../../App.test';
import { render } from '@testing-library/react';

describe(VehicleNameTools, () => {
  it('Should render correctly', () => {
    authenticationManager.updateToken(getTestJwtToken());

    render(
        <Provider store={store}>
          <VehicleNameTools vehicleName='test vehicle name' vehicleId='abed-1234'/>
        </Provider>
      );
    expect(screen).toMatchSnapshot();
  })
});