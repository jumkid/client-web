import React, { ReactNode } from 'react';
import { createTheme } from '@mui/material/styles';
import { DesignTokens } from '../Layout.Theme';
import TopBar from '../MainLayout/MainLayout.TopBar';
import { ThemeProvider } from '@emotion/react';
import { Container } from '@mui/material';
import './SimpleLayout.css';

interface Props {
    children: ReactNode
}

function SimpleLayout (props: Props) {
  const mode = 'light';
  const jkTheme = React.useMemo(() => createTheme(DesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={jkTheme}>
      <TopBar menuSettings={[]} userSettings={[]}/>

      <Container maxWidth='md' sx={{ height: '90vh' }}>
        { props.children }
      </Container>
    </ThemeProvider>
  );
}

export default SimpleLayout;
