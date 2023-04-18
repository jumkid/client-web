import React from 'react';
import TopBar from './MainLayout.TopBar';
import ReactTestRenderer from 'react-test-renderer';
import { MenuSetting, UserSetting } from './model';
import { store } from '../../store';
import { Provider } from 'react-redux';

describe(TopBar, () => {
  const menuSettings: MenuSetting[] = [
    { title: 'menu item 1', isCurrent: true, route: '/' }
  ];

  const userSettings: UserSetting[] = [
    { title: 'user menu 1',
      callback: () => {
        console.log("test");
      }
    }]

  it('render top bar component', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <TopBar menuSettings={menuSettings} userSettings={userSettings}/>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});