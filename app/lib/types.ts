// ---------------------------------------------------------------------------
// API-shaped types — these mirror FRONTEND_APIS.md exactly.
// ---------------------------------------------------------------------------

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  banner?: string | null;
  description?: string | null;
  subcategories?: ApiCategory[];
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string | null;
  brand: string;
  categoryId: string;
  subcategoryId?: string | null;
  description: string;
  ingredients?: string | null;
  howToUse?: string | null;
  weight?: string | null;
  color?: string | null;
  images: string[];
  gallery?: string[];
  video?: string | null;
  mrp: number;
  sellingPrice: number;
  discount?: number;
  gst?: number;
  stock: number;
  minOrder?: number;
  maxOrder?: number;
  status: "PUBLISHED" | "DRAFT" | string;
  tags?: string[];
  isBestseller?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string } | null;
  reviews?: unknown[];
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "CUSTOMER" | string;
}

export interface ApiAddress {
  fullName: string;
  phone: string;
  house: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ApiCartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    mrp: number;
    sellingPrice: number;
    images: string[];
    stock: number;
    weight?: string | null;
  };
}

export interface ApiOrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    brand: string;
    weight?: string | null;
  };
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  gstAmount: number;
  shippingCharge: number;
  paymentMethod: "COD" | string;
  paymentStatus: string;
  status: string;
  address: ApiAddress;
  createdAt: string;
  items: ApiOrderItem[];
}

export interface ApiBanner {
  id: string;
  title?: string;
  image?: string;
  link?: string;
  type: "HOMEPAGE" | "OFFER" | "CATEGORY" | "POPUP" | string;
  active?: boolean;
}

export interface ApiSettings {
  store_name: string;
  shipping_charges: number;
  free_shipping_limit: number;
  currency: string;
  contact_email: string;
}

// ---------------------------------------------------------------------------
// UI-facing types — the shape the existing components already expect.
// `id` is the product slug (nice URLs), `dbId` is the real product id used
// for API calls (cart/order line items).
// ---------------------------------------------------------------------------

export interface Product {
  id: string; // slug — used for routing
  dbId: string; // real product id — used for API calls
  name: string;
  meta: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  tag: string;
  category: string;
  categorySlug?: string;
  gradient: string;
  image: string;
  images: string[]; // full gallery for the product detail page slider
  rating: number;
  reviews: number;
  stock: number;
}

export interface CartLine {
  productId: string; // dbId
  qty: number;
  product: Product;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userEmail: string;
  items: OrderItem[];
  address: Address;
  paymentMethod: "COD";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Adapters — API shape -> UI shape
// ---------------------------------------------------------------------------

import { BASE_URL } from "./api";

// The API returns product images as relative paths (e.g. "/uploads/x.png").
// Since the storefront and the backend are on different domains
// (NEXT_PUBLIC_API_URL), those relative paths must be resolved against the
// backend's origin — otherwise the browser requests them from the
// storefront's own domain and gets a 404 (this was the "images not
// showing" bug).
export function resolveImage(path?: string | null): string {
  if (!path) return "/images/hero-glow.svg";
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

const CATEGORY_PALETTE: Record<string, { gradient: string; label: string }> = {
  "liquid-detergent": { gradient: "linear-gradient(160deg,#123a63,#0b2340)", label: "LIQUID DETERGENT" },
  "fabric-softener": { gradient: "linear-gradient(160deg,#6b5a8c,#453a63)", label: "FABRIC SOFTENER" },
  "dish-wash": { gradient: "linear-gradient(160deg,#c9962e,#8f6710)", label: "DISH WASH" },
  "floor-cleaner": { gradient: "linear-gradient(160deg,#22543f,#123227)", label: "FLOOR CLEANER" },
  "hand-wash": { gradient: "linear-gradient(160deg,#c96a8a,#8a3f57)", label: "HAND WASH" },
  "surface-cleaner": { gradient: "linear-gradient(160deg,#0f5c76,#0a3547)", label: "SURFACE CLEANER" },
  "toilet-cleaner": { gradient: "linear-gradient(160deg,#123a63,#0a2340)", label: "TOILET CLEANER" },
  "glass-cleaner": { gradient: "linear-gradient(160deg,#3f7ea6,#1f4058)", label: "GLASS CLEANER" },
};

const DEFAULT_PALETTE = { gradient: "linear-gradient(160deg,#123a63,#0b2340)", label: "CYNORA" };

export function paletteForCategory(slug?: string) {
  if (!slug) return DEFAULT_PALETTE;
  return CATEGORY_PALETTE[slug] || DEFAULT_PALETTE;
}

export function mapApiProduct(p: ApiProduct): Product {
  const categorySlug = p.category?.slug;
  const palette = paletteForCategory(categorySlug);
  const discountPct = p.mrp > 0 ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0;
  return {
    id: p.slug,
    dbId: p.id,
    name: p.name,
    meta: [p.weight, p.brand].filter(Boolean).join(" · ") || p.sku,
    description: p.description,
    price: p.sellingPrice,
    oldPrice: p.mrp > p.sellingPrice ? p.mrp : undefined,
    badge: p.isBestseller ? "BEST SELLER" : p.isFeatured ? "FEATURED" : discountPct >= 20 ? `${discountPct}% OFF` : undefined,
    tag: palette.label,
    category: p.category?.name || "Cynora",
    categorySlug,
    gradient: palette.gradient,
    image: resolveImage(p.images?.[0]),
    images: [...(p.images || []), ...(p.gallery || [])].filter(Boolean).map((img) => resolveImage(img)),
    rating: 4.6,
    reviews: 0,
    stock: p.stock,
  };
}

export function mapApiUser(u: ApiUser): User {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}

export function mapApiCartItem(c: ApiCartItem): CartLine {
  const palette = DEFAULT_PALETTE;
  return {
    productId: c.productId,
    qty: c.quantity,
    product: {
      id: c.product.slug,
      dbId: c.product.id,
      name: c.product.name,
      meta: c.product.weight ? `${c.product.weight} · ${c.product.brand}` : c.product.brand,
      description: "",
      price: c.product.sellingPrice,
      oldPrice: c.product.mrp > c.product.sellingPrice ? c.product.mrp : undefined,
      tag: c.product.brand,
      category: "",
      gradient: palette.gradient,
      image: resolveImage(c.product.images?.[0]),
      images: (c.product.images || []).map((img) => resolveImage(img)),
      rating: 4.6,
      reviews: 0,
      stock: c.product.stock,
    },
  };
}

export function mapApiOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    userEmail: "",
    items: o.items.map((it) => ({
      productId: it.product.id,
      name: it.product.name,
      price: it.price,
      qty: it.quantity,
      image: resolveImage(it.product.images?.[0]),
    })),
    address: {
      id: "order-address",
      fullName: o.address.fullName,
      phone: o.address.phone,
      line1: o.address.house,
      line2: o.address.landmark,
      city: o.address.city,
      state: o.address.state,
      pincode: o.address.pincode,
    },
    paymentMethod: "COD",
    subtotal: o.totalAmount - o.gstAmount - o.shippingCharge,
    shipping: o.shippingCharge,
    tax: o.gstAmount,
    total: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt,
  };
}
