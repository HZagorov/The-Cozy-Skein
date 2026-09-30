'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: number, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: number, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  promoCode: string;
  discountRate: number;
  freeShippingPromo: boolean;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0); // e.g. 0.1 for 10%
  const [freeShippingPromo, setFreeShippingPromo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cozy_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cozy_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const color = selectedColor || (product.color_options?.[0]?.name ?? 'Default');
    const size = selectedSize || (product.size_options?.[0] ?? 'Standard');

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity = Math.min(
          product.stock || 99,
          next[existingIndex].quantity + quantity
        );
        return next;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, selectedColor?: string, selectedSize?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (!selectedColor || item.selectedColor === selectedColor) &&
            (!selectedSize || item.selectedSize === selectedSize)
          )
      )
    );
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          (!selectedColor || item.selectedColor === selectedColor) &&
          (!selectedSize || item.selectedSize === selectedSize)
        ) {
          return { ...item, quantity: Math.min(item.product.stock || 99, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountRate(0);
    setFreeShippingPromo(false);
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WARMTH10') {
      setPromoCode('WARMTH10');
      setDiscountRate(0.1);
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'COZY20') {
      setPromoCode('COZY20');
      setDiscountRate(0.2);
      return { success: true, message: '20% boutique discount applied!' };
    }
    if (clean === 'FIRSTKNIT') {
      setPromoCode('FIRSTKNIT');
      setFreeShippingPromo(true);
      return { success: true, message: 'Free shipping promo activated!' };
    }
    return { success: false, message: 'Invalid promo code. Try WARMTH10 or FIRSTKNIT' };
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscountRate(0);
    setFreeShippingPromo(false);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    return subtotal * discountRate;
  }, [subtotal, discountRate]);

  // Free shipping threshold: $75, or with FIRSTKNIT promo
  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (freeShippingPromo || subtotal >= 75) return 0;
    return 5.50; // standard flat rate
  }, [subtotal, freeShippingPromo]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        promoCode,
        discountRate,
        freeShippingPromo,
        applyPromo,
        removePromo,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
