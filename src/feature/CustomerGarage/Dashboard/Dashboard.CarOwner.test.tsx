import React from 'react';
import CarOwner from './Dashboard.CarOwner';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { store } from '../../../store';
import { Provider } from 'react-redux';

describe(CarOwner, () => {
  it('Should render correctly', async () => {
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