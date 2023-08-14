import React from 'react';
import ActivityMaintDialog from './ActivityMaintDialog';
import { Provider } from 'react-redux';
import { store } from '../../../../../store';
import { render, screen } from '@testing-library/react';

describe(ActivityMaintDialog, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <ActivityMaintDialog setShowDialog={(showDialog):void => { return; }} showDialog={true} vehicleId='abed-1234'/>
      </Provider>
    );
    expect(screen.getByText(/Activity Details/i)).toBeDefined();
  });
});