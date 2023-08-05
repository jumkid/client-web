import React from 'react';
import VehicleConnector from './VehicleConnector';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { render, screen } from '@testing-library/react';

describe(VehicleConnector, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <VehicleConnector/>
      </Provider>
    );
    expect(screen).toMatchSnapshot();
  });
});
