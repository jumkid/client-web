import React from 'react';
import AdvanceSearchConnector from './AdvanceSearchConnector';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store';

describe(AdvanceSearchConnector, () => {
  it('should render correctly', () => {
    render(
      <Provider store={store}>
        <AdvanceSearchConnector/>
      </Provider>
    );
    expect(screen).toMatchSnapshot();
  })
});