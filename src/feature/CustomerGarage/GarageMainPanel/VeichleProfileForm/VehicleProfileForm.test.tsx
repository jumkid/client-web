import React from 'react';
import VehicleProfileForm from './VehicleProfileForm';
import ReactTestRenderer, { act } from 'react-test-renderer';
import authenticationManager from '../../../../security/Auth/AuthenticationManager';
import { getTestJwtToken, testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

//Configuring a mockStore
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe(VehicleProfileForm, () => {
  beforeAll(() => {
    (axios.get as jest.Mock).mockResolvedValue({data:null});
  });

  const store = mockStore({
    userVehicles: {
      currentVehicle: testVehicleProfile
    }
  });

  it('should render correctly', async () => {
    await act(async () => {
      authenticationManager.updateToken(getTestJwtToken());

      const tree = ReactTestRenderer
        .create(
          <Provider store={store}>
            <VehicleProfileForm/>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
