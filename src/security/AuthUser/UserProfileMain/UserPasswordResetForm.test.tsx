import React from 'react';
import UserPasswordResetForm from './UserPasswordResetForm';
import { render, screen } from '@testing-library/react';
import { store } from '../../../store';
import { Provider } from 'react-redux';

describe(UserPasswordResetForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <UserPasswordResetForm/>
      </Provider>
    )
    expect(screen.getByText(/Password Reset/i)).toBeDefined();
  });
});