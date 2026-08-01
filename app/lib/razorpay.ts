// ---------------------------------------------------------------------------
// Loads the Razorpay Checkout script once, then opens the payment widget.
// The actual order creation + signature verification happens on our own
// /api/razorpay/* routes (see app/api/razorpay) so the key secret never
// reaches the browser.
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    Razorpay?: any;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout script."));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export interface RazorpayCustomer {
  name: string;
  email: string;
  contact?: string;
}

export interface RazorpayPaymentResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Creates a Razorpay order via our server route, opens the checkout widget,
 * verifies the resulting signature server-side, and resolves with the
 * verified payment details. Rejects (with a user-facing message) if
 * anything along the way fails or the user closes the widget.
 */
export async function payWithRazorpay(amountInRupees: number, customer: RazorpayCustomer): Promise<RazorpayPaymentResult> {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error("Razorpay checkout could not be loaded. Please check your connection and try again.");
  }

  const createRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountInRupees }),
  });
  const order = await createRes.json();
  if (!createRes.ok) {
    throw new Error(order?.message || "Could not start payment. Please try again.");
  }

  return new Promise<RazorpayPaymentResult>((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Cynora",
      description: "Order payment",
      image: "/images/cynora-icon.png",
      order_id: order.orderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact || "",
      },
      theme: { color: "#c9a24b" },
      handler: async (response: RazorpayPaymentResult) => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.verified) {
            reject(new Error(verifyData?.message || "Payment could not be verified."));
            return;
          }
          resolve(response);
        } catch {
          reject(new Error("Payment succeeded but verification failed. Contact support with your payment ID."));
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment was cancelled.")),
      },
    });

    rzp.on("payment.failed", (resp: any) => {
      reject(new Error(resp?.error?.description || "Payment failed. Please try again."));
    });

    rzp.open();
  });
}
