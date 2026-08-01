import {
  apiGetBanners,
  apiGetBestsellers,
  apiGetCategories,
  apiGetFeaturedProducts,
  apiGetProduct,
  apiGetProducts,
  ProductQuery,
} from "../lib/api";
import { ApiCategory, mapApiProduct, Product, resolveImage } from "../lib/types";

// Simple in-memory cache so repeated navigation within a session doesn't
// refetch the whole catalog every time. Cleared on full page reload.
let productCache: Product[] | null = null;
const productBySlugCache = new Map<string, Product>();

export async function fetchAllProducts(query: ProductQuery = {}): Promise<Product[]> {
  const hasFilters = Object.keys(query).length > 0;
  if (!hasFilters && productCache) return productCache;

  const apiProducts = await apiGetProducts(query);
  const products = apiProducts.map(mapApiProduct);

  if (!hasFilters) {
    productCache = products;
    products.forEach((p) => productBySlugCache.set(p.id, p));
  }

  return products;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (productBySlugCache.has(slug)) return productBySlugCache.get(slug)!;
  try {
    const p = await apiGetProduct(slug);
    const mapped = mapApiProduct(p);
    productBySlugCache.set(mapped.id, mapped);
    return mapped;
  } catch {
    return null;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const apiProducts = await apiGetFeaturedProducts();
  return apiProducts.map(mapApiProduct);
}

export async function fetchBestsellers(): Promise<Product[]> {
  const apiProducts = await apiGetBestsellers();
  return apiProducts.map(mapApiProduct);
}

export interface CategoryOption {
  name: string;
  slug: string;
  icon?: string | null;
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  const cats: ApiCategory[] = await apiGetCategories();
  return cats.map((c) => ({ name: c.name, slug: c.slug, icon: c.icon ? resolveImage(c.icon) : null }));
}

export async function fetchHomepageBanner(): Promise<{ image: string; link?: string; title?: string } | null> {
  try {
    const banners = await apiGetBanners({ active: true, type: "HOMEPAGE" });
    const banner = banners[0];
    if (!banner?.image) return null;
    return { image: resolveImage(banner.image), link: banner.link, title: banner.title };
  } catch {
    return null;
  }
}
