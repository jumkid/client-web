import React from 'react';
import AddToGarageStep from './AddToGarageStep';
import { testVehicleProfile } from '../../../App.test';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { render, screen } from '@testing-library/react';

describe(AddToGarageStep, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <AddToGarageStep  connectedVehicle={testVehicleProfile}/>
      </Provider>
    );
    expect(screen.getByText(/Add/i)).toBeDefined();
  });
});