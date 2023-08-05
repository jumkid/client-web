import React from 'react';
import GarageDashboard from './GarageDashboard';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { store } from '../../../store';
import { Provider } from 'react-redux';
import authenticationManager from '../../../security/Auth/AuthenticationManager';
import { getTestJwtToken } from '../../../App.test';

describe(GarageDashboard, () => {
  it('Should render correctly', async () => {
    authenticationManager.updateToken(getTestJwtToken());

    await act(async () => {
      const tree = ReactTestRenderer
        .create(
          <Provider store={store}>
            <GarageDashboard/>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});