import React from 'react';
import GalleryPanel from './GalleryPanel';
import ReactTestRenderer from 'react-test-renderer';

describe(GalleryPanel, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <GalleryPanel />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});