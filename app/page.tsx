"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "./components/Reveal";
import ProductCard from "./components/ProductCard";
import NewsletterForm from "./components/NewsletterForm";
import HeroSlider from "./components/HeroSlider";
import { fetchBestsellers, fetchCategories, fetchAllProducts, fetchHomepageBanner, CategoryOption } from "./data/products";
import { paletteForCategory, Product } from "./lib/types";

const FEATURES = [
  { title: "100% Safe Formula", desc: "Dermatologically tested, tough on stains yet gentle on skin & fabric.", icon: "shield" },
  { title: "Concentrated Power", desc: "A little goes a long way — more washes, more value per pouch.", icon: "bolt" },
  { title: "Eco-Conscious", desc: "Biodegradable ingredients and recyclable pouches, kinder to the planet.", icon: "leaf" },
  { title: "Trusted by Thousands", desc: "Loved by homes and businesses across India for consistent quality.", icon: "star" },
];

const WHY = [
  { title: "Premium Ingredients", desc: "Sourced formulations that outperform everyday cleaners." },
  { title: "Rigorous Quality Checks", desc: "Every batch tested before it reaches your doorstep." },
  { title: "Value That Lasts", desc: "Concentrated formulas mean fewer refills, more savings." },
  { title: "Customer First", desc: "Dedicated support and hassle-free replacements." },
];

const TESTIMONIALS = [
  { name: "Ritika Sharma", role: "Homemaker, Lucknow", quote: "The wool detergent is gentle on my sarees yet removes every stain. Switched permanently from my old brand." },
  { name: "Ankit Verma", role: "Restaurant Owner", quote: "We use Cynora's dish wash gel across our kitchen. It cuts grease instantly and lasts far longer than expected." },
  { name: "Priya Nair", role: "Working Professional", quote: "Love the floor cleaner's fragrance — my whole apartment smells fresh for hours after mopping." },
];

const HOW = [
  { title: "Browse & Choose", desc: "Explore our range of premium cleaning essentials by category." },
  { title: "Add to Cart", desc: "Pick your quantities and add favourites to your wishlist." },
  { title: "Checkout with COD", desc: "Confirm your address and pay cash on delivery — no hassle." },
  { title: "Fast Delivery", desc: "Track your order right from your dashboard until it arrives." },
];

const FAQS = [
  { q: "Do you offer Cash on Delivery?", a: "Yes — every order on Cynora can be paid for with Cash on Delivery. You'll see a full bill breakdown before confirming." },
  { q: "How long does delivery take?", a: "Most orders are delivered within 3–5 business days. You can track order status anytime from your dashboard." },
  { q: "Can I return a product?", a: "Yes, unopened products can be returned within 7 days of delivery. Reach out via our contact page to start a return." },
  { q: "Do you offer bulk / distributor pricing?", a: "Absolutely — use the Distributor Enquiry link in our header or footer to get in touch about bulk pricing." },
];

function FeatureIcon({ name }: { name: string }) {
  const paths: Record<string, JSX.Element> = {
    shield: <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />,
    bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
    leaf: <path d="M5 21c8 0 14-6 14-14V4h-3C8 4 3 9 3 16v5z" />,
    star: <path d="M12 3l2.8 5.9 6.2.9-4.5 4.5 1.1 6.2L12 17.4 6.4 20.5l1.1-6.2L3 9.8l6.2-.9z" />,
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [gallery, setGallery] = useState<Product[]>([]);
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<{ image: string; link?: string; title?: string } | null>(null);

  useEffect(() => {
    fetchBestsellers()
      .then((list) => setBestSellers(list.slice(0, 4)))
      .catch(() => setBestSellers([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchAllProducts()
      .then((list) => {
        setGallery(list.slice(0, 4));
        setHeroProducts(list.slice(0, 12));
      })
      .catch(() => {
        setGallery([]);
        setHeroProducts([]);
      });
    fetchHomepageBanner().then(setBanner).catch(() => setBanner(null));
  }, []);

  return (
   
    <main className="w-full max-w-[100vw] overflow-x-hidden">
      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-glow">
          <Image src="/images/hero-glow.svg" alt="" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        </div>
        <div className="container hero-inner">
          <div>
            <Reveal>
              <span className="eyebrow">
                <span className="spark">✦</span> Premium Cleaning, Elevated
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1>
                Elevate Your <span className="gold-text serif">Clean</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lead">
                Concentrated liquid detergents, dish wash gels, floor &amp; surface cleaners crafted for homes
                and businesses that expect more from every wash, wipe and mop.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="hero-ctas">
                <Link href="/products" className="btn btn-primary">Shop Now</Link>
                <a href="#about" className="btn btn-ghost">Our Story</a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="hero-stats">
                <div><b>50K+</b><span>Happy Customers</span></div>
                <div><b>8</b><span>Product Lines</span></div>
                <div><b>4.8★</b><span>Average Rating</span></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <HeroSlider products={heroProducts.length ? heroProducts : bestSellers.length ? bestSellers : gallery} />
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          <span>
            ✦ Free Shipping Above ₹999 &nbsp; ✦ Cash on Delivery Available &nbsp; ✦ 100% Safe Formula &nbsp; ✦ Trusted by 50,000+ Homes &nbsp;
            ✦ Free Shipping Above ₹999 &nbsp; ✦ Cash on Delivery Available &nbsp; ✦ 100% Safe Formula &nbsp; ✦ Trusted by 50,000+ Homes &nbsp;
          </span>
        </div>
      </div>

      {/* PROMO BANNER (from /api/banners) */}
      {banner && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              {banner.link ? (
                <Link href={banner.link} className="promo-banner">
                  <Image src={banner.image} alt={banner.title || "Cynora promotion"} fill sizes="100vw" style={{ objectFit: "cover" }} />
                </Link>
              ) : (
                <div className="promo-banner">
                  <Image src={banner.image} alt={banner.title || "Cynora promotion"} fill sizes="100vw" style={{ objectFit: "cover" }} />
                </div>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* TRUST STRIP */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Reveal>
            <div className="trust-strip">
              <div className="trust-item">
                <span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg></span>
                <div><b>Free Shipping</b><span>On orders above ₹999</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20" /></svg></span>
                <div><b>Cash on Delivery</b><span>Pay when it arrives</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /></svg></span>
                <div><b>Safe &amp; Tested</b><span>Dermatologically approved</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l5 5L21 6" /></svg></span>
                <div><b>Easy Returns</b><span>7 day return window</span></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Why Cynora</span>
            <h2>Cleaning You Can Trust</h2>
            <p>Every product is built on a simple promise — real performance without compromise.</p>
          </Reveal>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="feature-card">
                  <span className="feature-icon"><FeatureIcon name={f.icon} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" id="categories" style={{ background: "var(--paper)" }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Shop by Category</span>
            <h2>Find Your Essentials</h2>
            <p>From laundry to kitchen to floors — a complete cleaning range in one place.</p>
          </Reveal>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <Link href={`/products?category=${encodeURIComponent(c.slug)}`} className="cat-card">
                  <span className="cat-circle" style={!c.icon ? { background: paletteForCategory(c.slug).gradient, color: "#fff" } : undefined}>
                    {c.icon ? (
                      <Image src={c.icon} alt={c.name} fill sizes="64px" style={{ objectFit: "cover" }} />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>
                    )}
                  </span>
                  <span>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section" id="products">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Best Sellers</span>
            <h2>Loved By Our Customers</h2>
            <p>The products our customers reorder again and again.</p>
          </Reveal>
          <div className="product-grid">
            {bestSellers.map((p, i) => (
              <Reveal key={p.dbId} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Reveal>
              <Link href="/products" className="btn btn-primary">View All Products</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Simple Process</span>
            <h2>How Ordering Works</h2>
            <p>From browsing to delivery, a smooth experience end-to-end.</p>
          </Reveal>
          <div className="how-grid">
            {HOW.map((h, i) => (
              <Reveal key={h.title} delay={i * 90}>
                <div className="how-step">
                  <div className="how-num">{i + 1}</div>
                  <h4>{h.title}</h4>
                  <p>{h.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE (SPLIT) */}
      <section className="section" id="about">
        <div className="container split">
          <Reveal>
            <div className="split-visual">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" stroke="var(--gold)" strokeWidth="2" opacity="0.4" />
                <path d="M60 100c10-30 30-46 60-40" stroke="var(--gold-deep)" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 130c20 14 60 14 90-6" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <span className="eyebrow">Why Choose Cynora</span>
              <h2 className="serif" style={{ fontSize: "clamp(24px,3vw,32px)", margin: "10px 0 6px" }}>Built On Real Performance</h2>
              <div className="why-list">
                {WHY.map((w, i) => (
                  <div className="why-item" key={w.title}>
                    <span className="why-num">{String(i + 1).padStart(2, "0")}</span>
                    <div><h4>{w.title}</h4><p>{w.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">From Our Community</span>
            <h2>#CynoraClean</h2>
            <p>Real homes, real results — tag us to be featured.</p>
          </Reveal>
          <div className="gallery-grid">
            {gallery.map((p, i) => (
              <Reveal key={p.dbId} delay={i * 70}>
                <div className="gallery-tile" style={{ background: p.gradient }}>
                  <Image src={p.image} alt={p.name} fill sizes="240px" style={{ objectFit: "cover" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Testimonials</span>
            <h2>What Our Customers Say</h2>
          </Reveal>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <div className="testi-card">
                  <div className="stars">★★★★★</div>
                  <p className="quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="testi-person">
                    <span className="testi-avatar">{t.name[0]}</span>
                    <div><b>{t.name}</b><span>{t.role}</span></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Frequently Asked</h2>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className={`faq-item ${openFaq === i ? "open" : ""}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                  <div className="faq-a">{f.a}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band" id="contact">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <Reveal><div><h3>Become a Cynora Distributor</h3><p>Partner with us for bulk pricing and business supply across your region.</p></div></Reveal>
          <Reveal delay={100}><a href="mailto:hello@cynora.in" className="btn btn-dark">Enquire Now</a></Reveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="newsletter">
              <h3>Stay in the Loop</h3>
              <p>Subscribe for offers, new launches, and cleaning tips.</p>
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
  </main>
  );
}
