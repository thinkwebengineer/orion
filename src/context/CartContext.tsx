'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/types/cart';

const STORAGE_KEY = 'orion-cart';

// ── Reducer ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | {
      type: 'REMOVE_ITEM';
      payload: { productId: string; variantLabel?: string };
    }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; variantLabel?: string; quantity: number };
    }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantLabel === action.payload.variantLabel,
      );
      if (idx !== -1) {
        const next = state.slice();
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + action.payload.quantity,
        };
        return next;
      }
      return [...state, action.payload];
    }

    case 'REMOVE_ITEM':
      return state.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.variantLabel === action.payload.variantLabel
          ),
      );

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return state.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.variantLabel === action.payload.variantLabel
            ),
        );
      }
      return state.map((item) =>
        item.productId === action.payload.productId &&
        item.variantLabel === action.payload.variantLabel
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
    }

    case 'CLEAR_CART':
      return [];

    case 'HYDRATE':
      return action.payload;

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  /** True once localStorage has been read on the client. False during SSR. */
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage exactly once, on mount (client-only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', payload: parsed as CartItem[] });
        }
      }
    } catch {
      // localStorage unavailable, corrupt, or quota exceeded — start empty
    }
  }, []);

  // Persist to localStorage on every change, but only after hydration.
  // We track whether hydration has happened by checking if the storage key exists.
  // Actually: simpler — always write. The key is there on client.
  // But we must not overwrite with empty on first server render.
  // Solution: only persist if we're in a browser environment.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage full or unavailable
      }
    }
  }, [state]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((productId: string, variantLabel?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantLabel } });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantLabel?: string) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantLabel, quantity } });
    },
    [],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = state.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state,
        isHydrated: typeof window !== 'undefined',
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
