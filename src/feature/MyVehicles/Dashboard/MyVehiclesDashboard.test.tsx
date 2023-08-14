import React from 'react';
import MyVehiclesDashboard from './MyVehiclesDashboard';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { store } from '../../../store';
import { Provider } from 'react-redux';
import authenticationManager from '../../../security/Auth/AuthenticationManager';
import { getTestJwtToken } from '../../../App.test';

describe(MyVehiclesDashboard, () => {
  it('Should render correctly', async () => {
    authenticationManager.updateToken(getTestJwtToken());

    await act(async () => {
      const tree = ReactTestRenderer
        .create(
          <Provider store={store}>
            <MyVehiclesDashboard/>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});