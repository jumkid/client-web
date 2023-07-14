import React from 'react';
import AuthRoute from './AuthRoute';
import { getTestJwtToken } from '../../App.test';
import authenticationManager from './AuthenticationManager';
import ReactTestRenderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { store } from '../../store';
import { Provider } from 'react-redux';
import { Route } from '@mui/icons-material';

describe(AuthRoute, () => {
  const token = getTestJwtToken();

  it('Should render correctly render child component with jwt', async () => {
    authenticationManager.updateToken(token);

    await act(async () => {
      const tree = ReactTestRenderer
        .create(
          <Provider store={store}>
            <AuthRoute>
              <h1>Hello world!</h1>
            </AuthRoute>
          </Provider>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('Should render navigation to login without jwt', () => {
    authenticationManager.updateToken(null);
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <Route>
            <AuthRoute>
              <h1>Hello world!</h1>
            </AuthRoute>
          </Route>
        </Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});