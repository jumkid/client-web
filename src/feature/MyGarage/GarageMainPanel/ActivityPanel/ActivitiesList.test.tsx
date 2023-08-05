import React from 'react';
import ActivitiesList from './ActivitiesList';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe(ActivitiesList, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <ActivitiesList activities={[]}/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});