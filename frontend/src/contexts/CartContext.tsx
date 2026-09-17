import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cartService } from '../services/cart.service';
import { useAuth } from './AuthContext';
import type { Cart } from '../types';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (data: { productId: string; quantity: number; weight?: number; cutOptionId?: string; packagingOptionId?: string }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isStaff } = useAuth();
  const canHaveCart = isAuthenticated && !isStaff;
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!canHaveCart) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [canHaveCart]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem: CartContextValue['addItem'] = useCallback(async (data) => {
    const updated = await cartService.addItem(data);
    setCart(updated);
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const updated = await cartService.updateItem(itemId, quantity);
    setCart(updated);
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    const updated = await cartService.removeItem(itemId);
    setCart(updated);
  }, []);

  const clear = useCallback(async () => {
    const updated = await cartService.clear();
    setCart(updated);
  }, []);

  const itemCount = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart],
  );

  const value = useMemo<CartContextValue>(
    () => ({ cart, itemCount, loading, refresh, addItem, updateItem, removeItem, clear }),
    [cart, itemCount, loading, refresh, addItem, updateItem, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
