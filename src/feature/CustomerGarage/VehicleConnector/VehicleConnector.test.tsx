import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import VehicleConnector from './VehicleConnector';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe(VehicleConnector, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <VehicleConnector/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
