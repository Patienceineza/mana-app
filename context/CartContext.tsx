import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { api } from '@/lib/api';
import type { Cart } from '@/types';

interface CartContextValue {
  cart: Cart;
  count: number;
  refresh: () => Promise<void>;
  add: (productId: number, qty?: number) => Promise<void>;
  setQty: (productId: number, qty: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
}

const EMPTY_CART: Cart = { items: [], subtotal: 0 };

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);

  const refresh = useCallback(async () => {
    const res = await api.get<Cart>('/cart');
    setCart(res);
  }, []);

  const add = useCallback(async (productId: number, qty = 1) => {
    const res = await api.post<Cart>('/cart', { productId, qty });
    setCart(res);
  }, []);

  const setQty = useCallback(async (productId: number, qty: number) => {
    const res = await api.patch<Cart>(`/cart/${productId}`, { qty });
    setCart(res);
  }, []);

  const remove = useCallback(async (productId: number) => {
    const res = await api.delete<Cart>(`/cart/${productId}`);
    setCart(res);
  }, []);

  const count = useMemo(() => cart.items.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const value = useMemo(() => ({ cart, count, refresh, add, setQty, remove }), [cart, count, refresh, add, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
