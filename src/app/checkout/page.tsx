'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { 
  Check, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Package, 
  Clock, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, shippingFee, total, clearCart, promoCode } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Emma Lindqvist',
    email: user?.email || 'emma@knitlover.com',
    phone: '+1 (555) 234-5678',
    addressLine1: '42 Meadow Lane',
    addressLine2: 'Apt 3B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States',
    shippingMethod: 'standard', // 'standard' or 'express'
    cardName: user?.name || 'Emma Lindqvist',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillDemoData = () => {
    setFormData({
      fullName: 'Emma Lindqvist',
      email: 'emma@knitlover.com',
      phone: '+1 (555) 234-5678',
      addressLine1: '42 Meadow Lane',
      addressLine2: 'Apt 3B',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
      shippingMethod: 'standard',
      cardName: 'Emma Lindqvist',
      cardNumber: '4242 •••• •••• 4242',
      cardExp: '12/28',
      cardCvc: '888',
    });
  };

  const finalShippingFee = formData.shippingMethod === 'express' ? shippingFee + 8.00 : shippingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount + finalShippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items,
        subtotal: subtotal,
        discount: discountAmount,
        shippingFee: finalShippingFee,
        total: finalTotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setPlacedOrderId(data.orderId);
      setStep(4);
      clearCart();

      // Launch cheerful confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C86446', '#718579', '#DE9B35', '#E3D5C8'],
      });
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // If basket is empty and not on confirmation step
  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cozy-charcoal">
          Your basket is empty
        </h2>
        <p className="text-sm text-cozy-wool/70">
          Please add items to your knitting basket before checking out.
        </p>
        <Link
          href="/catalog"
          className="inline-block px-5 py-2.5 bg-cozy-terracotta text-white rounded-xl text-xs font-semibold"
        >
          Browse Yarns & Accessories
        </Link>
      </div>
    );
  }

  // Step 4: Order Confirmation & Receipt
  if (step === 4 && placedOrderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cozy-sand shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta">
              Order Confirmed & Logged
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cozy-charcoal mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-cozy-wool/70 mt-2 max-w-lg mx-auto">
              We have received your request. Our studio team is preparing your skeins with botanical care.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-cozy-cream rounded-2xl p-6 border border-cozy-sand text-left space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-cozy-sand">
              <div>
                <span className="text-cozy-wool/60 block">Order Number</span>
                <strong className="text-cozy-charcoal font-serif text-sm">{placedOrderId}</strong>
              </div>
              <div>
                <span className="text-cozy-wool/60 block">Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                  Knitting / Packing
                </span>
              </div>
              <div>
                <span className="text-cozy-wool/60 block">Delivery To</span>
                <strong className="text-cozy-charcoal">{formData.fullName}</strong>
              </div>
              <div>
                <span className="text-cozy-wool/60 block">Total Charged</span>
                <strong className="text-cozy-terracotta font-serif text-sm">
                  ${finalTotal.toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-cozy-wool">Shipping Destination:</span>
              <p className="text-cozy-wool/80">
                {formData.addressLine1} {formData.addressLine2}, {formData.city}, {formData.state} {formData.postalCode}, {formData.country}
              </p>
            </div>

            <div className="text-cozy-wool/60 text-[11px] pt-2 border-t border-cozy-sand/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cozy-sage" />
              <span>A confirmation dispatch email has been simulated to {formData.email}.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-cozy-clay text-cozy-wool text-xs font-semibold hover:bg-cozy-sand transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-semibold shadow-xs transition-colors"
            >
              View in My Orders History
            </Link>
            <Link
              href="/catalog"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cozy-sand hover:bg-cozy-clay/60 text-cozy-wool text-xs font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Checkout Header & Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cozy-sand gap-4">
        <div>
          <Link href="/cart" className="text-xs text-cozy-terracotta hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Basket
          </Link>
          <h1 className="font-serif text-3xl font-bold text-cozy-charcoal">
            Secure Studio Checkout
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-cozy-terracotta text-white' : 'bg-cozy-sand text-cozy-wool/60'}`}>
            1. Shipping
          </span>
          <span className="text-cozy-clay">→</span>
          <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-cozy-terracotta text-white' : 'bg-cozy-sand text-cozy-wool/60'}`}>
            2. Delivery
          </span>
          <span className="text-cozy-clay">→</span>
          <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-cozy-terracotta text-white' : 'bg-cozy-sand text-cozy-wool/60'}`}>
            3. Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Interactive Multi-Step Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Demo Pre-fill banner */}
          <div className="bg-cozy-sand/50 p-4 rounded-2xl border border-cozy-clay/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cozy-wool">
              <Sparkles className="w-4 h-4 text-cozy-mustard" />
              <span>Testing checkout? Click to auto-fill sample knitter info.</span>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="px-3 py-1.5 rounded-lg bg-white border border-cozy-clay text-xs font-semibold text-cozy-terracotta hover:bg-cozy-terracotta hover:text-white transition-colors shadow-2xs"
            >
              Fill Demo Data
            </button>
          </div>

          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cozy-sand shadow-xs space-y-5">
              <h2 className="font-serif text-xl font-bold text-cozy-charcoal flex items-center gap-2">
                <Package className="w-5 h-5 text-cozy-terracotta" />
                <span>1. Shipping & Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cozy-wool mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street name and house/flat number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cozy-wool mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-white text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Norway">Norway</option>
                  <option value="Sweden">Sweden</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-semibold transition-all shadow-xs"
                >
                  Continue to Delivery Method →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Method */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cozy-sand shadow-xs space-y-5">
              <h2 className="font-serif text-xl font-bold text-cozy-charcoal flex items-center gap-2">
                <Truck className="w-5 h-5 text-cozy-sage" />
                <span>2. Choose Delivery Method</span>
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.shippingMethod === 'standard'
                      ? 'border-cozy-terracotta bg-cozy-terracotta-light ring-2 ring-cozy-terracotta/20'
                      : 'border-cozy-clay bg-white hover:bg-cozy-sand/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                      className="accent-cozy-terracotta"
                    />
                    <div>
                      <strong className="text-xs text-cozy-charcoal block">
                        Standard Studio Shipping (3-5 business days)
                      </strong>
                      <span className="text-[11px] text-cozy-wool/60">
                        Carefully rolled in biodegradable glassine paper
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-serif font-bold text-cozy-charcoal">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.shippingMethod === 'express'
                      ? 'border-cozy-terracotta bg-cozy-terracotta-light ring-2 ring-cozy-terracotta/20'
                      : 'border-cozy-clay bg-white hover:bg-cozy-sand/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleChange}
                      className="accent-cozy-terracotta"
                    />
                    <div>
                      <strong className="text-xs text-cozy-charcoal block">
                        Priority Express Studio Delivery (1-2 business days)
                      </strong>
                      <span className="text-[11px] text-cozy-wool/60">
                        Fastest dispatch with direct tracking alerts
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-serif font-bold text-cozy-charcoal">
                    ${(shippingFee + 8.00).toFixed(2)}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-cozy-clay text-cozy-wool text-xs font-medium hover:bg-cozy-sand"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-semibold transition-all shadow-xs"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Simulation */}
          {step === 3 && (
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 sm:p-8 border border-cozy-sand shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-cozy-sand pb-4">
                <h2 className="font-serif text-xl font-bold text-cozy-charcoal flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cozy-terracotta" />
                  <span>3. Payment Simulation</span>
                </h2>
                <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                  Test Sandbox Mode Active
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">Name on Card</label>
                  <input
                    type="text"
                    required
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="•••• •••• •••• ••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs font-mono focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                    <CreditCard className="w-4 h-4 text-cozy-wool/40 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cozy-wool mb-1">Expiration</label>
                    <input
                      type="text"
                      required
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs font-mono focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cozy-wool mb-1">Security CVC</label>
                    <input
                      type="text"
                      required
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      placeholder="CVC"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs font-mono focus:ring-1 focus:ring-cozy-terracotta focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cozy-cream border border-cozy-sand text-[11px] text-cozy-wool/70 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cozy-sage shrink-0" />
                <span>This is a simulated sandbox checkout. No actual credit card charge will occur.</span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-cozy-clay text-cozy-wool text-xs font-medium hover:bg-cozy-sand"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white text-xs font-bold transition-all shadow-md hover:shadow-warm flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay ${finalTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-cozy-sand shadow-xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-cozy-charcoal border-b border-cozy-sand pb-3">
              Items in Your Order ({items.length})
            </h3>

            <div className="max-h-80 overflow-y-auto space-y-3 divide-y divide-cozy-sand/60 pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-cozy-sand/60 shrink-0 border border-cozy-sand">
                      <Image src={item.product.image_url} alt={item.product.title} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold text-cozy-charcoal line-clamp-1 block">
                        {item.product.title}
                      </span>
                      <span className="text-[11px] text-cozy-wool/60">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-cozy-charcoal">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-cozy-wool/80 pt-3 border-t border-cozy-sand">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-cozy-charcoal">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo ({promoCode})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({formData.shippingMethod})</span>
                <span className="font-semibold text-cozy-charcoal">
                  {finalShippingFee === 0 ? 'FREE' : `$${finalShippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-cozy-charcoal pt-3 border-t border-cozy-sand">
                <span className="font-serif">Total Due</span>
                <span className="font-serif text-xl text-cozy-terracotta">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
