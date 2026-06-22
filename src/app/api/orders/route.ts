import { type NextRequest } from "next/server";
import { createElement } from "react";
import { orderSchema } from "@/lib/validators";
import { supabaseServer } from "@/lib/supabase-server";
import { client } from "@/lib/sanity";
import { PRODUCTS_FOR_ORDER_QUERY } from "@/lib/queries";
import { resend } from "@/lib/resend";
import { generateOrderNumber } from "@/lib/utils";
import { enforceRateLimit, orderRatelimit } from "@/lib/ratelimit";
import OwnerOrderEmail from "@/emails/OwnerOrderEmail";
import CustomerOrderEmail from "@/emails/CustomerOrderEmail";

// In the App Router, only this exported method is handled — any other HTTP
// method automatically returns 405, satisfying the "method check" requirement.

const REQUIRED_ENV = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "OWNER_EMAIL",
  "NEXT_PUBLIC_SUPABASE_URL",
];

// Until a domain is verified in Resend, emails must come from this address.
const FROM = "OLEVS <onboarding@resend.dev>";

interface TrustedProduct {
  _id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export async function POST(request: NextRequest) {
  // 1. Content-Type check — only accept JSON.
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  // 2. Fail fast on server misconfiguration.
  for (const envVar of REQUIRED_ENV) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
      return Response.json(
        { error: "Server is not configured correctly." },
        { status: 500 }
      );
    }
  }

  try {
    // 3. Rate limit by IP (fail-open if Upstash isn't configured).
    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const rl = await enforceRateLimit(orderRatelimit, ip);
    if (!rl.success) {
      return Response.json(
        { error: "Too many orders placed. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rl.limit.toString(),
            "X-RateLimit-Remaining": rl.remaining.toString(),
          },
        }
      );
    }

    // 4. Validate the request body with Zod before anything else.
    const body = await request.json();
    const result = orderSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Invalid order data", details: result.error.flatten() },
        { status: 400 }
      );
    }
    const data = result.data;

    // 5. Re-fetch real prices/stock from Sanity — never trust the client.
    const ids = data.items.map((i) => i.product_id);
    const products = await client.fetch<TrustedProduct[]>(
      PRODUCTS_FOR_ORDER_QUERY,
      { ids }
    );

    for (const item of data.items) {
      const product = products.find((p) => p._id === item.product_id);
      if (!product) {
        return Response.json(
          { error: `Product not found: ${item.product_id}` },
          { status: 400 }
        );
      }
      if (!product.inStock) {
        return Response.json(
          { error: `Product is out of stock: ${item.product_name}` },
          { status: 400 }
        );
      }
    }

    // Recalculate the total from trusted prices; ignore any client total.
    const verifiedTotal = data.items.reduce((sum, item) => {
      const product = products.find((p) => p._id === item.product_id)!;
      return sum + product.price * item.quantity;
    }, 0);

    const orderNumber = generateOrderNumber();

    // 6. Persist the order (service-role client, bypasses RLS).
    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        address: data.address,
        payment_method: data.payment_method,
        total: verifiedTotal,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert failed:", orderError);
      return Response.json(
        { error: "Could not save your order. Please try again." },
        { status: 500 }
      );
    }

    const itemRows = data.items.map((item) => {
      const product = products.find((p) => p._id === item.product_id)!;
      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const { error: itemsError } = await supabaseServer
      .from("order_items")
      .insert(itemRows);
    if (itemsError) {
      // The order itself is saved; log and continue so the customer isn't blocked.
      console.error("Order items insert failed:", itemsError);
    }

    // 7. Send notification emails — never fail the order if email errors.
    const emailItems = itemRows.map((r) => ({
      product_name: r.product_name,
      quantity: r.quantity,
      price: r.price,
    }));
    try {
      await resend.emails.send({
        from: FROM,
        to: process.env.OWNER_EMAIL!,
        subject: `New Order Received — ${orderNumber}`,
        react: createElement(OwnerOrderEmail, {
          orderNumber,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone,
          address: data.address,
          paymentMethod: data.payment_method,
          items: emailItems,
          total: verifiedTotal,
        }),
      });

      await resend.emails.send({
        from: FROM,
        to: data.customer_email,
        subject: `Your order has been received — ${orderNumber}`,
        react: createElement(CustomerOrderEmail, {
          orderNumber,
          customerName: data.customer_name,
          paymentMethod: data.payment_method,
          items: emailItems,
          total: verifiedTotal,
          bankName: process.env.BANK_NAME,
          accountName: process.env.BANK_ACCOUNT_NAME,
          accountNumber: process.env.BANK_ACCOUNT_NUMBER,
          whatsapp: process.env.OWNER_WHATSAPP,
        }),
      });
    } catch (emailError) {
      console.error("Email send failed (order still saved):", emailError);
    }

    return Response.json({ success: true, orderNumber });
  } catch (error) {
    // Global handler — never leak internal details to the client.
    console.error("Order creation failed:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
