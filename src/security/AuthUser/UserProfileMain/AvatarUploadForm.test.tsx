import React from 'react';
import AvatarUploadForm from './AvatarUploadForm';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { render, screen } from '@testing-library/react';

describe(AvatarUploadForm, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <AvatarUploadForm/>
      </Provider>
    );
    expect(screen.getByText(/Click to choose new picture/i)).toBeDefined();
  });
});