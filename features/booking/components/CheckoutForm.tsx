'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { AuthUser } from '@/features/auth/types/type';
import { formatCardExpiry } from '../lib/format-card-expiry';
import { checkoutSchema, type CheckoutValues } from '../schema/checkout-schema';

const fields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name', placeholder: 'Full name' },
  { name: 'email', label: 'Email', autoComplete: 'email', placeholder: 'Email address' },
  { name: 'mobileNumber', label: 'Mobile number', autoComplete: 'tel', placeholder: '599 123 456' },
  { name: 'cardNumber', label: 'Card number', autoComplete: 'cc-number', placeholder: '1234 5678 9012 3456' },
  { name: 'expiry', label: 'Expiry', autoComplete: 'cc-exp', placeholder: 'MM/YY' },
  { name: 'cvv', label: 'CVV', autoComplete: 'cc-csc', placeholder: '123' },
] as const;

export type CheckoutError = { message: string; errors?: Record<string, string[]> };

interface CheckoutFormProps {
  user: AuthUser;
  pending: boolean;
  error: CheckoutError | null;
  onSubmit: (values: CheckoutValues) => Promise<void>;
}

export default function CheckoutForm({ user, pending, error, onSubmit }: CheckoutFormProps) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user.fullName ?? '', email: user.email,
      mobileNumber: user.mobileNumber ?? '', cardNumber: '', expiry: '', cvv: '',
    },
  });

  useEffect(() => {
    if (!error?.errors) return;
    for (const field of fields) {
      const message = error.errors[field.name]?.join(' ');
      if (message) setError(field.name, { type: 'server', message });
    }
  }, [error, setError]);

  return (
    <form id="booking-checkout" onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-2 gap-x-3 gap-y-4">
      {fields.map((field) => {
        const registration = register(field.name);
        return (
          <label key={field.name} className={`block text-xs font-semibold text-white ${field.name === 'fullName' || field.name === 'cardNumber' ? 'col-span-2' : ''}`}>
            {field.label}
            <input
              {...registration}
              onChange={field.name === 'expiry' ? (event) => {
                event.target.value = formatCardExpiry(event.target.value);
                void registration.onChange(event);
              } : registration.onChange}
              type={field.name === 'email' ? 'email' : field.name === 'cvv' ? 'password' : 'text'}
              inputMode={field.name === 'cardNumber' || field.name === 'expiry' || field.name === 'cvv' || field.name === 'mobileNumber' ? 'numeric' : undefined}
              maxLength={field.name === 'expiry' ? 5 : undefined}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              disabled={pending}
              className="mt-2 block w-full rounded-xl bg-[#1E2031] px-4 py-3 text-sm text-white outline-none placeholder:text-[#A9A9A9] focus-visible:ring-2 focus-visible:ring-[#EC3013] disabled:opacity-70"
            />
            {errors[field.name]?.message && <span role="alert" className="mt-1 block font-normal text-[#FF634F]">{errors[field.name]?.message}</span>}
          </label>
        );
      })}
      {error?.message && (!error.errors || !fields.some((field) => error.errors?.[field.name]?.length)) && <p role="alert" className="col-span-2 text-sm text-[#FF634F]">{error.message}</p>}
    </form>
  );
}
