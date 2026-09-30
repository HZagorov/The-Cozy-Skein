'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ success: res.success, text: res.message });
    if (res.success) setInputCode('');
  };

  const freeShippingThreshold = 75;
  const awayFromFree = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-cozy-sand mx-auto flex items-center justify-center text-cozy-wool/40">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-cozy-charcoal">
          Your Knitting Basket is Empty
        </h1>
        <p className="text-sm text-cozy-wool/70 max-w-md mx-auto">
          You haven&apos;t added any botanical dyed skeins or hand-knitted pieces yet. Explore our latest arrivals to cast on!
        </p>
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white rounded-2xl text-sm font-semibold shadow-md transition-all"
          >
            <span>Explore Boutique Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-cozy-sand gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Order Basket Review
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cozy-charcoal mt-1">
            Your Knitting Basket ({items.length})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold self-start sm:self-auto"
        >
          Clear Basket
        </button>
      </div>

      {/* Free Shipping Meter */}
      <div className="bg-white p-4 rounded-2xl border border-cozy-sand shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-medium text-cozy-wool mb-2">
          <Truck className="w-4 h-4 text-cozy-sage shrink-0" />
          {freeShippingPromo || awayFromFree === 0 ? (
            <span className="text-emerald-700 font-semibold">
              🎉 Congratulations! You qualified for Free Studio Delivery.
            </span>
          ) : (
            <span>
              Add <strong className="text-cozy-terracotta font-bold">${awayFromFree.toFixed(2)}</strong> more to receive Free Shipping!
            </span>
          )}
        </div>
        <div className="w-full bg-cozy-sand h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-cozy-terracotta h-full rounded-full transition-all duration-300"
            style={{ width: `${freeShippingPromo ? 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Layout: Items + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-cozy-sand overflow-hidden shadow-xs divide-y divide-cozy-sand">
            {items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-cozy-sand/50 shrink-0 border border-cozy-sand">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-base sm:text-lg font-bold text-cozy-charcoal hover:text-cozy-terracotta transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-cozy-wool/60 mt-1">
                      {item.selectedColor && (
                        <span className="bg-cozy-sand/80 px-2 py-0.5 rounded-md">
                          Color: <strong>{item.selectedColor}</strong>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="bg-cozy-sand/80 px-2 py-0.5 rounded-md">
                          Format: <strong>{item.selectedSize}</strong>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-serif font-semibold text-cozy-wool mt-1.5 block sm:hidden">
                      ${item.product.price.toFixed(2)} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-stretch sm:self-auto pt-3 sm:pt-0 border-t sm:border-0 border-cozy-sand">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-cozy-clay rounded-xl bg-cozy-cream overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                      className="px-2.5 py-1 text-cozy-wool hover:bg-cozy-sand transition-colors font-bold text-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-cozy-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                      className="px-2.5 py-1 text-cozy-wool hover:bg-cozy-sand transition-colors font-bold text-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="font-serif text-base font-bold text-cozy-charcoal">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Trash */}
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                    className="p-1.5 text-cozy-wool/40 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-cozy-wool/70 px-2">
            <Link href="/catalog" className="hover:text-cozy-terracotta underline font-medium">
              ← Continue browsing yarn catalog
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-cozy-sand shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-cozy-charcoal border-b border-cozy-sand pb-4">
              Order Summary
            </h3>

            {/* Promo Form */}
            <div>
              <span className="text-xs font-semibold text-cozy-wool block mb-1.5">
                Have a coupon or studio code?
              </span>
              {promoCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Applied: <strong>{promoCode}</strong>
                  </span>
                  <button
                    onClick={removePromo}
                    className="text-emerald-700 hover:text-red-600 underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WARMTH10"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-cozy-clay bg-cozy-cream/30 focus:outline-none focus:ring-1 focus:ring-cozy-terracotta uppercase"
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
                <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                  promoMessage.success ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  {promoMessage.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-xs text-cozy-wool/80 pt-2 border-t border-cozy-sand">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-cozy-charcoal">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span className="font-semibold text-cozy-charcoal">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-cozy-charcoal pt-3 border-t border-cozy-sand">
                <span className="font-serif">Estimated Total</span>
                <span className="font-serif text-xl text-cozy-terracotta">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Link */}
            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md hover:shadow-warm transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-cozy-wool/50">
              <ShieldCheck className="w-4 h-4 text-cozy-sage" />
              <span>Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
