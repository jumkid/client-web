import React from 'react';
import NotificationDrawer from './NotificationDrawer';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { render, screen } from '@testing-library/react';

describe(NotificationDrawer, () => {
  it('Should render correctly', () => {
      render(
        <Provider store={store}>
          <NotificationDrawer drawerOpen={true} toggleDrawer={():void => {console.log("empty function")}}/>
        </Provider>
      );
    expect(screen).toMatchSnapshot();
  })
});