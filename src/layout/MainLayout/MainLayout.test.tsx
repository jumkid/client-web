import React from 'react';
import MainLayout from './MainLayout';
import ReactTestRenderer from 'react-test-renderer';
import { store } from '../../store';
import { Provider } from 'react-redux';

describe(MainLayout, () => {
  it('render main layout component', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <MainLayout mode="dark" menuIndex={0}>
            <h1>Hello world!</h1>
          </MainLayout>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});