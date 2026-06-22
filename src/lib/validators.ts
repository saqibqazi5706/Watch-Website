import { z } from "zod";

export const orderSchema = z.object({
  customer_name: z.string().min(2, "Name too short").max(100),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z
    .string()
    .min(10, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
  address: z.object({
    street: z.string().min(5).max(200),
    city: z.string().min(2).max(100),
    postal_code: z.string().min(4).max(10),
  }),
  payment_method: z.enum(["cod", "bank_transfer"]),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        product_name: z.string().min(1).max(200),
        quantity: z.number().int().positive().max(20),
        price: z.number().positive(),
      })
    )
    .min(1, "Cart cannot be empty")
    .max(50),
});

export type OrderInput = z.infer<typeof orderSchema>;
