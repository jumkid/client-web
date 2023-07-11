import React from 'react';
import GalleryPanel from './GalleryPanel';
import ReactTestRenderer from 'react-test-renderer';
import * as C from '../../../../App.constants';

describe(GalleryPanel, () => {
  it('Should render correctly', () => {
    const tree = ReactTestRenderer
      .create(
        <GalleryPanel mode={C.MODE_ACTIVE}/>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});