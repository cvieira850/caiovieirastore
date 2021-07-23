import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import GlobalStyles from './assets/styles/global';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './hooks/useCart';

function App() {
  return (
   <BrowserRouter>
    <CartProvider>
      <GlobalStyles />
      <Header />
      <Routes />
      <Footer />
    </CartProvider>
   </BrowserRouter>
  );
}

export default App;
