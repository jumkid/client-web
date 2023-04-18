import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import UserAutoLogin from './UserAutoLogin';
import { Route } from '@mui/icons-material';

describe(UserAutoLogin, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Route>
          <UserAutoLogin/>
        </Route>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});