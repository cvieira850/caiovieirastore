import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import GlobalStyles from './styles/global';
import Header from './components/Header';
import { CartProvider } from './hooks/useCart';

function App() {
  return (
   <BrowserRouter>
    <CartProvider>
      <GlobalStyles />
      <Header />
      <Routes />
    </CartProvider>
   </BrowserRouter>
  );
}

export default App;
