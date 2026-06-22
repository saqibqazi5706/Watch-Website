import { formatPrice } from "@/lib/utils";
import type { PaymentMethod, Address } from "@/types";

export interface OrderEmailItem {
  product_name: string;
  quantity: number;
  price: number;
}

export interface OwnerOrderEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: Address;
  paymentMethod: PaymentMethod;
  items: OrderEmailItem[];
  total: number;
}

const wrap: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  background: "#f4f4f5",
  padding: "24px",
  color: "#18181b",
};
const card: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #e4e4e7",
};
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  fontSize: "12px",
  color: "#71717a",
  borderBottom: "1px solid #e4e4e7",
};
const td: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "14px",
  borderBottom: "1px solid #f4f4f5",
};

export default function OwnerOrderEmail({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  address,
  paymentMethod,
  items,
  total,
}: OwnerOrderEmailProps) {
  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ background: "#09090b", padding: "20px 24px" }}>
          <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "18px", letterSpacing: "2px" }}>
            OLEVS
          </span>
          <p style={{ color: "#a1a1aa", margin: "4px 0 0", fontSize: "13px" }}>
            New order received
          </p>
        </div>

        <div style={{ padding: "24px" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: "18px" }}>
            Order {orderNumber}
          </h2>
          <p style={{ margin: "0 0 16px", color: "#71717a", fontSize: "13px" }}>
            Payment: <strong>{paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</strong>
          </p>

          <h3 style={{ fontSize: "14px", margin: "16px 0 8px" }}>Customer</h3>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6 }}>
            {customerName}
            <br />
            {customerEmail}
            <br />
            {customerPhone}
            <br />
            {address.street}, {address.city} {address.postal_code}
          </p>

          <h3 style={{ fontSize: "14px", margin: "20px 0 8px" }}>Items</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Item</th>
                <th style={{ ...th, textAlign: "center" }}>Qty</th>
                <th style={{ ...th, textAlign: "right" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={td}>{item.product_name}</td>
                  <td style={{ ...td, textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ textAlign: "right", fontSize: "16px", fontWeight: "bold", marginTop: "16px" }}>
            Total: {formatPrice(total)}
          </p>

          {paymentMethod === "bank_transfer" && (
            <p style={{ background: "#fef3c7", color: "#92400e", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
              ⚠️ Bank transfer order — check WhatsApp for the customer&apos;s payment receipt before dispatching.
            </p>
          )}

          <p style={{ marginTop: "24px", color: "#a1a1aa", fontSize: "12px", borderTop: "1px solid #e4e4e7", paddingTop: "12px" }}>
            Order status: <strong>pending</strong>. Update it in your Supabase dashboard once processed.
          </p>
        </div>
      </div>
    </div>
  );
}
