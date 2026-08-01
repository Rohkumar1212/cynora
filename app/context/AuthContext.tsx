"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Address, mapApiUser } from "../lib/types";
import { apiLogin, apiLogout, apiProfile, apiRegister, ApiError, setToken } from "../lib/api";
import { readJSON, writeJSON, genId } from "../lib/storage";

// The documented API has no address-book endpoints, only an inline address
// object per order. To still give returning customers a saved-address
// convenience at checkout, addresses are kept client-side, namespaced per
// logged-in user id.
function addressKey(userId: string) {
  return `cynora_addresses_${userId}`;
}

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  addresses: Address[];
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{
    ok: boolean;
    error?: string;
  }>;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => Address;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [ready, setReady] = useState(false);

  const loadAddresses = useCallback((userId: string) => {
    setAddresses(readJSON<Address[]>(addressKey(userId), []));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { user: apiUser } = await apiProfile();
        if (cancelled) return;
        const mapped = mapApiUser(apiUser);
        setUser(mapped);
        loadAddresses(mapped.id);
      } catch {
        // not logged in — that's fine
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAddresses]);

  // If any authenticated request comes back 401 (expired/invalid token),
  // drop back to a clean logged-out state instead of silently hanging.
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setAddresses([]);
    }
    window.addEventListener("cynora:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("cynora:unauthorized", handleUnauthorized);
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await apiLogin({ email, password });
      setToken(res.token || null);
      const mapped = mapApiUser(res.user);
      setUser(mapped);
      loadAddresses(mapped.id);
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed. Please try again.";
      return { ok: false, error: message };
    }
  }

  async function register(data: { name: string; email: string; phone: string; password: string }) {
    try {
      await apiRegister({ name: data.name, email: data.email, password: data.password, phone: data.phone });
      // Auto-login right after registering, since /register doesn't return a session cookie.
      const loginRes = await apiLogin({ email: data.email, password: data.password });
      setToken(loginRes.token || null);
      const mapped = mapApiUser(loginRes.user);
      setUser(mapped);
      loadAddresses(mapped.id);
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not create account.";
      return { ok: false, error: message };
    }
  }

  function logout() {
    apiLogout().catch(() => {});
    setToken(null);
    setUser(null);
    setAddresses([]);
  }

  function persistAddresses(next: Address[]) {
    setAddresses(next);
    if (user) writeJSON(addressKey(user.id), next);
  }

  function addAddress(address: Omit<Address, "id">) {
    const newAddress: Address = { ...address, id: genId("addr") };
    persistAddresses([...addresses, newAddress]);
    return newAddress;
  }

  function updateAddress(address: Address) {
    persistAddresses(addresses.map((a) => (a.id === address.id ? address : a)));
  }

  function removeAddress(id: string) {
    persistAddresses(addresses.filter((a) => a.id !== id));
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, addresses, login, register, logout, addAddress, updateAddress, removeAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
