'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(
    product.color_options?.[0]?.name || ''
  );
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedColor, product.size_options?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-cozy-sand/80 overflow-hidden shadow-xs hover:shadow-soft transition-all duration-300">
      {/* Image & Badges */}
      <Link href={`/products/${product.slug}`} className="relative aspect-4/5 overflow-hidden bg-cozy-sand/30 block">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_new && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-cozy-sage text-white shadow-xs">
              New Batch
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-cozy-terracotta text-white shadow-xs">
              Save {discountPercent}%
            </span>
          )}
          {product.stock <= 8 && product.stock > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-200 text-stone-700 shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Add Overlay on hover for desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-cozy-charcoal hover:bg-cozy-terracotta text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Basket</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Fiber & Specs */}
          <div className="flex items-center justify-between text-xs text-cozy-wool/60 mb-1.5 font-medium">
            <span className="truncate">{product.yarn_weight || product.fiber_type}</span>
            <div className="flex items-center gap-1 text-cozy-mustard shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-cozy-wool font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-cozy-wool/40">({product.review_count})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-base sm:text-lg font-bold text-cozy-charcoal group-hover:text-cozy-terracotta transition-colors line-clamp-1"
          >
            {product.title}
          </Link>

          {/* Color swatches */}
          {product.color_options && product.color_options.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.color_options.slice(0, 4).map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(c.name);
                  }}
                  title={c.name}
                  className={`w-4 h-4 rounded-full border transition-transform ${
                    selectedColor === c.name
                      ? 'ring-2 ring-cozy-terracotta ring-offset-1 scale-110 border-white'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.color_options.length > 4 && (
                <span className="text-[11px] text-cozy-wool/50 font-medium ml-1">
                  +{product.color_options.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Mobile Add */}
        <div className="mt-4 pt-3 border-t border-cozy-sand flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-cozy-charcoal">
              ${product.price.toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-cozy-wool/40 line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Mobile direct button */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`sm:hidden p-2 rounded-lg text-xs font-medium transition-colors ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-cozy-sand hover:bg-cozy-terracotta hover:text-white text-cozy-wool'
            }`}
            aria-label="Add to cart"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
