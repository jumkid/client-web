import React from 'react';
import UserLogin from './UserLogin';
import ReactTestRenderer from 'react-test-renderer';
import { Route } from '@mui/icons-material';

describe(UserLogin, () => {
  it('render user login component', () => {
    const tree = ReactTestRenderer
      .create(
        <Route><UserLogin /></Route>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});