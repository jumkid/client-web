import React from 'react';
import SimpleLayout from './SimpleLayout';
import ReactTestRenderer from 'react-test-renderer';
import { store } from '../../store';
import { Provider } from 'react-redux';

describe(SimpleLayout, () => {
  it('render simple layout component', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <SimpleLayout>
            <h1>Hello world!</h1>
          </SimpleLayout>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
