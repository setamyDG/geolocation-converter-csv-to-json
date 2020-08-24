import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../style/GlobalStyle';
import theme from '../style/theme';
import Header from './header';
import Footer from './footer';

const StyledMain = styled.main`
`;

const Layout = ({ children }) => {
  return (
    <ThemeProvider
      theme={theme}
    >
      <GlobalStyle />
      <Header />
      <StyledMain>
        {children}
      </StyledMain>
      <Footer />
    </ThemeProvider>
  );
};

export default Layout;
