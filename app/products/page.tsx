"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import { fetchAllProducts, fetchCategories, CategoryOption } from "../data/products";
import { Product } from "../lib/types";

function ShopContent() {
  const params = useSearchParams();
  const initialCategory = params.get("category") || "All";
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(params.get("search") || "");
  const [sort, setSort] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchAllProducts(), fetchCategories()])
      .then(([p, c]) => {
        if (cancelled) return;
        setProducts(p);
        setCategories(c);
        setError("");
      })
      .catch(() => !cancelled && setError("Couldn't load products right now. Please refresh."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category !== "All") list = list.filter((p) => p.categorySlug === category || p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, search, sort]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span>Shop</div>
          <h1>Shop All Products</h1>
          <p style={{ color: "var(--ink-soft)" }}>Premium cleaning essentials for every corner of your home.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container">
          <div className="shop-layout">
            <aside className="filter-box">
              <h4>Categories</h4>
              <div className="filter-list">
                <button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>
                  All Products
                </button>
                {categories.map((c) => (
                  <button key={c.slug} className={category === c.slug ? "active" : ""} onClick={() => setCategory(c.slug)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div className="shop-toolbar">
                <span className="count">
                  {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
                </span>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <div className="search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}

              {loading ? (
                <div className="product-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="product-card skeleton-card" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="icon-circle">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  </div>
                  <h3>No products found</h3>
                  <p>Try a different category or search term.</p>
                  <button className="btn btn-primary" onClick={() => { setCategory("All"); setSearch(""); }}>Reset Filters</button>
                </div>
              ) : (
                <div className="product-grid">
                  {filtered.map((p, i) => (
                    <Reveal key={p.dbId} delay={(i % 4) * 60}>
                      <ProductCard product={p} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
