import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { render, screen } from '@testing-library/react';

describe(ConfirmDialog, () => {
  it('Should render correctly', () => {
    render(<ConfirmDialog
      title='test confirm dialog'
      isShown={true}
      confirmCallback={()=>{ return; }}
      cancelCallback={()=>{ return; }}
    />);
    expect(screen.getByText(/test confirm dialog/i)).toBeDefined();
  });
});