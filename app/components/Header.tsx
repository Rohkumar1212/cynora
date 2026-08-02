"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";

const NAV = [
  { label: "Home", href: "/#home" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/#categories" },
  { label: "Best Sellers", href: "/#products" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>🚚 Free Shipping on orders above ₹999</span>
          <span className="topbar-center">Premium Cleaning Solutions for Homes &amp; Businesses</span>
          <span className="topbar-right">Bulk Orders&nbsp; | &nbsp;Distributor Enquiry</span>
        </div>
      </div>

      <header className="header" id="home">
        <div className="header-inner">
          <Link href="/" className="logo">
            <Logo />            
          </Link>

          <nav className="nav-desktop">
            {NAV.map((n) => {
              const isActive =
                (n.href === "/#home" && pathname === "/") ||
                (n.href !== "/#home" && !n.href.includes("#") && pathname.startsWith(n.href));
              return (
                <a key={n.label} href={n.href} className={isActive ? "active" : ""}>
                  {n.label}
                </a>
              );
            })}
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn theme-toggle"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
                </svg>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
                </svg>
              )}
            </button>

            <Link href="/wishlist" className="icon-btn" aria-label="Wishlist">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20s-7-4.35-9.5-8.5C.6 8 2 4.5 5.5 3.6 8 3 10.3 4 12 6.3 13.7 4 16 3 18.5 3.6 22 4.5 23.4 8 21.5 11.5 19 15.65 12 20 12 20z" />
              </svg>
              {wishCount > 0 && <span className="cart-dot">{wishCount}</span>}
            </Link>

            <div
              className="account-menu"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className="icon-btn"
                aria-label="Account"
                onClick={() => (user ? setMenuOpen((m) => !m) : router.push("/login"))}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </button>
              {user && (
                <div className={`account-dropdown ${menuOpen ? "open" : ""}`}>
                  <div className="account-dropdown-head">
                    <b>{user.name}</b>
                    <span>{user.email}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link href="/dashboard/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <Link href="/dashboard/wishlist" onClick={() => setMenuOpen(false)}>My Wishlist</Link>
                  <Link href="/dashboard/addresses" onClick={() => setMenuOpen(false)}>Addresses</Link>
                  <button
                    className="dropdown-logout"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      router.push("/");
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            <Link href="/cart" className="icon-btn" aria-label="Cart">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
            </Link>

            <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        <div className={`mobile-nav ${open ? "open" : ""}`}>
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={user ? "/dashboard" : "/login"} onClick={() => setOpen(false)}>
                {user ? "Dashboard" : "Login / Register"}
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
