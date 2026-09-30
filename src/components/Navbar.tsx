'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ShieldCheck, 
  Package, 
  LogOut,
  Scissors
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', href: '/catalog' },
    { label: 'Artisanal Yarns', href: '/catalog?category=yarns' },
    { label: 'Beanies & Headwear', href: '/catalog?category=beanies' },
    { label: 'Sweaters & Wraps', href: '/catalog?category=sweaters' },
    { label: 'Knitting Guide', href: '/knitting-guide' },
    { label: 'Our Story', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cozy-sand/80 shadow-xs transition-all">
      {/* Announcement Bar */}
      <div className="bg-cozy-wool text-cozy-cream text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cozy-mustard animate-pulse" />
        <span>Ethically sourced, small-batch natural fibers. Free standard shipping over $75 with code <span className="font-bold underline decoration-cozy-mustard">WARMTH10</span></span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-cozy-wool hover:bg-cozy-sand transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Tagline */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-cozy-terracotta/10 border border-cozy-terracotta/20 flex items-center justify-center text-cozy-terracotta group-hover:bg-cozy-terracotta group-hover:text-white transition-all duration-300 shadow-xs">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-2xl font-bold tracking-tight text-cozy-charcoal group-hover:text-cozy-terracotta transition-colors">
                  The Cozy Skein
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cozy-sage font-medium -mt-1">
                  Artisanal Yarns & Handknits
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-cozy-terracotta ${
                    isActive ? 'text-cozy-terracotta font-semibold' : 'text-cozy-wool/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Search Link */}
            <Link
              href="/catalog"
              className="p-2 text-cozy-wool/80 hover:text-cozy-terracotta hover:bg-cozy-sand/60 rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* User Account / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-cozy-sand/60 hover:bg-cozy-sand border border-cozy-clay/40 transition-colors text-xs font-medium text-cozy-wool"
                  >
                    <div className="w-6 h-6 rounded-full bg-cozy-terracotta text-white flex items-center justify-center text-xs font-semibold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-cozy-wool/60" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-cozy-sand py-2 z-50 text-sm"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-cozy-sand text-xs text-cozy-wool/60">
                        Signed in as <strong className="text-cozy-wool block truncate">{user.email}</strong>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-cozy-terracotta-light text-cozy-terracotta font-medium transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-cozy-sand text-cozy-wool transition-colors"
                      >
                        <Package className="w-4 h-4 text-cozy-sage" />
                        My Orders & Profile
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-cozy-sand hover:bg-cozy-clay/60 text-xs font-semibold text-cozy-wool transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-cozy-terracotta" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-cozy-terracotta text-white hover:bg-cozy-terracotta-dark transition-all duration-200 shadow-sm hover:shadow"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cozy-mustard text-cozy-charcoal font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cozy-sand bg-cozy-cream px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-cozy-wool hover:bg-cozy-sand transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-cozy-clay/30 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-cozy-wool bg-white border border-cozy-sand"
                >
                  <Package className="w-4 h-4 text-cozy-sage" />
                  My Orders & Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-cozy-terracotta bg-cozy-terracotta-light"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-cozy-terracotta text-white font-medium text-sm text-center shadow-xs"
              >
                Sign In / Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
