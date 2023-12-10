import React from 'react';
import VehicleProfileViewer from './VehicleProfileViewer';
import { getTestJwtToken, testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import * as C from '../../../../App.constants';
import { act, render } from '@testing-library/react';
import mockAxios from 'axios';
import authenticationManager from '../../../../security/Auth/AuthenticationManager';
import renderer from 'react-test-renderer';

//Configuring a mockStore
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');
mockAxios.get = jest.fn().mockResolvedValue({status: 200, data: []});

describe(VehicleProfileViewer, () => {

  beforeAll(() => {
    jest.resetAllMocks();
    authenticationManager.updateToken(getTestJwtToken());
  });

  const store = mockStore({
    vehicleActivities: {
      currentActivity: {}
    },
    userVehicles: {
      currentVehicle: testVehicleProfile
    },
    userNotifications: {
      userCenterWarning: false
    }
  });

  it('Should render correctly', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <VehicleProfileViewer showName={false} vehicleProfile={testVehicleProfile} mode={C.MODE_ACTIVE} />
      </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
})