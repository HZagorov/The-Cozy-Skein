'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    promoCode,
    applyPromo,
    removePromo,
    freeShippingPromo,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ success: res.success, text: res.message });
    if (res.success) {
      setInputCode('');
    }
  };

  const freeShippingThreshold = 75;
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cozy-charcoal/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-cozy-sand flex items-center justify-between bg-cozy-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cozy-terracotta" />
              <h2 className="font-serif text-lg font-bold text-cozy-charcoal">
                Your Knitting Basket
              </h2>
              <span className="text-xs bg-cozy-sand px-2 py-0.5 rounded-full text-cozy-wool font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-cozy-wool/60 hover:text-cozy-wool hover:bg-cozy-sand transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-cozy-sand/50 px-5 py-3 border-b border-cozy-sand text-xs">
            <div className="flex items-center gap-2 mb-1.5 font-medium text-cozy-wool">
              <Truck className="w-4 h-4 text-cozy-sage" />
              {freeShippingPromo || awayFromFreeShipping === 0 ? (
                <span className="text-emerald-700 font-semibold">
                  You unlocked FREE studio delivery! 🎉
                </span>
              ) : (
                <span>
                  Add <strong className="text-cozy-terracotta font-bold">${awayFromFreeShipping.toFixed(2)}</strong> more to get Free Shipping
                </span>
              )}
            </div>
            <div className="w-full bg-cozy-clay/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cozy-terracotta h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingPromo ? 100 : progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-cozy-sand/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cozy-sand flex items-center justify-center text-cozy-wool/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-cozy-wool/60 mt-1 max-w-xs">
                    Explore our botanical hand-dyed yarns and cozy hand-knitted creations to start your project.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                >
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-cozy-sand/50 shrink-0 border border-cozy-sand">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-bold text-cozy-charcoal hover:text-cozy-terracotta line-clamp-1 transition-colors"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-cozy-wool/40 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-cozy-wool/70 mt-1">
                        {item.selectedColor && (
                          <span className="bg-cozy-sand/70 px-2 py-0.5 rounded-md">
                            Color: <strong className="text-cozy-wool">{item.selectedColor}</strong>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-cozy-sand/70 px-2 py-0.5 rounded-md">
                            Size: <strong className="text-cozy-wool">{item.selectedSize}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-cozy-clay/60 rounded-lg bg-cozy-cream overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="p-1 hover:bg-cozy-sand text-cozy-wool transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-cozy-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="p-1 hover:bg-cozy-sand text-cozy-wool transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="font-serif text-sm font-bold text-cozy-charcoal">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-cozy-sand bg-cozy-cream/80 space-y-3">
              {/* Promo input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Promo active: <strong>{promoCode}</strong>
                    </span>
                    <button
                      onClick={removePromo}
                      className="text-xs text-emerald-700 hover:text-red-600 underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. WARMTH10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-cozy-clay/60 bg-white focus:outline-none focus:ring-1 focus:ring-cozy-terracotta uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cozy-wool hover:bg-cozy-charcoal text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <p className={`text-[11px] mt-1 flex items-center gap-1 ${
                    promoMessage.success ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {promoMessage.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-cozy-wool/80 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-cozy-charcoal">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-cozy-charcoal">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-cozy-charcoal pt-2 border-t border-cozy-sand">
                  <span className="font-serif">Total</span>
                  <span className="font-serif text-cozy-terracotta">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-sm text-center flex items-center justify-center gap-2 shadow-md hover:shadow-warm transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 px-4 rounded-xl text-center text-xs font-medium text-cozy-wool hover:text-cozy-terracotta hover:bg-cozy-sand/50 transition-colors"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
