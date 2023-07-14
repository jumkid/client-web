import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import FastMatchPanel from './FastMatchPanel';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe(FastMatchPanel, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <FastMatchPanel/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
