import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { 
  Sparkles, 
  ArrowRight, 
  Leaf, 
  Heart, 
  ShieldCheck, 
  Package, 
  Scissors,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

function getFeaturedProducts(): Product[] {
  const rows = db.prepare('SELECT * FROM products WHERE is_featured = 1 LIMIT 8').all() as any[];
  return rows.map((r) => ({
    ...r,
    is_featured: Boolean(r.is_featured),
    is_new: Boolean(r.is_new),
    secondary_images: r.secondary_images ? JSON.parse(r.secondary_images) : [],
    color_options: r.color_options ? JSON.parse(r.color_options) : [],
    size_options: r.size_options ? JSON.parse(r.size_options) : [],
  }));
}

function getCategories(): (Category & { product_count: number })[] {
  return db.prepare(`
    SELECT c.*, COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
    ORDER BY c.id ASC
  `).all() as any[];
}

export const revalidate = 0; // dynamic data

export default function HomePage() {
  const featured = getFeaturedProducts();
  const categories = getCategories();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-cozy-sand/80 bg-gradient-to-b from-cozy-sand/30 via-cozy-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cozy-terracotta-light border border-cozy-terracotta/20 text-cozy-terracotta text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Small-Batch Autumn Botanical Dye Release</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cozy-charcoal tracking-tight leading-[1.15]">
                Spun by Nature. <br />
                <span className="text-cozy-terracotta italic font-normal">Knitted by Hand.</span>
              </h1>

              <p className="text-base sm:text-lg text-cozy-wool/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong className="text-cozy-wool">The Cozy Skein</strong> — an independent fiber studio crafting ethically sourced hand-dyed yarns and heirloom accessories designed to keep you warm for a lifetime.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/catalog?category=yarns"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-sm shadow-md hover:shadow-warm transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Hand-Dyed Skeins</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/catalog?category=beanies"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-cozy-sand text-cozy-wool border border-cozy-clay font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>Shop Knitted Accessories</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-cozy-sand grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-cozy-sage shrink-0" />
                  <span className="text-xs font-medium text-cozy-wool">Botanical Dyes</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cozy-sage shrink-0" />
                  <span className="text-xs font-medium text-cozy-wool">Pure Natural Wool</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-cozy-sage shrink-0" />
                  <span className="text-xs font-medium text-cozy-wool">Eco Packaging</span>
                </div>
              </div>
            </div>

            {/* Right Hero Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Image */}
                <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1000&q=80"
                    alt="Artisanal hand-dyed skeins"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cozy-charcoal/40 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1: Hand-Dyed Tag */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-cozy-sand shadow-lg flex items-center gap-3.5 max-w-xs">
                  <div className="w-10 h-10 rounded-xl bg-cozy-sage/10 text-cozy-sage flex items-center justify-center shrink-0">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cozy-charcoal">Artisanal Cable Knitwear</h4>
                    <p className="text-[11px] text-cozy-wool/70">Over 40 hours of craft per piece</p>
                  </div>
                </div>

                {/* Floating Card 2: Merino guarantee */}
                <div className="absolute -top-4 -right-4 bg-cozy-wool text-white py-2 px-3.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>100% Merino & Alpaca</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta">
              Explore the Studio
            </span>
            <h2 className="font-serif text-3xl font-bold text-cozy-charcoal mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-cozy-terracotta hover:text-cozy-terracotta-dark flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group flex flex-col items-center bg-white rounded-2xl p-3 border border-cozy-sand hover:border-cozy-terracotta/40 hover:shadow-soft transition-all duration-300 text-center"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cozy-sand/50 mb-3">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-sm font-bold text-cozy-charcoal group-hover:text-cozy-terracotta transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-cozy-wool/60 mt-0.5">
                {cat.product_count} items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta">
              Fresh from the Needles
            </span>
            <h2 className="font-serif text-3xl font-bold text-cozy-charcoal mt-1">
              Featured Artisanal Pieces
            </h2>
            <p className="text-sm text-cozy-wool/70 mt-1">
              Hand-dyed skeins, cozy beanies, and heirloom knitwear loved by our knitting community.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-cozy-terracotta hover:text-cozy-terracotta-dark flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Artisanal Process & Values Banner */}
      <section className="bg-cozy-sand/60 border-y border-cozy-sand py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta">
              The Woolen Craft
            </span>
            <h2 className="font-serif text-3xl font-bold text-cozy-charcoal mt-1">
              Why Craft with The Cozy Skein?
            </h2>
            <p className="text-sm text-cozy-wool/70 mt-2">
              Every skein is born from pasture-raised fleece and seasoned botanical dye pots. No petrochemical synthetic dyes, no fast-fashion shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-cozy-clay/40 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cozy-terracotta/10 text-cozy-terracotta flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
                Botanical Dye Alchemy
              </h3>
              <p className="text-xs text-cozy-wool/70 leading-relaxed">
                We dye our skeins in small batches using avocado pits, madder root, indigo, and onion skins to create deep, nuanced, living colors with zero harsh runoff.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-cozy-clay/40 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cozy-sage/10 text-cozy-sage flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
                Pure Non-Mulesed Fleece
              </h3>
              <p className="text-xs text-cozy-wool/70 leading-relaxed">
                We partner exclusively with certified cruelty-free farms in Peru, the Scottish Highlands, and New Zealand. Kind to sheep, soft to human skin.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-cozy-clay/40 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cozy-mustard/15 text-cozy-mustard flex items-center justify-center">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
                Heirloom Stitches
              </h3>
              <p className="text-xs text-cozy-wool/70 leading-relaxed">
                Our accessories and sweaters are hand-knitted by skilled craftspeople. Each piece carries timeless cable and rib structures meant to pass down across generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Knitter Resources & Guide Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-cozy-wool text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-cozy-mustard flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Knitter Reference Library
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Not sure which yarn weight or needle size to pick?
            </h2>
            <p className="text-sm text-cozy-cream/80 leading-relaxed">
              Explore our comprehensive Yarn Weight & Gauge Guide — featuring yardage conversions, recommended stitch gauges, needle sizes, and gentle wool wash care instructions.
            </p>
            <div className="pt-2">
              <Link
                href="/knitting-guide"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <span>Read the Knitter's Handbook</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80"
              alt="Needles and yarn"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
