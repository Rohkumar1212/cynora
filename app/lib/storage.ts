export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    // Explicitly check for the string "undefined".
    // JSON.stringify(undefined) can sometimes write this, causing JSON.parse to crash.
    if (!raw || raw === "undefined" || raw === "null") return fallback;

    return JSON.parse(raw) as T;
  } catch (error) {
    // Log in development to catch corrupted local storage states early
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Better to warn rather than silently fail. This helps you catch QuotaExceededErrors
    // if a user's browser storage gets full.
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}

// Instantiate the formatter once outside the function.
// Calling `toLocaleString` inside a render loop (like mapping over cart items)
// creates a new Intl instance every time, which is computationally expensive.
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function money(n: number): string {
  // Prevent NaN from rendering as "₹NaN"
  if (typeof n !== "number" || isNaN(n)) return inrFormatter.format(0);
  return inrFormatter.format(n);
}

export function genId(prefix: string): string {
  // Use the modern, cryptographically secure UUID generator if available in the browser.
  // Falls back to your original timestamp + random string method for older environments.
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
}
