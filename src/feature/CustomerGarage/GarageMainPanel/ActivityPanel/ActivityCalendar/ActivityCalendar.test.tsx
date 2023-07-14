import React from 'react';
import ActivityCalendar from './ActivityCalendar';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

describe(ActivityCalendar, () => {
  test('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <ActivityCalendar mode='WEEK'/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
})