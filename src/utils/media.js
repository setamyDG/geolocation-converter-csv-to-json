import { css } from 'styled-components';

export const sizes = {
  desktop: 1100,
  tablet: 768,
  mobile: 576,
};

export default Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;

  return acc;
}, {});
