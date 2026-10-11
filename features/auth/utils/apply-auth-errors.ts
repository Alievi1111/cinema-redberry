import axios from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { AuthApiError } from '@/features/auth/types/type';

export function applyAuthErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
  fallbackMessage: string
) {
  if (axios.isAxiosError<AuthApiError>(error)) {
    const response = error.response?.data;

    const fieldErrors = response?.errors as
      | Record<string, string[] | undefined>
      | undefined;

    let hasFieldError = false;

    for (const field of fields) {
      const message = fieldErrors?.[field]?.[0];

      if (message) {
        setError(field, { type: 'server', message });
        hasFieldError = true;
      }
    }

    if (hasFieldError) return;

    setError('root.server', {
      type: 'server',
      message: response?.message ?? fallbackMessage,
    });

    return;
  }

  setError('root.server', {
    type: 'server',
    message: fallbackMessage,
  });
}
