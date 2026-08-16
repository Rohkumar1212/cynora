import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <Logo size={74} />
             
            </div>
            <p className="about">
              Premium cleaning solutions for homes &amp; businesses. Powerful, trusted, effective —
              elevate your clean every single day.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9h3V6h-3a4 4 0 00-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z" />
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.5 8.5 0 01-12.4 7.5L3 20l1.1-5.5A8.5 8.5 0 1121 11.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h5>Shop</h5>
            <ul>
              <li><Link href="/products?category=Liquid+Detergent">Liquid Detergent</Link></li>
              <li><Link href="/products?category=Dish+Wash">Dish Wash</Link></li>
              <li><Link href="/products?category=Floor+Cleaner">Floor Cleaner</Link></li>
              <li><Link href="/products?category=Surface+Cleaner">Surface Cleaner</Link></li>
            </ul>
          </div>

          <div>
            <h5>Account</h5>
            <ul>
              <li><Link href="/dashboard">My Dashboard</Link></li>
              <li><Link href="/dashboard/orders">Order History</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
              <li><Link href="/cart">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h5>Get in Touch</h5>
            <ul>
              <li><a href="mailto:info@sanctumchem.com">info@sanctumchem.com</a></li>
              <li><a href="tel:+917290925552">+91 72909 25552</a></li>
              <li><a href="/contact">Plot No: 432, IMT Industrial Area, Sector-68, Faridabad, Haryana-121004</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Cynora. All rights reserved.</span>
          <span>Privacy Policy &nbsp;·&nbsp; Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
