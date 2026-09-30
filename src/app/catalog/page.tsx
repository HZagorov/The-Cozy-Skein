'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedWeight, setSelectedWeight] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(300);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL category param if it changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Fetch categories & initial products
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ]);
        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData.categories || []);
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const yarnWeights = ['Lace', 'Fingering', 'DK', 'Worsted', 'Chunky'];

  // Client-side filtering for fast instant feedback
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
          return false;
        }
        // Yarn Weight
        if (selectedWeight !== 'all') {
          if (!p.yarn_weight || !p.yarn_weight.toLowerCase().includes(selectedWeight.toLowerCase())) {
            return false;
          }
        }
        // In stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        // Price max
        if (p.price > priceRange) {
          return false;
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFiber = p.fiber_type?.toLowerCase().includes(q) || false;
          const matchWeight = p.yarn_weight?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchDesc && !matchFiber && !matchWeight) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'rating') return b.rating - a.rating;
        if (sortOption === 'newest') return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedWeight, inStockOnly, priceRange, searchQuery, sortOption]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedWeight('all');
    setSearchQuery('');
    setInStockOnly(false);
    setPriceRange(300);
    setSortOption('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedWeight !== 'all' ||
    searchQuery !== '' ||
    inStockOnly ||
    priceRange < 300;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-cozy-sand">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Complete Studio Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cozy-charcoal mt-1">
              Artisanal Yarns & Handknits
            </h1>
            <p className="text-sm text-cozy-wool/70 mt-1 max-w-xl">
              Natural fibers hand-dyed in small batches alongside heirloom pieces knitted with patient hands.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-cozy-wool/40 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search fibers, skeins, stitches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-cozy-clay/60 bg-white text-xs text-cozy-charcoal focus:outline-none focus:ring-2 focus:ring-cozy-terracotta shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-cozy-wool/40 hover:text-cozy-wool"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Filters + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-7">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-cozy-charcoal flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cozy-terracotta" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-cozy-terracotta hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-cozy-wool mb-3">
              Categories
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-cozy-terracotta text-white font-semibold shadow-2xs'
                    : 'text-cozy-wool hover:bg-cozy-sand/80'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.id
                      ? 'bg-cozy-terracotta text-white font-semibold shadow-2xs'
                      : 'text-cozy-wool hover:bg-cozy-sand/80'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Yarn Weight Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-cozy-wool mb-3">
              Yarn Weight
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedWeight('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedWeight === 'all'
                    ? 'bg-cozy-charcoal text-white border-cozy-charcoal'
                    : 'bg-white text-cozy-wool border-cozy-clay hover:bg-cozy-sand'
                }`}
              >
                All Weights
              </button>
              {yarnWeights.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedWeight === w
                      ? 'bg-cozy-charcoal text-white border-cozy-charcoal'
                      : 'bg-white text-cozy-wool border-cozy-clay hover:bg-cozy-sand'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-cozy-wool">
                Max Price
              </h4>
              <span className="text-xs font-serif font-bold text-cozy-charcoal">
                ${priceRange}
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="300"
              step="5"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-cozy-terracotta cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-cozy-wool/50 mt-1">
              <span>$15</span>
              <span>$300</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-cozy-sand">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-cozy-terracotta focus:ring-cozy-terracotta accent-cozy-terracotta"
              />
              <span className="text-xs font-medium text-cozy-wool">In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <main className="lg:col-span-3">
          
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-cozy-sand gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-cozy-clay text-xs font-semibold text-cozy-wool shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-cozy-terracotta" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              <span className="text-xs font-medium text-cozy-wool/70">
                Showing <strong className="text-cozy-charcoal">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'creation' : 'creations'}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-cozy-wool/60">Sort by:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="pl-3 pr-8 py-1.5 rounded-xl border border-cozy-clay/60 bg-white text-xs font-semibold text-cozy-wool focus:outline-none focus:ring-1 focus:ring-cozy-terracotta appearance-none cursor-pointer"
                >
                  <option value="featured">Featured & Best Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Releases</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-cozy-wool/60 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-cozy-wool/50">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-cozy-sand border border-cozy-clay text-cozy-wool font-medium">
                  {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3 text-cozy-wool/60 hover:text-cozy-wool" />
                  </button>
                </span>
              )}
              {selectedWeight !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-cozy-sand border border-cozy-clay text-cozy-wool font-medium">
                  Weight: {selectedWeight}
                  <button onClick={() => setSelectedWeight('all')}>
                    <X className="w-3 h-3 text-cozy-wool/60 hover:text-cozy-wool" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-cozy-sand border border-cozy-clay text-cozy-wool font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 text-cozy-wool/60 hover:text-cozy-wool" />
                  </button>
                </span>
              )}
              {priceRange < 300 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-cozy-sand border border-cozy-clay text-cozy-wool font-medium">
                  Under ${priceRange}
                  <button onClick={() => setPriceRange(300)}>
                    <X className="w-3 h-3 text-cozy-wool/60 hover:text-cozy-wool" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-cozy-sand border border-cozy-clay text-cozy-wool font-medium">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3 text-cozy-wool/60 hover:text-cozy-wool" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-cozy-sand h-80 space-y-3">
                  <div className="bg-cozy-sand/60 rounded-xl h-48 w-full" />
                  <div className="bg-cozy-sand/60 h-4 rounded w-3/4" />
                  <div className="bg-cozy-sand/60 h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cozy-sand space-y-4">
              <div className="w-16 h-16 rounded-full bg-cozy-sand flex items-center justify-center mx-auto text-cozy-wool/40">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cozy-charcoal">
                No skeins or accessories found
              </h3>
              <p className="text-xs text-cozy-wool/60 max-w-sm mx-auto">
                We couldn&apos;t find anything matching your exact filter criteria. Try expanding your price range or clearing selected categories.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-cozy-terracotta text-white font-semibold text-xs shadow-xs hover:bg-cozy-terracotta-dark transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-cozy-charcoal/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-cozy-sand pb-4">
              <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
                Filters
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-cozy-wool/60 hover:text-cozy-wool"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-cozy-wool mb-2">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                    selectedCategory === 'all' ? 'bg-cozy-terracotta text-white font-semibold' : 'text-cozy-wool hover:bg-cozy-sand'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      selectedCategory === c.id ? 'bg-cozy-terracotta text-white font-semibold' : 'text-cozy-wool hover:bg-cozy-sand'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Weights */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-cozy-wool mb-2">Yarn Weight</h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedWeight('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    selectedWeight === 'all' ? 'bg-cozy-charcoal text-white' : 'bg-white text-cozy-wool'
                  }`}
                >
                  All
                </button>
                {yarnWeights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      selectedWeight === w ? 'bg-cozy-charcoal text-white' : 'bg-white text-cozy-wool'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-cozy-terracotta accent-cozy-terracotta"
                />
                <span className="text-xs font-medium text-cozy-wool">In Stock Only</span>
              </label>
            </div>

            {/* Apply button */}
            <div className="pt-4 border-t border-cozy-sand">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-cozy-terracotta text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
