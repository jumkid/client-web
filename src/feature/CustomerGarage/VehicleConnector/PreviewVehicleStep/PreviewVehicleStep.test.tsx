import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PreviewVehicleStep from './PreviewVehicleStep';
import { testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe(PreviewVehicleStep, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <PreviewVehicleStep connectedVehicle={testVehicleProfile}/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
