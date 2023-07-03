import React from 'react';
import ActivityAttachmentsPanel from './ActivityAttachmentsPanel';
import { store } from '../../../../store';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

describe(ActivityAttachmentsPanel, () => {
  it('Should render correctly', () => {
    render(
      <Provider store={store}>
        <ActivityAttachmentsPanel/>
      </Provider>
    );
    expect(screen.findByLabelText(/activity attachments/i)).toBeDefined();
  });
});