import React from 'react';
import AddToGarageStep from './AddToGarageStep';
import { getTestJwtToken, testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import authenticationManager from '../../../../security/Auth/AuthenticationManager';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

//Configuring a mockStore
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe(AddToGarageStep, () => {
  const store = mockStore({
    connectedVehicle: {
      vehicle: testVehicleProfile,
      connectorStep: 2
    },
    userVehicles: {
      currentVehicle: testVehicleProfile
    }
  });

  it('Should render correctly', () => {
    authenticationManager.updateToken(getTestJwtToken());

    render(
      <Provider store={store}>
        <AddToGarageStep />
      </Provider>
    );
    expect(screen.getByText(/Add/i)).toBeDefined();
  });
});