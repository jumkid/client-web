import React from 'react';
import VehicleProfileViewer from './VehicleProfileViewer';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { testVehicleProfile } from '../../../App.test';

describe(VehicleProfileViewer, () => {
  it('Should render correctly', async () => {
    await act(async () => {
      const tree = ReactTestRenderer
        .create(
          <VehicleProfileViewer showName={false} vehicleProfile={testVehicleProfile}/>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
})