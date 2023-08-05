import React from 'react';
import ActivityMainForm from './ActivityMainForm';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe(ActivityMainForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <ActivityMainForm/>
      </Provider>);
    expect(screen.getByText(/Assignee/i)).toBeDefined();
  });
});