import { api } from '@/lib/api';

import type { AuthUser } from '@/features/auth/types/type';
import type { UpdateProfileFormValues } from '../schemas/update-profile.schema';

interface UpdateProfileResponse {
  data: AuthUser;
}

export interface ProfileValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export const updateProfileApi = async (
  payload: UpdateProfileFormValues
): Promise<AuthUser> => {
  const formData = new FormData();

  formData.append('fullName', payload.fullName);
  formData.append('mobileNumber', payload.mobileNumber);
  formData.append('dateOfBirth', payload.dateOfBirth);

  if (payload.preferredVenueId !== '') {
    formData.append('preferredVenueId', payload.preferredVenueId);
  }

  const response = await api.put<UpdateProfileResponse>('/profile', formData);

  return response.data.data;
};
