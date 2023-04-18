import React from 'react';
import AuthImage from './AuthImage';
import ReactTestRenderer from 'react-test-renderer';

describe(AuthImage, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <AuthImage id="1234"/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});