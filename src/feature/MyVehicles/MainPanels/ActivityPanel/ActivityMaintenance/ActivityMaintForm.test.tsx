import React from 'react';
import ActivityMaintForm from './ActivityMaintForm';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

describe(ActivityMaintForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <ActivityMaintForm/>
      </Provider>);
    expect(screen.getByText(/Assignee/i)).toBeDefined();
  });
});