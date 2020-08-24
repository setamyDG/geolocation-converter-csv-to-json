import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 270px;
  background: ${({theme}) => theme.colors.overlayBackground};
  text-transform: uppercase;
`;
const Footer = () => {
  return(
    <StyledFooter>
      <h1>Footer</h1>
    </StyledFooter>
  )
}

export default Footer;