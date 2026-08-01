import { NextRequest, NextResponse } from "next/server";

// Creates a Razorpay order server-side, using the secret key. Never expose
// RAZORPAY_KEY_SECRET to the browser — this route is the only place it's used.
export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: "Razorpay is not configured on the server yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 500 }
    );
  }

  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ message: "A valid amount (in rupees) is required." }, { status: 400 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // paise
        currency,
        receipt: receipt || `cynora_${Date.now()}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.error?.description || "Could not create Razorpay order." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId, // safe to expose the public key id to the client
    });
  } catch (err) {
    return NextResponse.json({ message: "Unexpected error creating Razorpay order." }, { status: 500 });
  }
}
