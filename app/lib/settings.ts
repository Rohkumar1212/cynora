import { apiGetSettings } from "./api";
import { ApiSettings } from "./types";

let cached: ApiSettings | null = null;

const FALLBACK: ApiSettings = {
  store_name: "Cynora Premium Clean",
  shipping_charges: 79,
  free_shipping_limit: 999,
  currency: "INR",
  contact_email: "support@cynora.com",
};

export async function fetchSettings(): Promise<ApiSettings> {
  if (cached) return cached;
  try {
    cached = await apiGetSettings();
    return cached;
  } catch {
    return FALLBACK;
  }
}
