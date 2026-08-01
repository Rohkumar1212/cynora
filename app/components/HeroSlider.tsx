"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Product } from "../lib/types";

const PAGE_SIZE = 4;
const AUTOPLAY_MS = 4800;

export default function HeroSlider({ products }: { products: Product[] }) {
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += PAGE_SIZE) {
    const chunk = products.slice(i, i + PAGE_SIZE);
    if (chunk.length === PAGE_SIZE) pages.push(chunk);
  }
  // Always have at least one page, even with fewer than 4 products.
  if (pages.length === 0 && products.length > 0) pages.push(products.slice(0, PAGE_SIZE));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pages.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % pages.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pages.length, paused]);

  if (pages.length === 0) {
    return (
      <div className="hero-visual">
        <div className="hero-badge">100% Safe Formula</div>
      </div>
    );
  }

  const current = pages[index];

  return (
    <div
      className="hero-visual"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slide-fade" key={index}>
        {current.map((p, i) => (
          <div className={`pouch p${i + 1}`} key={p.dbId} style={{ background: p.gradient }}>
            <div className="pouch-photo">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="120px"
                priority={index === 0 && i === 0}
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="brand">CYNORA</span>
            <span className="label">{p.tag || p.category}</span>
          </div>
        ))}
      </div>

      <div className="hero-badge">100% Safe Formula</div>

      {pages.length > 1 && (
        <div className="hero-dots" role="tablist" aria-label="Featured product slides">
          {pages.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
