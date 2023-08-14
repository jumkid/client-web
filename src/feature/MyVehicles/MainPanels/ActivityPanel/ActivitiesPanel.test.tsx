import React from 'react';
import ActivitiesPanel from './ActivitiesPanel';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe(ActivitiesPanel, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <ActivitiesPanel vehicleId='abed-1234'/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});