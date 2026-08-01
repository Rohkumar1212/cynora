"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Order, Address, mapApiOrder } from "../lib/types";
import { apiGetOrders, apiPlaceOrder, ApiError } from "../lib/api";
import { useAuth } from "./AuthContext";

interface PaymentRef {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

interface OrdersContextValue {
  orders: Order[];
  loading: boolean;
  refresh: () => Promise<void>;
  placeOrder: (
    address: Address,
    paymentMethod?: "COD" | "RAZORPAY",
    paymentRef?: PaymentRef
  ) => Promise<{ ok: boolean; order?: Order; error?: string }>;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const apiOrders = await apiGetOrders();
      setOrders(apiOrders.map(mapApiOrder));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    refresh();
  }, [ready, refresh]);

  async function placeOrder(address: Address, paymentMethod: "COD" | "RAZORPAY" = "COD", paymentRef?: PaymentRef) {
    try {
      const res = await apiPlaceOrder({
        address: {
          fullName: address.fullName,
          phone: address.phone,
          house: address.line1,
          landmark: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod,
        razorpayOrderId: paymentRef?.razorpayOrderId,
        razorpayPaymentId: paymentRef?.razorpayPaymentId,
        razorpaySignature: paymentRef?.razorpaySignature,
      });
      await refresh();
      // The place-order response doesn't include line items, so pull the
      // freshly created order (with items) from the orders list.
      const full = (await apiGetOrders()).find((o) => o.id === res.order.id);
      const order = full ? mapApiOrder(full) : mapApiOrder({ ...res.order, items: [] } as any);
      return { ok: true, order };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not place order. Please try again.";
      return { ok: false, error: message };
    }
  }

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  return (
    <OrdersContext.Provider value={{ orders, loading, refresh, placeOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
