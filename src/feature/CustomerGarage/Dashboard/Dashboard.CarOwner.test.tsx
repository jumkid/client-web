import React from 'react';
import CarOwner from './Dashboard.CarOwner';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { store } from '../../../store';
import { Provider } from 'react-redux';
import authenticationManager from '../../../security/Auth/AuthenticationManager';
import { getTestJwtToken } from '../../../App.test';

describe(CarOwner, () => {
  it('Should render correctly', async () => {
    authenticationManager.updateToken(getTestJwtToken());

    await act(async () => {
      const tree = ReactTestRenderer
        .create(
          <Provider store={store}>
            <CarOwner/>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});