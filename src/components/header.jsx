import React from 'react';
import styled from 'styled-components';
import TmhLogo from '../assets/logo/logo-vertical.png'

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({theme}) => theme.colors.overlayBackground};
  padding-bottom: 50px;
  > img {
    height: 200px;
  }
`;

const Header = () => {
  return(
    <StyledHeader>
      <img src={TmhLogo} />
    </StyledHeader>
  );
};

export default Header;