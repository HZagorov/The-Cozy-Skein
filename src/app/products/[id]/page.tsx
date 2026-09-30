'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product, ProductReview } from '@/types';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import ProductCard from '@/components/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Leaf, 
  Scissors, 
  Sparkles, 
  Heart,
  ChevronRight,
  MessageSquarePlus,
  Send
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productIdOrSlug = params.id as string;
  const { addToCart } = useCart();
  const { user, openAuthModal } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review submission form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productIdOrSlug}`);
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const data = await res.json();
        setProduct(data.product);
        setReviews(data.reviews || []);
        setRelatedProducts(data.relatedProducts || []);

        if (data.product) {
          setSelectedImage(data.product.image_url);
          if (data.product.color_options?.length > 0) {
            setSelectedColor(data.product.color_options[0].name);
          }
          if (data.product.size_options?.length > 0) {
            setSelectedSize(data.product.size_options[0]);
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }

    if (productIdOrSlug) {
      fetchProduct();
    }
  }, [productIdOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-4 bg-cozy-sand rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-4/5 bg-cozy-sand rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-cozy-sand rounded w-3/4" />
            <div className="h-6 bg-cozy-sand rounded w-1/4" />
            <div className="h-24 bg-cozy-sand rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cozy-charcoal">
          Product Not Found
        </h2>
        <p className="text-sm text-cozy-wool/70">
          We could not find this yarn or accessory in our studio records.
        </p>
        <Link
          href="/catalog"
          className="inline-block px-5 py-2.5 bg-cozy-terracotta text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.secondary_images || [])];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          authorName: reviewAuthor || user?.name,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        // Refresh product reviews
        const refresh = await fetch(`/api/products/${product.id}`);
        const freshData = await refresh.json();
        setProduct(freshData.product);
        setReviews(freshData.reviews || []);
        setReviewComment('');
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Review error', e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-cozy-wool/60">
        <Link href="/" className="hover:text-cozy-terracotta transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/catalog" className="hover:text-cozy-terracotta transition-colors">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/catalog?category=${product.category_id}`} className="capitalize hover:text-cozy-terracotta transition-colors">
          {product.category_id}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cozy-charcoal font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-cozy-sand/40 border border-cozy-sand shadow-sm">
            <Image
              src={selectedImage || product.image_url}
              alt={product.title}
              fill
              priority
              className="object-cover object-center"
            />
            {product.is_featured && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-cozy-terracotta text-white rounded-full text-xs font-semibold shadow-xs">
                Studio Favorite
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-cozy-terracotta ring-2 ring-cozy-terracotta/30 scale-102'
                      : 'border-cozy-sand hover:border-cozy-clay'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cozy-sand text-[11px] font-semibold text-cozy-wool uppercase tracking-wider">
                {product.fiber_type || 'Natural Fiber'}
              </span>
              {product.yarn_weight && (
                <span className="px-2.5 py-0.5 rounded-md bg-cozy-sage-light text-cozy-sage text-[11px] font-semibold">
                  {product.yarn_weight}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cozy-charcoal tracking-tight">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-cozy-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-cozy-clay fill-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-cozy-charcoal">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-cozy-wool/60">
                • {product.review_count} {product.review_count === 1 ? 'review' : 'craft reviews'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-cozy-sand">
            <span className="font-serif text-3xl font-bold text-cozy-charcoal">
              ${product.price.toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-base text-cozy-wool/40 line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
            {product.stock <= 8 && product.stock > 0 && (
              <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Only {product.stock} skeins left in studio
              </span>
            )}
          </div>

          {/* Story / Description */}
          <p className="text-sm text-cozy-wool/80 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.color_options && product.color_options.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-cozy-wool uppercase tracking-wider flex items-center justify-between">
                <span>Colorway / Shade</span>
                <span className="text-cozy-terracotta normal-case font-semibold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.color_options.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedColor === c.name
                        ? 'border-cozy-terracotta bg-cozy-terracotta-light ring-2 ring-cozy-terracotta/20 font-semibold'
                        : 'border-cozy-clay bg-white hover:bg-cozy-sand/50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Skein Variant Selection */}
          {product.size_options && product.size_options.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-cozy-wool uppercase tracking-wider block">
                Format / Size
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.size_options.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedSize === s
                        ? 'bg-cozy-charcoal text-white border-cozy-charcoal font-semibold shadow-xs'
                        : 'bg-white text-cozy-wool border-cozy-clay hover:bg-cozy-sand'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-cozy-clay rounded-2xl bg-white overflow-hidden p-1 shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-cozy-wool hover:bg-cozy-sand transition-colors font-bold text-base"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold text-cozy-charcoal">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-cozy-wool hover:bg-cozy-sand transition-colors font-bold text-base"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                added
                  ? 'bg-emerald-600 text-white'
                  : product.stock === 0
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white hover:shadow-warm'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Knitting Basket!</span>
                </>
              ) : product.stock === 0 ? (
                <span>Currently Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Knitting Basket • ${(product.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="bg-cozy-sand/50 rounded-2xl p-4 border border-cozy-sand space-y-2.5 text-xs text-cozy-wool/80">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-cozy-terracotta shrink-0" />
              <span>Free studio delivery across the country on orders over $75</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cozy-sage shrink-0" />
              <span>30-day skein exchange guarantee (uncut, in original skein condition)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Leaf className="w-4 h-4 text-cozy-sage shrink-0" />
              <span>Sustainably hand-dyed with plant-based botanical extracts</span>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications Grid */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cozy-sand shadow-xs">
        <h2 className="font-serif text-2xl font-bold text-cozy-charcoal mb-6">
          Knitting & Fiber Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div className="p-4 rounded-2xl bg-cozy-cream border border-cozy-sand">
            <span className="text-xs uppercase font-semibold text-cozy-wool/60 block mb-1">
              Fiber Composition
            </span>
            <span className="font-medium text-cozy-charcoal">
              {product.fiber_type || 'Natural Highland Wool'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cozy-cream border border-cozy-sand">
            <span className="text-xs uppercase font-semibold text-cozy-wool/60 block mb-1">
              Weight & Classification
            </span>
            <span className="font-medium text-cozy-charcoal">
              {product.yarn_weight || 'DK / 8-Ply'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cozy-cream border border-cozy-sand">
            <span className="text-xs uppercase font-semibold text-cozy-wool/60 block mb-1">
              Length & Put-Up
            </span>
            <span className="font-medium text-cozy-charcoal">
              {product.yardage || '230m / 251 yds per 100g'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cozy-cream border border-cozy-sand">
            <span className="text-xs uppercase font-semibold text-cozy-wool/60 block mb-1">
              Recommended Needles
            </span>
            <span className="font-medium text-cozy-charcoal">
              {product.needle_size || 'US 5-7 (3.75 - 4.5mm)'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cozy-cream border border-cozy-sand">
            <span className="text-xs uppercase font-semibold text-cozy-wool/60 block mb-1">
              Tension / Gauge
            </span>
            <span className="font-medium text-cozy-charcoal">
              {product.gauge || '21 sts x 28 rows = 4"'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cozy-cream border border-cozy-sand">
            <span className="text-xs uppercase font-semibold text-cozy-wool/60 block mb-1">
              Care Instructions
            </span>
            <span className="font-medium text-cozy-charcoal">
              {product.care_instructions || 'Hand wash cold, dry flat.'}
            </span>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Submit Review Form */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cozy-sand shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cozy-sand gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-cozy-charcoal">
              Craft Reviews & Knitter Feedback
            </h2>
            <p className="text-xs text-cozy-wool/70 mt-1">
              Real notes from crafters who have knitted, worn, and washed this creation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-bold text-cozy-charcoal">
              {product.rating.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center text-cozy-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[11px] text-cozy-wool/60">Based on {reviews.length} reviews</span>
            </div>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-cozy-wool/60 italic">
              No reviews yet. Be the first to share your knitting notes!
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-cozy-cream/60 border border-cozy-sand space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-cozy-charcoal">{r.author_name}</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                      Verified Knitter
                    </span>
                  </div>
                  <div className="flex items-center text-cozy-mustard">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-cozy-clay'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-cozy-wool/80 leading-relaxed">{r.comment}</p>
                <span className="text-[10px] text-cozy-wool/50 block">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Review Submission Form */}
        <div className="pt-6 border-t border-cozy-sand">
          <h3 className="font-serif text-lg font-bold text-cozy-charcoal mb-4 flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-cozy-terracotta" />
            <span>Leave Your Review</span>
          </h3>

          {reviewSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              Thank you! Your knitting feedback has been added.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-cozy-wool">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-cozy-mustard hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-cozy-clay'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {!user && (
                <div>
                  <label className="block text-xs font-semibold text-cozy-wool mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clara O."
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:outline-none focus:ring-1 focus:ring-cozy-terracotta"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-cozy-wool mb-1">
                  Knitting Notes & Experience
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was the drape, stitch definition, or soft touch against skin?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cozy-clay bg-cozy-cream/30 text-xs focus:outline-none focus:ring-1 focus:ring-cozy-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2.5 rounded-xl bg-cozy-charcoal hover:bg-cozy-terracotta text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Submit Review</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-cozy-charcoal">
            Companion Skeins & Accessories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
