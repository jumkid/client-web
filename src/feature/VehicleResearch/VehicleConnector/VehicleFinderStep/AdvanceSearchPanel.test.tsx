import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AdvanceSearchPanel from './AdvanceSearchPanel';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe(AdvanceSearchPanel, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <Provider store={store}>
          <AdvanceSearchPanel />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});