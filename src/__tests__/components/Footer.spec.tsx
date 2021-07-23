import { render } from '@testing-library/react';
import { ReactNode } from 'react';

import Footer from '../../components/Footer';

describe('Footer Component', () => {
  test('Should be able to render the footer message', () => {
    const { getByTestId } = render(<Footer />);

    const message = getByTestId('footer-message');
    expect(message).toHaveTextContent('Desenvolvido com 💖 por Caio Vieira');
  });
});
