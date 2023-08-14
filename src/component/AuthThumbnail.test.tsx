import React from 'react';
import AuthThumbnail from './AuthThumbnail';
import ReactTestRenderer from 'react-test-renderer';

describe(AuthThumbnail, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <AuthThumbnail contentId='1234' idx={1} width={10} height={10}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});