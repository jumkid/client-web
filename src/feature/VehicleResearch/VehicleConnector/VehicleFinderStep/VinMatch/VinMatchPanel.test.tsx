import React from 'react';
import VinMatchPanel from './VinMatchPanel';
import { render } from '@testing-library/react';
import { store } from '../../../../../store';
import { Provider } from 'react-redux';

describe(VinMatchPanel, () => {
  it('should render correctly', () => {
    render(
      <Provider store={store}>
        <VinMatchPanel/>
      </Provider>
    );
    expect(screen).toMatchSnapshot();
  })
});