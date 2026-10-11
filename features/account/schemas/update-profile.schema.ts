import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),

  mobileNumber: z.string().trim().min(1, 'Mobile number is required'),

  dateOfBirth: z.string().min(1, 'Date of birth is required'),

  preferredVenueId: z.string(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
