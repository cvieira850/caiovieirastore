import { renderHook, act } from '@testing-library/react-hooks';
import AxiosMock from 'axios-mock-adapter';
import faker from 'faker';

import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { useCart, CartProvider } from '../../hooks/useCart';

const apiMock = new AxiosMock(api);

jest.mock('react-toastify');

const mockedToastError = toast.error as jest.Mock;
const mockedSetItemLocalStorage = jest.spyOn(Storage.prototype, 'setItem');
const product = {
  id: faker.datatype.number(),
  image: faker.image.imageUrl(),
  price: faker.commerce.price(),
  stock: faker.datatype.number(),
  name: faker.commerce.productName(),
};
const otherProduct = {
  id: faker.datatype.number(),
  image: faker.image.imageUrl(),
  price: faker.commerce.price(),
  stock: faker.datatype.number(),
  name: faker.commerce.productName(),
};
const initialStoragedData = [
  product, otherProduct, 
];

describe('useCart Hook', () => {
  beforeEach(() => {
    apiMock.reset();

    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(initialStoragedData));
  });

  test('Should be able to initialize cart with localStorage value', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
  });

  test('Should be able to add a new product', async () => {
    const productId = faker.datatype.number({
      min: 400,
      max: 500,
    });
    const newProduct = {
      id: productId,
      image: faker.image.imageUrl(),
      price: faker.commerce.price(),
      stock: faker.datatype.number(),
      name: faker.commerce.productName(),
    }
    apiMock.onGet(`product/${productId}`).reply(200, newProduct);

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      [
        product,
        otherProduct,
        {
          id: productId,
          stock: 1,
          image: newProduct.image,
          price: newProduct.price,
          name: newProduct.name,
        },
      ]
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@CaioVieira:cart',
      JSON.stringify(result.current.cart)
    );
  });

  test('Should not be able add a product that does not exist', async () => {
    const productId = faker.datatype.number({
      min: 1,
      max: 100
    });

    apiMock.onGet(`product/${productId}`).reply(404);

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na adição do produto'
        );
      },
      { timeout: 200 }
    );

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  test('Should be able to increase a product amount when adding a product that already exists on cart', async () => {
    const productId = otherProduct.id;

    apiMock.onGet(`product/${productId}`).reply(200, {
        id: productId,
        stock: otherProduct.stock + 300,
        image: otherProduct.image,
        price: otherProduct.price,
        name: otherProduct.name,
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        product,
        {
          id: productId,
          stock: otherProduct.stock + 1,
          image: otherProduct.image,
          price: otherProduct.price,
          name: otherProduct.name,
        },
      ])
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@CaioVieira:cart',
      JSON.stringify(result.current.cart)
    );
  });

  test('Should not be able to increase a product amount when running out of stock', async () => {
    const productId = otherProduct.id;

    apiMock.onGet(`product/${productId}`).reply(200, otherProduct);

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Quantidade solicitada fora de estoque'
        );
      },
      {
        timeout: 200,
      }
    );

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  test('Should be able to remove a product', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.removeProduct(otherProduct.id);
    });

    expect(result.current.cart).toEqual(
      [
        product
      ]
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@CaioVieira:cart',
      JSON.stringify(result.current.cart)
    );
  });

  test('Should not be able to remove a product that does not exist', () => {
    const productId = faker.datatype.number({
      min: 1000,
      max: 2000,
    });

    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.removeProduct(productId);
    });

    expect(mockedToastError).toHaveBeenCalledWith('Erro na remoção do produto');
    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  test('Should be able to update a product amount', async () => {
    const productId = otherProduct.id;

    apiMock.onGet(`product/${productId}`).reply(200, {
      id: otherProduct.id,
      name: otherProduct.name,
      image: otherProduct.image,
      price: otherProduct.price,
      stock: otherProduct.stock + 300,
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ stock: otherProduct.stock + 2, productId });
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        product,
        {
          id: otherProduct.id,
          name: otherProduct.name,
          image: otherProduct.image,
          price: otherProduct.price,
          stock: otherProduct.stock + 2
        },
      ])
    );
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@CaioVieira:cart',
      JSON.stringify(result.current.cart)
    );
  });

  test('Should not be able to update a product that does not exist', async () => {
    const productId = faker.datatype.number({
      min: 2000,
      max: 2400,
    });

    apiMock.onGet(`product/${productId}`).reply(404);

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ stock: 1, productId });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na alteração de quantidade do produto'
        );
      },
      { timeout: 200 }
    );

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  test('Should not be able to update a product amount when running out of stock', async () => {

    apiMock.onGet(`product/${otherProduct.id}`).reply(200, otherProduct);

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ stock: otherProduct.stock, productId: otherProduct.id });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Quantidade solicitada fora de estoque'
        );
      },
      { timeout: 200 }
    );

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  test('Should not be able to update a product amount to a value smaller than 1', async () => {

    apiMock.onGet(`stock/${otherProduct.id}`).reply(200, otherProduct);

    const { result, waitForValueToChange } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ stock: 0, productId: otherProduct.id });
    });

    try {
      await waitForValueToChange(
        () => {
          return result.current.cart;
        },
        { timeout: 50 }
      );
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      );
      expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
    } catch {
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      );
      expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
    }
  });
});
