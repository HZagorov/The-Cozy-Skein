'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Order } from '@/types';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  RotateCcw, 
  User, 
  MapPin, 
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function AccountPage() {
  const { user, openAuthModal, logout } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cozy-sand flex items-center justify-center mx-auto text-cozy-terracotta">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-cozy-charcoal">
            Customer Account & Order History
          </h1>
          <p className="text-xs text-cozy-wool/70 mt-1">
            Please sign in to view your past skein orders, live fulfillment status, and profile details.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3.5 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-xs transition-all shadow-md"
          >
            Sign In to Your Account
          </button>
          <div className="p-3 bg-cozy-sand/50 rounded-xl border border-cozy-clay text-[11px] text-cozy-wool/70">
            Tip: You can use our demo test account: <strong>emma@knitlover.com</strong> (pass: <strong>password123</strong>)
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case 'Knitting in Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900">
            <Sparkles className="w-3 h-3" /> Knitting & Packing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800">
            <Clock className="w-3 h-3" /> Order Received
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cozy-sand shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cozy-terracotta text-white flex items-center justify-center font-serif text-2xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-cozy-charcoal">
                {user.name}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cozy-sand text-cozy-wool">
                Knitting Guild Member
              </span>
            </div>
            <p className="text-xs text-cozy-wool/60 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-cozy-terracotta-light border border-cozy-terracotta/30 text-cozy-terracotta text-xs font-semibold hover:bg-cozy-terracotta/10 transition-colors"
            >
              Go to Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl border border-cozy-clay text-cozy-wool hover:bg-cozy-sand text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-cozy-sand pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-cozy-charcoal flex items-center gap-2">
              <Package className="w-6 h-6 text-cozy-terracotta" />
              <span>Your Orders & Project Backlog</span>
            </h2>
            <p className="text-xs text-cozy-wool/70 mt-0.5">
              Review fulfillment updates, shipping tracking, and order receipts.
            </p>
          </div>
          <span className="text-xs font-bold text-cozy-wool bg-cozy-sand px-3 py-1 rounded-full">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-40 border border-cozy-sand" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-cozy-sand space-y-4">
            <Package className="w-12 h-12 text-cozy-wool/40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
              No orders placed yet
            </h3>
            <p className="text-xs text-cozy-wool/60 max-w-sm mx-auto">
              Ready to start your next knitting adventure? Discover our latest batch of small-batch botanical dyed yarns.
            </p>
            <Link
              href="/catalog"
              className="inline-block px-5 py-2.5 rounded-xl bg-cozy-terracotta text-white text-xs font-semibold"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-cozy-sand overflow-hidden shadow-xs divide-y divide-cozy-sand"
              >
                {/* Order Top Bar */}
                <div className="p-5 sm:p-6 bg-cozy-cream/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <span className="text-cozy-wool/60 block text-[11px]">Order Reference</span>
                      <strong className="font-serif font-bold text-cozy-charcoal text-sm">
                        {order.id}
                      </strong>
                    </div>
                    <div>
                      <span className="text-cozy-wool/60 block text-[11px]">Placed On</span>
                      <span className="font-medium text-cozy-wool">
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-cozy-wool/60 block text-[11px]">Total Paid</span>
                      <span className="font-serif font-bold text-cozy-charcoal text-sm">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    {order.tracking_number && (
                      <span className="text-[11px] font-mono bg-cozy-sand text-cozy-wool px-2.5 py-1 rounded-lg">
                        {order.tracking_number}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="p-5 sm:p-6 space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-cozy-sand/50 shrink-0 border border-cozy-sand">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-cozy-charcoal">
                            {item.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-[11px] text-cozy-wool/70 mt-0.5">
                            {item.selected_color && <span>Shade: <strong>{item.selected_color}</strong></span>}
                            {item.selected_size && <span>Size: <strong>{item.selected_size}</strong></span>}
                            <span>Qty: <strong>{item.quantity}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-sm font-bold text-cozy-charcoal block">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-cozy-wool/60">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping summary footer */}
                <div className="px-5 py-3.5 bg-cozy-sand/30 flex flex-wrap items-center justify-between gap-3 text-xs text-cozy-wool/70">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cozy-sage" />
                    <span>
                      Delivered to {order.shipping_address?.addressLine1}, {order.shipping_address?.city}, {order.shipping_address?.state}
                    </span>
                  </div>
                  <Link
                    href={`/catalog`}
                    className="text-cozy-terracotta hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Browse companion yarn</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
