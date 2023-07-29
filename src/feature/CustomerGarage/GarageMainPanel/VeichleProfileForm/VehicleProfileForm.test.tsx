import React from 'react';
import VehicleProfileForm from './VehicleProfileForm';
import authenticationManager from '../../../../security/Auth/AuthenticationManager';
import { getTestJwtToken, testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import { act, render, screen } from '@testing-library/react';

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

      render(
        <Provider store={store}>
          <VehicleProfileForm/>
        </Provider>
      );
      expect(screen).toMatchSnapshot();
    });
  });
});
