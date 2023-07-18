import React from 'react';
import VehicleListViewer from './VehicleListViewer';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe(VehicleListViewer, () => {
  it('should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <VehicleListViewer />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})