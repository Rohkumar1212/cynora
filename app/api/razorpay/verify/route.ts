import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Verifies the signature Razorpay returns after a successful checkout,
// proving the payment wasn't tampered with client-side before we trust it.
export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      { message: "Razorpay is not configured on the server yet. Set RAZORPAY_KEY_SECRET." },
      { status: 500 }
    );
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, message: "Missing payment fields." }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = expected === razorpay_signature;

    if (!verified) {
      return NextResponse.json({ verified: false, message: "Payment signature mismatch." }, { status: 400 });
    }

    return NextResponse.json({ verified: true });
  } catch (err) {
    return NextResponse.json({ verified: false, message: "Unexpected error verifying payment." }, { status: 500 });
  }
}
