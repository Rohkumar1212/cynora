import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./components/Providers";
import Header from "./components/Header";
import Footer from "./components/Footer";

// ADVANCED SEO, GEO, AND OG METADATA
export const metadata: Metadata = {
  title: "Cynora — Elevate Your Clean",
  description:
    "Premium cleaning solutions for homes & businesses. Powerful, trusted, effective.",
  keywords: [
    "cleaning services",
    "premium cleaning",
    "commercial cleaning",
    "residential cleaning",
    "deep cleaning",
    "Cynora",
  ],
  authors: [{ name: "Cynora" }],
  creator: "Cynora",
  publisher: "Cynora",

  metadataBase: new URL("https://sanctumchem.com"),

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Cynora — Elevate Your Clean",
    description:
      "Premium cleaning solutions for homes & businesses. Powerful, trusted, effective.",
    siteName: "Cynora",
    images: [
      {
        url: "/images/og-image.png", // Ensure you have this 1200x630px image in your public folder
        width: 1200,
        height: 630,
        alt: "Cynora - Premium Cleaning Solutions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cynora — Elevate Your Clean",
    description:
      "Premium cleaning solutions for homes & businesses. Powerful, trusted, effective.",
    images: ["/images/og-image.png"],
    creator: "@CynoraClean", // Replace with actual handle
  },

  other: {
    "geo.region": "US-NY", // Replace with your Country-State code
    "geo.placename": "New York", // Replace with your target City
    "geo.position": "40.7128;-74.0060", // Replace with your Latitude;Longitude
    ICBM: "40.7128, -74.0060", // Replace with your Latitude, Longitude
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('cynora_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.setAttribute('data-theme','dark');}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="google-site-verification"
          content="HTxu_7SzFiwo8gcVjTCje6QIAyPnW-iwRQuUGP-lNCg"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Google Analytics Code */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-S3YTZ85GNC"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-S3YTZ85GNC');
            `,
          }}
        />
        {/* End Google Analytics Code */}

        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>

        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2510993789329300');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2510993789329300&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </body>
    </html>
  );
}
