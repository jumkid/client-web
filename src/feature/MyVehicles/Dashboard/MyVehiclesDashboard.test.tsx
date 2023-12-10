import React from 'react';
import MyVehiclesDashboard from './MyVehiclesDashboard';
import { store } from '../../../store';
import { Provider } from 'react-redux';
import authenticationManager from '../../../security/Auth/AuthenticationManager';
import { getTestJwtToken } from '../../../App.test';
import { render } from '@testing-library/react';

describe(MyVehiclesDashboard, () => {
  it('Should render correctly', () => {
    authenticationManager.updateToken(getTestJwtToken());

    render(
        <Provider store={store}>
          <MyVehiclesDashboard/>
        </Provider>
      );
    expect(screen).toMatchSnapshot();
  });
});