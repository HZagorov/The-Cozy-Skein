'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { X, Sparkles, Shield, User, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    register,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in');
        }
      } else {
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);
    login(demoEmail, demoPass).then((res) => {
      setLoading(false);
      if (!res.success) setError(res.error || 'Login failed');
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-cozy-charcoal/50 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-cozy-sand overflow-hidden">
          
          {/* Header */}
          <div className="bg-cozy-cream px-6 pt-6 pb-4 border-b border-cozy-sand relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1.5 rounded-full text-cozy-wool/50 hover:text-cozy-wool hover:bg-cozy-sand transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-cozy-terracotta text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Cozy Skein Collective</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-cozy-charcoal">
              {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className="text-xs text-cozy-wool/70 mt-1">
              {authModalMode === 'login'
                ? 'Sign in to access your order history and saved knitting projects.'
                : 'Join our guild for exclusive color drops, project journals, and faster checkout.'}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Quick Demo Sign In Bar */}
            <div className="bg-cozy-sand/50 p-3.5 rounded-2xl border border-cozy-clay/40 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cozy-wool/60 block">
                ⚡ Quick Demo Access (1-Click Test):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('emma@knitlover.com', 'password123')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-cozy-sand border border-cozy-clay/60 text-xs font-medium text-cozy-wool flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-cozy-sage" />
                  <span>Customer (Emma)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@thecozyskein.com', 'admin123')}
                  className="px-3 py-2 rounded-xl bg-cozy-terracotta-light hover:bg-cozy-terracotta/10 border border-cozy-terracotta/30 text-xs font-medium text-cozy-terracotta flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Shield className="w-3.5 h-3.5 text-cozy-terracotta" />
                  <span>Admin (Eleanor)</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-cozy-wool/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clara Oswald"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cozy-clay/60 bg-cozy-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-cozy-terracotta"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-cozy-wool mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cozy-wool/40 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cozy-clay/60 bg-cozy-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-cozy-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cozy-wool mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cozy-wool/40 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cozy-clay/60 bg-cozy-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-cozy-terracotta"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-sm transition-all shadow-md hover:shadow-warm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : authModalMode === 'login' ? (
                  'Sign In'
                ) : (
                  'Join The Cozy Skein'
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-2 border-t border-cozy-sand text-xs text-cozy-wool/70">
              {authModalMode === 'login' ? (
                <p>
                  Do not have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      openAuthModal('register');
                    }}
                    className="text-cozy-terracotta font-semibold hover:underline"
                  >
                    Create one now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      openAuthModal('login');
                    }}
                    className="text-cozy-terracotta font-semibold hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
