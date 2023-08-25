import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import VehicleSearchTable from './VehicleSearchTable';
import { testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe(VehicleSearchTable, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <VehicleSearchTable keyword='porsche' vehicles={[testVehicleProfile]}/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
