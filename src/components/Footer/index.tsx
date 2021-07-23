import React from 'react';

import { Container } from './styles';

const Footer = (): JSX.Element => {

  return (
    <Container>
      <p data-testid="footer-message">Desenvolvido com 💖 por Caio Vieira</p>
    </Container>
  );
};

export default Footer;
