import React, { ReactNode } from 'react';
import { createTheme } from '@mui/material/styles';
import { DesignTokens } from '../Layout.Theme';
import { ThemeProvider } from '@emotion/react';
import { Container } from '@mui/material';
import './SimpleLayout.css';
import TopBar from './SimpleLayout.TopBar';

type Props = {
    children: ReactNode
}

function SimpleLayout (props: Props) {
  const mode = 'light';
  const jkTheme = React.useMemo(() => createTheme(DesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={jkTheme}>
      <TopBar />

      <Container maxWidth='md' sx={{ height: '90vh' }}>
        { props.children }
      </Container>
    </ThemeProvider>
  );
}

export default SimpleLayout;
