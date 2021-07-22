import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

import { Container } from './styles';

const Header = (): JSX.Element => {

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Caio Vieira" />
      </Link>
    </Container>
  );
};

export default Header;
