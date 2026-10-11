import { z } from 'zod';

const futureExpiry = (value: string) => {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;
  const year = 2000 + Number(match[2]);
  const month = Number(match[1]);
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, 'Enter your full name.'),
  email: z.email('Enter a valid email address.'),
  mobileNumber: z.string().refine((value) => /^5\d{8}$/.test(value.replace(/\s/g, '')), 'Enter a Georgian mobile number starting with 5.'),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value.replace(/\s/g, '')), 'Enter a 16 digit card number.'),
  expiry: z.string().refine(futureExpiry, 'Enter a future expiry in MM/YY format.'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter a valid CVV.'),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
