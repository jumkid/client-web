import React from 'react';
import ActivityCalendar from './ActivityCalendar';
import { Provider } from 'react-redux';
import { store } from '../../../../../store';
import * as C from '../../../../../App.constants';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

describe(ActivityCalendar, () => {
  test('Should render correctly', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <ActivityCalendar mode={C.WEEK}/>
      </Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Should render with week days', () => {
    render(
      <Provider store={store}>
        <ActivityCalendar mode={C.WEEK}/>
      </Provider>
    );
    const weekCalendar = screen.getByText(/SUN/i);
    expect(weekCalendar).toBeDefined();
  })
})