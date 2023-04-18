import React from 'react';
import ActivityMainDialog from './ActivityMainDialog';
import { Provider } from 'react-redux';
import { store } from '../../../../store';
import { render, screen } from '@testing-library/react';

describe(ActivityMainDialog, () => {
  it('Should render correctly', () => {
    render(
        <Provider store={store}>
          <ActivityMainDialog setShowDialog={(showDialog)=>{}} showDialog={true} vehicleId='abed-1234'/>
        </Provider>
      );
    expect(screen.getByText(/Activity Details/i)).toBeDefined();
  });
});