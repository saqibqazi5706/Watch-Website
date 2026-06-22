import { formatPrice } from "@/lib/utils";
import type { PaymentMethod } from "@/types";
import type { OrderEmailItem } from "./OwnerOrderEmail";

export interface CustomerOrderEmailProps {
  orderNumber: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  items: OrderEmailItem[];
  total: number;
  // Shown for bank transfer only:
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  whatsapp?: string;
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
const td: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "14px",
  borderBottom: "1px solid #f4f4f5",
};

export default function CustomerOrderEmail({
  orderNumber,
  customerName,
  paymentMethod,
  items,
  total,
  bankName,
  accountName,
  accountNumber,
  whatsapp,
}: CustomerOrderEmailProps) {
  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ background: "#09090b", padding: "20px 24px" }}>
          <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "18px", letterSpacing: "2px" }}>
            OLEVS
          </span>
        </div>

        <div style={{ padding: "24px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
            Thank you, {customerName}!
          </h2>
          <p style={{ margin: "0 0 16px", color: "#3f3f46", fontSize: "14px", lineHeight: 1.6 }}>
            We&apos;ve received your order <strong>{orderNumber}</strong>. Here&apos;s a summary:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={td}>
                    {item.product_name} × {item.quantity}
                  </td>
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

          {paymentMethod === "cod" ? (
            <div style={{ background: "#f0fdf4", color: "#166534", padding: "14px", borderRadius: "8px", fontSize: "14px", marginTop: "16px" }}>
              <strong>Cash on Delivery</strong>
              <br />
              Please keep {formatPrice(total)} ready. We&apos;ll contact you to confirm delivery details.
            </div>
          ) : (
            <div style={{ background: "#fffbeb", color: "#92400e", padding: "14px", borderRadius: "8px", fontSize: "14px", marginTop: "16px", lineHeight: 1.6 }}>
              <strong>Bank Transfer — next step</strong>
              <br />
              Please transfer <strong>{formatPrice(total)}</strong> to:
              <br />
              {bankName && (<>Bank: {bankName}<br /></>)}
              {accountName && (<>Account name: {accountName}<br /></>)}
              {accountNumber && (<>Account number: {accountNumber}<br /></>)}
              {whatsapp && (
                <>
                  <br />
                  Then send your payment receipt on WhatsApp: <strong>{whatsapp}</strong>
                </>
              )}
            </div>
          )}

          <p style={{ marginTop: "24px", color: "#a1a1aa", fontSize: "12px", borderTop: "1px solid #e4e4e7", paddingTop: "12px" }}>
            Questions? Just reply to this email. — OLEVS
          </p>
        </div>
      </div>
    </div>
  );
}
