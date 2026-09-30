import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Heart, Shield, Scissors, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Our Studio Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cozy-charcoal tracking-tight leading-tight">
          Where Pasture Fleeces Meet Botanical Dye Vats
        </h1>
        <p className="text-base text-cozy-wool/80 leading-relaxed">
          The Cozy Skein began as a quiet counter-movement to mass-produced synthetic clothing. We believe that what touches your skin should be born of the earth and crafted with human care.
        </p>
      </div>

      {/* Two Column Story with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-6 relative aspect-4/5 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <Image
            src="https://images.unsplash.com/photo-1528458876885-5b6eacdd3671?auto=format&fit=crop&w=1000&q=80"
            alt="Hand-dyeing wool skeins"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cozy-sage">
              The Botanical Alchemy
            </span>
            <h2 className="font-serif text-3xl font-bold text-cozy-charcoal">
              Color Grown from Rain, Soil, and Sun
            </h2>
          </div>

          <p className="text-sm text-cozy-wool/80 leading-relaxed">
            Every skein in our studio is steeped in gentle botanical baths. We forage seasonal oak galls for rich graphite tones, simmer avocado stones for warm blush roses, brew madder root for deep terracotta reds, and dip our highland wool into living indigo reduction vats.
          </p>

          <p className="text-sm text-cozy-wool/80 leading-relaxed">
            Unlike synthetic chemical dyes that coat fibers in rigid films, botanical dyes enter the wool cell walls. The resulting colors are complex, living, and interact beautifully with daylight.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-cozy-sand/50 border border-cozy-clay/40">
              <span className="font-serif text-xl font-bold text-cozy-charcoal block">0%</span>
              <span className="text-xs text-cozy-wool/70">Petrochemical Synthetics</span>
            </div>
            <div className="p-4 rounded-2xl bg-cozy-sand/50 border border-cozy-clay/40">
              <span className="font-serif text-xl font-bold text-cozy-charcoal block">100%</span>
              <span className="text-xs text-cozy-wool/70">Animal Welfare Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-cozy-sand shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif text-2xl font-bold text-cozy-charcoal">
            Our Studio Commitments
          </h3>
          <p className="text-xs text-cozy-wool/70">
            Three principles that guide every fleece we spin and every accessory we knit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-cozy-wool/80 leading-relaxed">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cozy-terracotta/10 text-cozy-terracotta flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-cozy-charcoal">
              Ethical Pasture Partnerships
            </h4>
            <p>
              We source directly from family-run farms in the Andean highlands and Scottish borders where sheep graze outdoors year-round and mulesing is strictly forbidden.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cozy-sage/10 text-cozy-sage flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-cozy-charcoal">
              Circular & Compostable
            </h4>
            <p>
              Pure natural wool is completely biodegradable. When an heirloom piece eventually reaches the end of its decades of life, it returns harmlessly to the earth as natural fertilizer.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cozy-mustard/15 text-cozy-mustard flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-cozy-charcoal">
              Heirloom Craftsmanship
            </h4>
            <p>
              Our hand-knit accessories are created with time-tested stitch patterns like double-rib brims and traditional honeycomb cabling to guarantee shape retention and durability.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Founder / Dyers */}
      <div className="text-center pt-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-xs shadow-md transition-all"
        >
          <span>Explore the Studio Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
