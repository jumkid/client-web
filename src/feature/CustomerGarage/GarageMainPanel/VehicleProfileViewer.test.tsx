import React from 'react';
import VehicleProfileViewer from './VehicleProfileViewer';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { testVehicleProfile } from '../../../App.test';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import * as C from '../../../App.constants';

//Configuring a mockStore
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe(VehicleProfileViewer, () => {
  const store = mockStore({
    vehicleActivities: {
      currentActivity: {}
    },
    userVehicles: {
      currentVehicle: testVehicleProfile
    }
  });

  it('Should render correctly', async () => {
    await act(async () => {
      const tree = ReactTestRenderer
        .create(
          <Provider store={store}>
            <VehicleProfileViewer showName={false} vehicleProfile={testVehicleProfile} mode={C.MODE_ACTIVE} />
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
})