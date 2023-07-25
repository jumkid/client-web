import React from 'react';
import FastMatchPanel from './FastMatchPanel';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { render } from '@testing-library/react';

describe(FastMatchPanel, () => {
  it('Should render correctly', () => {
    render(
        <Provider store={store}>
          <FastMatchPanel/>
        </Provider>
      );
    expect(screen).toMatchSnapshot();
  });
});
