"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/orders", label: "My Orders", icon: "box" },
  { href: "/dashboard/wishlist", label: "My Wishlist", icon: "heart" },
  { href: "/dashboard/addresses", label: "Addresses", icon: "pin" },
  { href: "/dashboard/profile", label: "Profile Settings", icon: "user" },
];

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, JSX.Element> = {
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    box: <><path d="M21 8L12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></>,
    heart: <path d="M12 20s-7-4.35-9.5-8.5C.6 8 2 4.5 5.5 3.6 8 3 10.3 4 12 6.3 13.7 4 16 3 18.5 3.6 22 4.5 23.4 8 21.5 11.5 19 15.65 12 20 12 20z" />,
    pin: <><path d="M12 21s7-6.6 7-12A7 7 0 105 9c0 5.4 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{paths[name]}</svg>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.push("/login?next=/dashboard");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <section className="section"><div className="container"><p>Loading…</p></div></section>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <div className="dash-profile">
              <span className="dash-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <div><b>{user.name}</b><span>{user.email}</span></div>
            </div>
            <nav className="dash-nav">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
                  <NavIcon name={l.icon} /> {l.label}
                </Link>
              ))}
              <button className="logout" onClick={() => { logout(); router.push("/"); }}>
                <NavIcon name="logout" /> Log Out
              </button>
            </nav>
          </aside>

          <div className="dash-panel">{children}</div>
        </div>
      </div>
    </section>
  );
}
