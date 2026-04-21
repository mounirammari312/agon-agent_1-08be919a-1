// Zod schemas for professional data validation
import { z } from 'zod';

export const algerianPhoneRegex = /^(\+213|0)(5|6|7)[0-9]{8}$/;

export const loginSchema = z.object({
  email: z.string().email({ message: 'invalidEmail' }),
  password: z.string().min(6, { message: 'minChars' }),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'minChars' }),
  email: z.string().email({ message: 'invalidEmail' }),
  phone: z.string().regex(algerianPhoneRegex, { message: 'invalidPhone' }),
  password: z.string().min(6, { message: 'minChars' }),
  role: z.enum(['buyer','supplier']),
});

export const productSchema = z.object({
  title: z.string().min(3, { message: 'minChars' }),
  description: z.string().min(10, { message: 'minChars' }),
  base_price: z.coerce.number().positive({ message: 'priceMustBePositive' }),
  min_order_qty: z.coerce.number().int().min(1),
  stock_qty: z.coerce.number().int().min(0),
  category_id: z.string().min(1),
});

export const quoteSchema = z.object({
  quantity: z.coerce.number().int().min(1),
  target_price: z.coerce.number().positive({ message: 'priceMustBePositive' }).optional(),
  message: z.string().min(5, { message: 'minChars' }),
});

export const addressSchema = z.object({
  recipient: z.string().min(2),
  phone: z.string().regex(algerianPhoneRegex, { message: 'invalidPhone' }),
  line1: z.string().min(4),
  city: z.string().min(2),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type ProductForm = z.infer<typeof productSchema>;
export type QuoteForm = z.infer<typeof quoteSchema>;
