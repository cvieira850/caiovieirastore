import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  stock: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, stock }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@CaioVieira:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const prevCartRef = useRef<Product[]>();

  useEffect(() => {
    prevCartRef.current = cart;
  });

  const cartPreviousValue = prevCartRef.current ?? cart;

  useEffect(() => {
    if (cartPreviousValue !== cart) {
      localStorage.setItem("@CaioVieira:cart", JSON.stringify(cart));
    }
  }, [cart, cartPreviousValue]);
  const addProduct = async (productId: number) => {
    try {
      const stock = await api.get(`/product/${productId}`);
      const stockAmount = stock.data.stock;

      const existingItem = cart.find((cartItem) => cartItem.id === productId);

      if (
        stockAmount <= 0 ||
        (existingItem && existingItem!.stock >= stockAmount)
      ) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if (existingItem) {
        const updatedCart = cart.map((cartItem) => {
          return cartItem.id === productId
            ? { ...cartItem, stock: cartItem.stock + 1 }
            : cartItem;
        });
        setCart(updatedCart);
        return;
      }

      const productToAdd = await api.get(`/product/${productId}`);

      setCart([...cart, { ...productToAdd.data, stock: 1 }]);
      localStorage.setItem(
        "@CaioVieira:cart",
        JSON.stringify([...cart, { ...productToAdd.data, stock: 1 }])
      );
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productExists = cart.find((cartItem) => cartItem.id === productId);

      if (productExists) {
        const updatedCart = cart.filter(
          (cartItem) => cartItem.id !== productId
        );
        setCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    stock : amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) return;

      const stock = await api.get(`/product/${productId}`);
      const stockAmount = stock.data.stock;

      if (amount < stockAmount) {
        const updatedCart = cart.map((cartItem) =>
          cartItem.id === productId ? { ...cartItem, stock: amount } : cartItem
        );
        setCart(updatedCart);
      } else {
        toast.error("Quantidade solicitada fora de estoque");
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
