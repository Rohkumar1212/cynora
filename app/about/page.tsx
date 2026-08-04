"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "../components/Reveal";

const VALUES = [
  {
    title: "Formulated, Not Just Filled",
    desc: "Every Cynora product starts in a small lab, not a copy-paste spreadsheet. We test concentration levels until a capful genuinely outperforms a capful of the leading brand — not just on paper, on your actual laundry pile.",
  },
  {
    title: "Safe Enough for Daily Contact",
    desc: "Homes have kids, pets, elderly parents and people with sensitive skin — often all under one roof. We dermatologically test every formula so 'family-safe' is a claim we can actually stand behind, not a sticker.",
  },
  {
    title: "Concentrated on Purpose",
    desc: "Our pouches look smaller than the giant plastic bottles you're used to — that's intentional. A concentrated formula means less water shipped, less plastic used, and a bottle that still lasts as many washes.",
  },
  {
    title: "Built for Real Households",
    desc: "We're not chasing every trend on the shelf. We picked eight categories — detergent, dish wash, floor, glass, surface, toilet, hand wash and fabric care — and decided to make each one properly instead of making fifty things averagely.",
  },
];

const TIMELINE = [
  {
    year: "The Idea",
    text: "Cynora began as a simple frustration: most 'premium' cleaning brands were either imported and overpriced, or local and inconsistent batch to batch. We wanted a third option.",
  },
  {
    year: "The Formula",
    text: "Months went into balancing surfactant ratios so our liquid detergent could handle tough stains without being harsh on fabric colour or hands — the same tension every household deals with.",
  },
  {
    year: "The Packaging",
    text: "We chose refill-style pouches over rigid bottles early on. Less plastic per wash, easier to store, and — frankly — easier on delivery costs, which we pass on as lower prices.",
  },
  {
    year: "Today",
    text: "Cynora now ships a full range of home and business cleaning essentials, built by a small team that still reads every support email personally.",
  },
];

const MISSION_VISION = [
  {
    tag: "Our Mission",
    title: "Democratizing Premium Care",
    desc: "We believe every household deserves access to high-quality, dermatologically safe cleaning products without the premium price tag. We are committed to engineering formulas that work harder, so you don't have to.",
    gradient: "from-blue-900 to-blue-950",
    reverse: false,
  },
  {
    tag: "Our Vision",
    title: "A Cleaner, Smarter Future",
    desc: "To be the most trusted name in home care—where honesty in formulation meets sustainability in packaging. We envision a future where effective cleaning leaves zero footprint on our environment.",
    gradient: "from-amber-700 to-amber-900",
    reverse: true,
  },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            The Story Behind Cynora
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We make cleaning products the way we&apos;d want to buy them
            ourselves — honestly formulated, reasonably priced, and good enough
            that you stop thinking about switching brands.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-900 to-blue-950">
              <Image
                src="/images/hero-glow.svg"
                alt="Cynora manufacturing"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-50 mix-blend-overlay"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
                <div>
                  <p className="font-serif text-3xl md:text-4xl font-bold mb-3">
                    Elevate Your Clean
                  </p>
                  <p className="text-sm md:text-base text-blue-100/90 tracking-wide uppercase font-semibold">
                    Premium formulas. Honest pricing. Made for real homes.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col justify-center">
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-4 block">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                A cleaning brand built around one question
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Why should a family have to choose between a cleaner that
                  actually works and one they can genuinely afford every month?
                  That question is where Cynora started, and it&apos;s still the
                  filter every new product idea has to pass before it reaches
                  your doorstep.
                </p>
                <p>
                  We&apos;re a small, focused team — not a conglomerate brand
                  with a hundred SKUs. That means every product line, from our
                  liquid detergent to our glass cleaner, gets real attention
                  rather than being one of many afterthoughts on a shelf.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20 lg:space-y-32">
          {MISSION_VISION.map((item, index) => (
            <div
              key={item.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${item.reverse ? "lg:rtl" : ""}`}
            >
              <Reveal
                delay={index * 100}
                className={item.reverse ? "lg:ltr" : ""}
              >
                <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <Image
                    src="/images/cynora-logo.png"
                    alt={item.title}
                    width={120}
                    height={120}
                    className="opacity-90 drop-shadow-lg"
                  />
                </div>
              </Reveal>

              <Reveal
                delay={index * 100 + 100}
                className={item.reverse ? "lg:ltr" : ""}
              >
                <div className="max-w-xl">
                  <span className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-4 block">
                    {item.tag}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    {item.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-4 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Four Things We Don&apos;t Compromise On
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="h-full p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {v.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-16">
            <span className="text-amber-500 font-bold uppercase tracking-wider text-sm mb-4 block">
              How We Got Here
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              From a Frustration to a Full Range
            </h2>
          </Reveal>

          <div className="space-y-12">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 90}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start group">
                  <div className="flex-shrink-0 sm:w-32 pt-1">
                    <span className="font-serif text-2xl font-bold text-amber-500 group-hover:text-amber-400 transition-colors">
                      {t.year}
                    </span>
                  </div>
                  <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-700 pb-2">
                    <p className="text-slate-300 text-lg leading-relaxed m-0">
                      {t.text}
                    </p>
                    {/* Decorative dot on the timeline border */}
                    <div className="absolute left-[-5px] top-3 w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-blue-600 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Reveal>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to try something that actually works?
            </h3>
            <p className="text-blue-100 text-lg md:text-xl mb-10">
              Browse the full range and see why thousands of homes have already
              made the switch.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-white text-blue-600 rounded-full shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-200"
            >
              Shop the Range
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
