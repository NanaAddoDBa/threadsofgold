"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { getProductById } from "@/data/products";
import type { CartLine } from "@/types/commerce";

const CART_STORAGE_KEY = "threadsofgold:preview-cart";
const CART_STORAGE_EVENT = "threadsofgold:preview-cart-change";
const CART_STORAGE_VERSION = 1;
const EMPTY_CART_SNAPSHOT = JSON.stringify({
  version: CART_STORAGE_VERSION,
  lines: [],
});
let fallbackCartSnapshot = EMPTY_CART_SNAPSHOT;

interface StoredCart {
  version: typeof CART_STORAGE_VERSION;
  lines: Array<{ productId: string; quantity: number }>;
}

interface CartContextValue {
  lines: CartLine[];
  totalQuantity: number;
  addProduct: (productId: string) => void;
  decreaseProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function parseStoredCart(rawCart: string): CartLine[] {
  try {
    const storedCart = JSON.parse(rawCart) as Partial<StoredCart>;

    if (
      storedCart.version !== CART_STORAGE_VERSION ||
      !Array.isArray(storedCart.lines)
    ) {
      return [];
    }

    return storedCart.lines.flatMap((line) => {
      if (
        typeof line?.productId !== "string" ||
        typeof line.quantity !== "number" ||
        line.quantity < 1
      ) {
        return [];
      }

      const product = getProductById(line.productId);

      return product
        ? [{ product, quantity: Math.min(Math.floor(line.quantity), 20) }]
        : [];
    });
  } catch {
    return [];
  }
}

function getCartSnapshot(): string {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? EMPTY_CART_SNAPSHOT;
  } catch {
    return fallbackCartSnapshot;
  }
}

function subscribeToCart(onStoreChange: () => void): () => void {
  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(CART_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CART_STORAGE_EVENT, handleChange);
  };
}

function writeCart(lines: CartLine[]): void {
  const storedCart: StoredCart = {
    version: CART_STORAGE_VERSION,
    lines: lines.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    })),
  };

  const nextSnapshot = JSON.stringify(storedCart);
  fallbackCartSnapshot = nextSnapshot;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, nextSnapshot);
  } catch {
    // Use the in-memory snapshot in restricted browsing contexts.
  }

  window.dispatchEvent(new Event(CART_STORAGE_EVENT));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART_SNAPSHOT,
  );
  const lines = useMemo(() => parseStoredCart(snapshot), [snapshot]);

  const addProduct = useCallback((productId: string) => {
    const product = getProductById(productId);

    if (!product) {
      return;
    }

    const currentLines = parseStoredCart(getCartSnapshot());
    const existingLine = currentLines.find(
      (line) => line.product.id === productId,
    );

    writeCart(
      existingLine
        ? currentLines.map((line) =>
            line.product.id === productId
              ? { ...line, quantity: Math.min(line.quantity + 1, 20) }
              : line,
          )
        : [...currentLines, { product, quantity: 1 }],
    );
  }, []);

  const decreaseProduct = useCallback((productId: string) => {
    const currentLines = parseStoredCart(getCartSnapshot());

    writeCart(
      currentLines.flatMap((line) => {
        if (line.product.id !== productId) {
          return [line];
        }

        return line.quantity > 1
          ? [{ ...line, quantity: line.quantity - 1 }]
          : [];
      }),
    );
  }, []);

  const removeProduct = useCallback((productId: string) => {
    writeCart(
      parseStoredCart(getCartSnapshot()).filter(
        (line) => line.product.id !== productId,
      ),
    );
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQuantity: lines.reduce((total, line) => total + line.quantity, 0),
      addProduct,
      decreaseProduct,
      removeProduct,
      clearCart,
    }),
    [addProduct, clearCart, decreaseProduct, lines, removeProduct],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
