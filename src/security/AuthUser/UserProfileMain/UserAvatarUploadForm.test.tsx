import React from 'react';
import UserAvatarUploadForm from './UserAvatarUploadForm';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { render, screen } from '@testing-library/react';

describe(UserAvatarUploadForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <UserAvatarUploadForm/>
      </Provider>
    );
    expect(screen.getByText(/Click to choose new picture/i)).toBeDefined();
  });
});