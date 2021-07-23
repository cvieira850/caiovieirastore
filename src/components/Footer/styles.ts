import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
  p {
    font-weight: 700;
    transition: opacity 0.2s;
    color: #0076DE;
    &:hover {
      opacity: 0.7;
    }
  }
`;
