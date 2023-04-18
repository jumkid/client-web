import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import UserSignUp from './UserSignUp';
import { Provider } from 'react-redux';
import { store } from '../../store';

describe(UserSignUp, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <UserSignUp/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
