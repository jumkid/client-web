import React from 'react';
import PasswordResetForm from './PasswordResetForm';
import { render, screen } from '@testing-library/react';
import { store } from '../../../store';
import { Provider } from 'react-redux';

describe(PasswordResetForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <PasswordResetForm/>
      </Provider>
    )
    expect(screen.getByText(/Password Reset/i)).toBeDefined();
  });
});