import React from 'react';
import { Link } from 'react-router-dom';

const Header = (): JSX.Element => {

  return (
    <div>
      <Link to="/">
        <h1>CVIEIRA</h1>
      </Link>
    </div>
  );
};

export default Header;
