import { render } from '@testing-library/react';
import { ReactNode } from 'react';

import Header from '../../components/Header';

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: ReactNode }) => children,
  };
});

jest.mock('../../hooks/useCart', () => {
  const faker  = require('faker');
  return {
    useCart: () => ({
      cart: [
        {
          id: faker.datatype.number(),
          image: faker.image.imageUrl(),
          price: faker.commerce.price(),
          stock: faker.datatype.json(),
          name: faker.commerce.productName(),
        }, 
        {
          id: faker.datatype.number(),
          image: faker.image.imageUrl(),
          price: faker.commerce.price(),
          stock: faker.datatype.json(),
          name: faker.commerce.productName(),
        },
        {
          id: faker.datatype.number(),
          image: faker.image.imageUrl(),
          price: faker.commerce.price(),
          stock: faker.datatype.json(),
          name: faker.commerce.productName(),
        }
      ],
    }),
  };
});

describe('Header Component', () => {
  test('Should be able to render the amount of products added to cart', () => {
    const { getByTestId } = render(<Header />);

    const cartSizeCounter = getByTestId('cart-size-home');
    expect(cartSizeCounter).toHaveTextContent('3 itens');
  });
});
