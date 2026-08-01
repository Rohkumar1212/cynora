// ---------------------------------------------------------------------------
// Cynora API client
// Uses NEXT_PUBLIC_API_URL from .env to target the live backend.
// ---------------------------------------------------------------------------

import type {
  ApiAddress,
  ApiBanner,
  ApiCartItem,
  ApiCategory,
  ApiOrder,
  ApiProduct,
  ApiSettings,
  ApiUser,
} from "./types";

// Fallback to an empty string if the env variable isn't set,
// which safely defaults back to relative routing (e.g., local dev)
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_PREFIX = "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// The backend sets an HttpOnly `user_token` cookie with `SameSite=Lax`. That
// works fine when the frontend and API share a domain, but Cynora's API
// lives on a different origin (admin.sanctumchem.com) — and SameSite=Lax
// cookies are NOT sent on cross-site fetch/XHR requests. That was silently
// breaking every authenticated call (cart, orders, profile) after login.
//
// The login/register endpoints also return a JWT `token` in the response
// body, which the API explicitly supports as a Bearer alternative. We store
// that token and attach it as an Authorization header on every request, so
// auth keeps working regardless of cookie/domain restrictions.
// ---------------------------------------------------------------------------
const TOKEN_KEY = "cynora_token";

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

// Helper to construct the full URL, preventing double slashes
function getFullUrl(path: string) {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const fullUrl = getFullUrl(path);
  const token = getToken();

  const res = await fetch(fullUrl, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* empty body */
  }

  if (res.status === 401 && !path.startsWith("/user/login") && !path.startsWith("/user/register")) {
    // The token we sent was rejected (expired/invalid) or the request
    // never had valid credentials in the first place. Clear it and tell
    // the rest of the app so it can drop back to a clean "logged out"
    // state instead of silently hanging (e.g. "Place Order" doing nothing).
    setToken(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cynora:unauthorized"));
    }
  }

  if (!res.ok) {
    const message =
      res.status === 401
        ? "Your session has expired. Please log in again."
        : body?.message || body?.error || `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

// ---- Auth --------------------------------------------------------------

export function apiRegister(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return request<{ message: string; user: ApiUser }>("/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiLogin(data: { email: string; password: string }) {
  return request<{ message: string; user: ApiUser; token: string }>(
    "/user/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export function apiProfile() {
  return request<{ user: ApiUser }>("/user/profile", { method: "GET" });
}

export function apiLogout() {
  return request<{ message: string }>("/user/logout", { method: "POST" });
}

// ---- Products ------------------------------------------------------------

export interface ProductQuery {
  category?: string;
  subcategory?: string;
  search?: string;
  bestseller?: boolean;
  featured?: boolean;
  status?: string;
}

export function apiGetProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  return request<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`);
}

export function apiGetProduct(idOrSlug: string) {
  return request<ApiProduct>(`/products/${encodeURIComponent(idOrSlug)}`);
}

export function apiGetFeaturedProducts() {
  return request<ApiProduct[]>("/products/featured");
}

export function apiGetBestsellers() {
  return request<ApiProduct[]>("/products/bestsellers");
}

export function apiGetProductsByCategory(slug: string) {
  return request<ApiProduct[]>(
    `/products/category/${encodeURIComponent(slug)}`,
  );
}

export function apiSearchProducts(q: string) {
  return request<ApiProduct[]>(`/products/search?q=${encodeURIComponent(q)}`);
}

// ---- Categories ------------------------------------------------------------

export function apiGetCategories() {
  return request<ApiCategory[]>("/categories");
}

// ---- Cart ------------------------------------------------------------------

export function apiGetCart() {
  return request<ApiCartItem[]>("/cart");
}

export function apiUpsertCartItem(productId: string, quantity: number) {
  return request<{ message: string; cartItem: ApiCartItem }>("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function apiRemoveCartItem(productId?: string) {
  const qs = productId ? `?productId=${encodeURIComponent(productId)}` : "";
  return request<{ message: string }>(`/cart${qs}`, { method: "DELETE" });
}

// ---- Orders ------------------------------------------------------------------

export function apiGetOrders() {
  return request<ApiOrder[]>("/orders");
}

export function apiPlaceOrder(data: {
  address: ApiAddress;
  paymentMethod: "COD" | "RAZORPAY";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) {
  return request<{ message: string; order: ApiOrder }>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---- Banners & Settings --------------------------------------------------

export function apiGetBanners(
  query: {
    active?: boolean;
    type?: "HOMEPAGE" | "OFFER" | "CATEGORY" | "POPUP";
  } = {},
) {
  const params = new URLSearchParams();
  if (query.active !== undefined) params.set("active", String(query.active));
  if (query.type) params.set("type", query.type);
  const qs = params.toString();
  return request<ApiBanner[]>(`/banners${qs ? `?${qs}` : ""}`);
}

export function apiGetSettings() {
  return request<ApiSettings>("/settings");
}
