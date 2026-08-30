"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { getProductById } from "@/data/products";
import type { CartLine, Product, ProductSelection } from "@/types/commerce";

const CART_STORAGE_KEY = "threadsofgold:preview-cart";
const CART_STORAGE_EVENT = "threadsofgold:preview-cart-change";
const CART_STORAGE_VERSION = 2;
const EMPTY_CART_SNAPSHOT = JSON.stringify({
  version: CART_STORAGE_VERSION,
  lines: [],
});
let fallbackCartSnapshot = EMPTY_CART_SNAPSHOT;

interface StoredCart {
  version: typeof CART_STORAGE_VERSION;
  lines: Array<{
    productId: string;
    quantity: number;
    selections: ProductSelection;
  }>;
}

interface CartContextValue {
  lines: CartLine[];
  totalQuantity: number;
  addProduct: (productId: string, selections?: ProductSelection) => void;
  decreaseProduct: (lineId: string) => void;
  removeProduct: (lineId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function createCartLineId(
  productId: string,
  selections: ProductSelection,
): string {
  const optionKey = Object.entries(selections)
    .toSorted(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");

  return optionKey ? `${productId}::${optionKey}` : productId;
}

function normalizeSelections(
  product: Product,
  selections: ProductSelection,
): ProductSelection {
  return Object.fromEntries(
    product.options.flatMap((option) => {
      const requestedValue = selections[option.label];
      const selectedValue = option.values.find(
        (value) => value.label === requestedValue,
      );
      const resolvedValue = selectedValue ?? option.values[0];

      return resolvedValue ? [[option.label, resolvedValue.label]] : [];
    }),
  );
}

function isProductSelection(value: unknown): value is ProductSelection {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.entries(value).every(
      ([key, optionValue]) =>
        key.length > 0 &&
        typeof optionValue === "string" &&
        optionValue.length > 0,
    )
  );
}

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
        line.quantity < 1 ||
        !isProductSelection(line.selections)
      ) {
        return [];
      }

      const product = getProductById(line.productId);

      if (!product) {
        return [];
      }

      const selections = normalizeSelections(product, line.selections);

      return [
        {
          id: createCartLineId(product.id, selections),
          product,
          selections,
          quantity: Math.min(Math.floor(line.quantity), 20),
        },
      ];
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
    lines: lines.map(({ product, quantity, selections }) => ({
      productId: product.id,
      quantity,
      selections,
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

  const addProduct = useCallback(
    (productId: string, selections: ProductSelection = {}) => {
      const product = getProductById(productId);

      if (!product) {
        return;
      }

      const currentLines = parseStoredCart(getCartSnapshot());
      const normalizedSelections = normalizeSelections(product, selections);
      const lineId = createCartLineId(productId, normalizedSelections);
      const existingLine = currentLines.find((line) => line.id === lineId);

      writeCart(
        existingLine
          ? currentLines.map((line) =>
              line.id === lineId
                ? { ...line, quantity: Math.min(line.quantity + 1, 20) }
                : line,
            )
          : [
              ...currentLines,
              {
                id: lineId,
                product,
                selections: normalizedSelections,
                quantity: 1,
              },
            ],
      );
    },
    [],
  );

  const decreaseProduct = useCallback((lineId: string) => {
    const currentLines = parseStoredCart(getCartSnapshot());

    writeCart(
      currentLines.flatMap((line) => {
        if (line.id !== lineId) {
          return [line];
        }

        return line.quantity > 1
          ? [{ ...line, quantity: line.quantity - 1 }]
          : [];
      }),
    );
  }, []);

  const removeProduct = useCallback((lineId: string) => {
    writeCart(
      parseStoredCart(getCartSnapshot()).filter((line) => line.id !== lineId),
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
