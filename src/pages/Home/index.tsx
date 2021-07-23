import React, { useState, useEffect }  from 'react';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

const Home = (): JSX.Element => {

  const [products, setProducts] = useState<ProductFormatted[]>([]);

  useEffect( () => {
    async function loadProducts() {
      const response = await api.get<Product[]>('product');
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price)
      }));
      setProducts(data);
    }
    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.name} />
          <strong>{product.name}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
          onClick={() => console.log('cliquei')}
          >
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
