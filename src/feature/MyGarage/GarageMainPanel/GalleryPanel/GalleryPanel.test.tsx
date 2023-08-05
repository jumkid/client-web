import React from 'react';
import GalleryPanel from './GalleryPanel';
import ReactTestRenderer from 'react-test-renderer';
import * as C from '../../../../App.constants';
import { Provider } from 'react-redux';
import { testVehicleProfile } from '../../../../App.test';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

//Configuring a mockStore
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe(GalleryPanel, () => {
  const store = mockStore({
    userVehicles: {
      currentVehicle: testVehicleProfile
    }
  });

  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <GalleryPanel mode={C.MODE_ACTIVE}/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});