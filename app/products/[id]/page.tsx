"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductBySlug, fetchAllProducts } from "../../data/products";
import { Product } from "../../lib/types";
import { money } from "../../lib/storage";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard";
import Reveal from "../../components/Reveal";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);
    fetchProductBySlug(params.id).then(async (p) => {
      if (cancelled) return;
      setProduct(p);
      setActiveImg(0);
      if (p) {
        const all = await fetchAllProducts();
        setRelated(all.filter((x) => x.categorySlug === p.categorySlug && x.dbId !== p.dbId).slice(0, 4));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (product === undefined) {
    return (
      <section className="section">
        <div className="container"><p>Loading…</p></div>
      </section>
    );
  }

  if (product === null) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h3>Product not found</h3>
          <p>The product you&apos;re looking for doesn&apos;t exist or was removed.</p>
          <Link href="/products" className="btn btn-primary">Back to Shop</Link>
        </div>
      </section>
    );
  }

  const wishlisted = isWishlisted(product.dbId);

  function handleAddToCart() {
    addToCart(product!, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  function handleBuyNow() {
    addToCart(product!, qty);
    router.push("/checkout");
  }

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 16 }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/products">Shop</Link><span>/</span>
            {product.name}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="pd-grid">
            <Reveal>
              <div>
                <div className="pd-visual" style={{ background: product.gradient }}>
                  <Image
                    src={product.images[activeImg] || product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  {product.badge && <span className="badge" style={{ position: "absolute", top: 18, left: 18 }}>{product.badge}</span>}
                </div>
                {product.images.length > 1 && (
                  <div className="pd-thumbs">
                    {product.images.map((img, i) => (
                      <button
                        key={img + i}
                        className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                        onClick={() => setActiveImg(i)}
                        aria-label={`View image ${i + 1}`}
                      >
                        <Image src={img} alt={`${product.name} view ${i + 1}`} fill sizes="80px" style={{ objectFit: "cover" }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <span className="pd-tag">{product.tag}</span>
                <h1 className="pd-title">{product.name}</h1>
                <p className="pd-meta">{product.meta}</p>
                <div className="product-rating" style={{ marginBottom: 18 }}>
                  <span className="stars-sm" style={{ color: "var(--gold)" }}>★★★★★</span>
                  <span className="rating-count">&nbsp;{product.rating} ({product.reviews} reviews)</span>
                </div>

                <div className="pd-price-row">
                  <span className="pd-price">{money(product.price)}</span>
                  {product.oldPrice && <span className="pd-old">{money(product.oldPrice)}</span>}
                </div>

                <p className="pd-desc">{product.description}</p>

                <p className={`pd-stock ${product.stock > 10 ? "in" : "low"}`}>
                  {product.stock > 0
                    ? product.stock > 10
                      ? `✔ In Stock (${product.stock} available)`
                      : `⚠ Only ${product.stock} left in stock`
                    : "✕ Out of stock"}
                </p>

                <div className="pd-actions">
                  <div className="qty-stepper">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock <= 0}>
                    {added ? "Added to Cart ✓" : "Add to Cart"}
                  </button>
                  <button className="btn btn-dark" onClick={handleBuyNow} disabled={product.stock <= 0}>Buy Now</button>
                  <button className={`icon-btn ${wishlisted ? "active" : ""}`} style={{ background: wishlisted ? "var(--gold-pale)" : "var(--paper)", color: wishlisted ? "var(--gold-deep)" : "var(--ink)" }} onClick={() => toggleWishlist(product)} aria-label="Toggle wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M12 20s-7-4.35-9.5-8.5C.6 8 2 4.5 5.5 3.6 8 3 10.3 4 12 6.3 13.7 4 16 3 18.5 3.6 22 4.5 23.4 8 21.5 11.5 19 15.65 12 20 12 20z" />
                    </svg>
                  </button>
                </div>

                <div className="pd-info-list">
                  <div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg> Free shipping on orders above ₹999</div>
                  <div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /></svg> Cash on Delivery available</div>
                  <div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l5 5L21 6" /></svg> 7-day easy returns</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: "var(--paper)" }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">You May Also Like</span>
              <h2>More From {product.category}</h2>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.dbId} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
