'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, Heart, Shield, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cozy-wool text-cozy-cream border-t border-cozy-charcoal/20">
      {/* Top Banner / Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-cozy-mustard text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" />
                Join the Wool Gathering
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Receive 10% off your first skein
              </h3>
              <p className="mt-2 text-sm text-cozy-cream/70 max-w-md">
                Get early notifications for limited botanical dye batches, complimentary seasonal patterns, and knitting studio diaries.
              </p>
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to our studio letters! Check your email for your 10% code: WARMTH10');
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md lg:ml-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-cozy-cream/40 text-sm focus:outline-none focus:ring-2 focus:ring-cozy-mustard flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cozy-terracotta flex items-center justify-center text-white">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                The Cozy Skein
              </span>
            </div>
            <p className="text-sm text-cozy-cream/70 leading-relaxed pr-4">
              We are an independent fiber studio dedicated to hand-dyed natural yarns and heirloom hand-knitted pieces. Sourced with respect for animals, dyed with botanicals, and knitted stitch by stitch.
            </p>
            <div className="flex items-center gap-4 text-xs text-cozy-mustard">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" /> 100% Non-Mulesed Wool
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> Hand-Finished in Studio
              </span>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-cozy-mustard mb-4">
              Boutique Collection
            </h4>
            <ul className="space-y-2.5 text-sm text-cozy-cream/70">
              <li>
                <Link href="/catalog?category=yarns" className="hover:text-white transition-colors">
                  Hand-Dyed Yarns
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=beanies" className="hover:text-white transition-colors">
                  Beanies & Headbands
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sweaters" className="hover:text-white transition-colors">
                  Heirloom Sweaters
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=scarves" className="hover:text-white transition-colors">
                  Scarves & Shawls
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=mittens" className="hover:text-white transition-colors">
                  Mittens & Socks
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=tools" className="hover:text-white transition-colors">
                  Rosewood Needles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Knitter Resources */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-cozy-mustard mb-4">
              Knitter Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-cozy-cream/70">
              <li>
                <Link href="/knitting-guide" className="hover:text-white transition-colors">
                  Yarn Weight Guide
                </Link>
              </li>
              <li>
                <Link href="/knitting-guide#care" className="hover:text-white transition-colors">
                  Wool Washing & Care
                </Link>
              </li>
              <li>
                <Link href="/knitting-guide#gauge" className="hover:text-white transition-colors">
                  Gauge & Needle Sizing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Botanical Dye Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Support */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-cozy-mustard mb-4">
              Studio & Account
            </h4>
            <ul className="space-y-2.5 text-sm text-cozy-cream/70">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  View Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li className="text-xs text-cozy-cream/50 pt-2">
                Questions? hello@thecozyskein.com
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cozy-cream/50 gap-4">
          <p>© {new Date().getFullYear()} The Cozy Skein. Handcrafted with love & pure natural wool.</p>
          <div className="flex gap-6">
            <span>Free Shipping Over $75</span>
            <span>Plastic-Free Recyclable Packaging</span>
            <span>Crafted with Next.js & SQLite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
