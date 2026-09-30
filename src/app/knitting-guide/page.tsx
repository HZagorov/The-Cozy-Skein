import React from 'react';
import Link from 'next/link';
import { 
  Scissors, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Droplets, 
  Maximize2, 
  CheckCircle2 
} from 'lucide-react';

export default function KnittingGuidePage() {
  const weightStandards = [
    {
      category: '0 - Lace',
      names: 'Fingering 10-count, Crochet thread, Gossamer',
      gauge: '33-40 sts per 4"',
      needles: 'US 000 - 1 (1.5 - 2.25mm)',
      bestFor: 'Airy lace shawls, bridal veils, ethereal heirloom wraps',
    },
    {
      category: '1 - Super Fine / Fingering',
      names: 'Sock, Baby, 4-Ply',
      gauge: '27-32 sts per 4"',
      needles: 'US 1 - 3 (2.25 - 3.25mm)',
      bestFor: 'Handknit socks, lightweight cardigans, baby blankets, shawls',
    },
    {
      category: '2 - Fine / Sport',
      names: 'Baby, 5-Ply',
      gauge: '23-26 sts per 4"',
      needles: 'US 3 - 5 (3.25 - 3.75mm)',
      bestFor: 'Traditional Norwegian Selbu colorwork, textured mittens, light sweaters',
    },
    {
      category: '3 - Light / DK',
      names: 'Double Knitting, Light Worsted, 8-Ply',
      gauge: '21-24 sts per 4"',
      needles: 'US 5 - 7 (3.75 - 4.5mm)',
      bestFor: 'All-around sweaters, beanies, baby wear, cozy scarves',
    },
    {
      category: '4 - Medium / Worsted',
      names: 'Aran, Afghan, 10-Ply',
      gauge: '16-20 sts per 4"',
      needles: 'US 7 - 9 (4.5 - 5.5mm)',
      bestFor: 'Classic cable fisherman sweaters, warm blankets, thick beanies',
    },
    {
      category: '5 - Bulky / Chunky',
      names: 'Craft, Rug, 12-Ply',
      gauge: '12-15 sts per 4"',
      needles: 'US 9 - 11 (5.5 - 8.0mm)',
      bestFor: 'Fast winter projects, chunky scarves, cozy slippers, oversized cardigans',
    },
    {
      category: '6 - Super Bulky',
      names: 'Roving, Arm-Knit, Jumbo',
      gauge: '7-11 sts per 4"',
      needles: 'US 11 - 17 (8.0 - 12.75mm)',
      bestFor: 'Cloud throw blankets, statement cushions, 2-hour cowl scarves',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-cozy-terracotta flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Knitter&apos;s Field Handbook
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cozy-charcoal tracking-tight">
          Yarn Weights, Gauge & Fiber Care
        </h1>
        <p className="text-sm text-cozy-wool/70 leading-relaxed">
          Everything you need to plan your project with confidence, select needle sizes, and preserve the life of pure natural wool.
        </p>
      </div>

      {/* Weight Chart Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cozy-sand shadow-xs space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-cozy-charcoal">
            Standard Yarn Weight Classification Chart
          </h2>
          <p className="text-xs text-cozy-wool/70 mt-1">
            Reference standard definitions according to the Craft Yarn Council (CYC).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cozy-cream/80 border-b border-cozy-sand uppercase text-[11px] font-semibold text-cozy-wool/70">
              <tr>
                <th className="p-3.5">CYC Classification</th>
                <th className="p-3.5">Common Aliases</th>
                <th className="p-3.5">Standard Gauge (in 4&quot;)</th>
                <th className="p-3.5">Recommended Needle</th>
                <th className="p-3.5">Ideal Project Types</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cozy-sand">
              {weightStandards.map((w, idx) => (
                <tr key={idx} className="hover:bg-cozy-sand/20 transition-colors">
                  <td className="p-3.5 font-bold text-cozy-charcoal">{w.category}</td>
                  <td className="p-3.5 text-cozy-wool">{w.names}</td>
                  <td className="p-3.5 font-mono text-cozy-terracotta font-semibold">{w.gauge}</td>
                  <td className="p-3.5 text-cozy-wool/80">{w.needles}</td>
                  <td className="p-3.5 text-cozy-wool/70">{w.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gauge & Swatching Guide */}
      <section id="gauge" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-cozy-sage flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4" /> Golden Rule of Fit
          </span>
          <h2 className="font-serif text-3xl font-bold text-cozy-charcoal">
            Why You Should Always Knit a Swatch
          </h2>
          <p className="text-sm text-cozy-wool/80 leading-relaxed">
            Knitting tension is as unique as your handwriting. Two knitters using the exact same US 6 needles and merino yarn can produce sweaters that differ by several inches!
          </p>
          <ul className="space-y-2.5 text-xs text-cozy-wool/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cozy-sage shrink-0 mt-0.5" />
              <span>Cast on 6 to 8 stitches more than your pattern gauge suggests.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cozy-sage shrink-0 mt-0.5" />
              <span>Wash and block your swatch exactly the way you plan to treat the finished garment.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cozy-sage shrink-0 mt-0.5" />
              <span>Measure across 4 inches (10cm) in the center, counting both stitches and rows.</span>
            </li>
          </ul>
        </div>

        <div className="bg-cozy-cream p-8 rounded-3xl border border-cozy-sand space-y-4">
          <h3 className="font-serif text-lg font-bold text-cozy-charcoal">
            Troubleshooting Gauge
          </h3>
          <div className="space-y-3 text-xs text-cozy-wool/80">
            <div className="p-3.5 rounded-2xl bg-white border border-cozy-sand">
              <strong className="text-cozy-charcoal block mb-0.5">Too few stitches per 4&quot;?</strong>
              Your knitting is looser than the designer intended. Go down one needle size (e.g. from US 7 to US 6).
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-cozy-sand">
              <strong className="text-cozy-charcoal block mb-0.5">Too many stitches per 4&quot;?</strong>
              Your knitting is tighter. Go up one needle size (e.g. from US 6 to US 7).
            </div>
          </div>
        </div>
      </section>

      {/* Wool Care & Blocking Guide */}
      <section id="care" className="bg-white rounded-3xl p-6 sm:p-10 border border-cozy-sand shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cozy-sage/10 text-cozy-sage flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-cozy-charcoal">
              Wool Washing & Gentle Blocking Care
            </h2>
            <p className="text-xs text-cozy-wool/70">
              Natural animal fibers have natural lanolin and self-cleaning properties.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-cozy-wool/80">
          <div className="p-5 rounded-2xl bg-cozy-cream border border-cozy-sand space-y-2">
            <span className="font-serif text-base font-bold text-cozy-charcoal block">
              1. The Soak
            </span>
            <p className="leading-relaxed">
              Submerge in lukewarm water with a no-rinse wool wash (like Eucalan). Never agitate, rub, or expose to sudden temperature changes to avoid felting. Soak for 15-20 minutes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cozy-cream border border-cozy-sand space-y-2">
            <span className="font-serif text-base font-bold text-cozy-charcoal block">
              2. The Towel Burrito
            </span>
            <p className="leading-relaxed">
              Lift the piece gently supporting its weight. Never wring out! Place on a clean towel, roll up like a burrito, and press firmly with your hands or knees to expel excess moisture.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cozy-cream border border-cozy-sand space-y-2">
            <span className="font-serif text-base font-bold text-cozy-charcoal block">
              3. Reshaping & Dry Flat
            </span>
            <p className="leading-relaxed">
              Lay flat on blocking mats or a dry towel. Gently nudge stitches into target dimensions. Pin lace edges if blocking openwork shawls. Allow to dry completely away from direct sunlight.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-cozy-terracotta hover:bg-cozy-terracotta-dark text-white font-semibold text-xs shadow-md transition-colors"
        >
          <span>Find Yarn for Your Next Cast-On</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
