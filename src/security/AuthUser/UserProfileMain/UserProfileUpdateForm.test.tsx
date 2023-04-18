import React from 'react';
import UserProfileUpdateForm from './UserProfileUpdateForm';
import { render, screen } from '@testing-library/react';
import { store } from '../../../store';
import { Provider } from 'react-redux';

describe(UserProfileUpdateForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <UserProfileUpdateForm/>
      </Provider>
    );
    expect(screen.getByText(/save/i)).toBeDefined();
  });
});