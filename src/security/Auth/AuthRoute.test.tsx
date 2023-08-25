import React from 'react';
import AuthRoute from './AuthRoute';
import { getTestJwtToken } from '../../App.test';
import authenticationManager from './AuthenticationManager';
import { act } from 'react-dom/test-utils';
import { store } from '../../store';
import { Provider } from 'react-redux';
import { Route } from '@mui/icons-material';
import { render } from '@testing-library/react';

describe(AuthRoute, () => {

  const token = getTestJwtToken();

  it('Should render correctly render child component with jwt', async () => {
    authenticationManager.updateToken(token);

    await act(async () => {
      render(
        <Provider store={store}>
          <AuthRoute>
            <h1>Hello world!</h1>
          </AuthRoute>
        </Provider>);
      expect(screen).toMatchSnapshot();
    });
  });

  it('Should render navigation to login without jwt', () => {
    authenticationManager.updateToken(null);

    render(
      <Provider store={store}>
        <Route>
          <AuthRoute>
            <h1>Hello world!</h1>
          </AuthRoute>
        </Route>
      </Provider>);
    expect(screen).toMatchSnapshot();
  });
});