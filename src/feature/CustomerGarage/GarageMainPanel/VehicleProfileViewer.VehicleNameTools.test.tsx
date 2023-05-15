import React from 'react';
import VehicleNameTools from './VehicleProfileViewer.VehicleNameTools';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe(VehicleNameTools, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <VehicleNameTools vehicleName='test vehicle name' vehicleId='abed-1234'/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});