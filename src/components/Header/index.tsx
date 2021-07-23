import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.png';
import { Container, Cart } from './styles';

const Header = (): JSX.Element => {

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Caio Vieira" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span>
             30 itens
          </span>
        </div>
        <MdShoppingBasket size={36} color="#0076DE" />
      </Cart>
    </Container>
  );
};

export default Header;
