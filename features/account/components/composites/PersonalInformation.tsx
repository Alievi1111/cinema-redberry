'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';

import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '../../schemas/update-profile.schema';

import type { ProfileValidationError } from '../../api/update-profile-api';
import { useUpdateProfile } from '../../hook/use-update-profile';

import ReusableUpdateProfileInput from '../primitives/ReusableUpdateProfileInput';

interface VenueOption {
  id: number;
  name: string;
}

interface PersonalInformationProps {
  venues?: VenueOption[];
}

const PersonalInformation = ({ venues = [] }: PersonalInformationProps) => {
  const { user, isLoading } = useAuthUser();
  const { mutateAsync, isPending } = useUpdateProfile();

  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      dateOfBirth: '',
      preferredVenueId: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (!user) return;

    reset({
      fullName: user.fullName ?? '',
      mobileNumber: user.mobileNumber ?? '',
      dateOfBirth: user.dateOfBirth?.slice(0, 10) ?? '',
      preferredVenueId: user.preferredVenue
        ? String(user.preferredVenue.id)
        : '',
    });
  }, [user, reset]);

  const venueOptions = useMemo(() => {
    const availableVenues = [...venues];

    if (
      user?.preferredVenue &&
      !availableVenues.some((venue) => venue.id === user.preferredVenue?.id)
    ) {
      availableVenues.unshift({
        id: user.preferredVenue.id,
        name: user.preferredVenue.name,
      });
    }

    return availableVenues.map((venue) => ({
      label: venue.name,
      value: String(venue.id),
    }));
  }, [venues, user?.preferredVenue]);

  const onSubmit = async (values: UpdateProfileFormValues) => {
    setIsSaved(false);
    clearErrors('root');

    try {
      await mutateAsync(values);
      setIsSaved(true);
    } catch (error) {
      if (
        axios.isAxiosError<ProfileValidationError>(error) &&
        error.response?.status === 422
      ) {
        const serverErrors = error.response.data.errors;

        const fields = [
          'fullName',
          'mobileNumber',
          'dateOfBirth',
          'preferredVenueId',
        ] as const;

        let hasFieldErrors = false;

        fields.forEach((field) => {
          const messages = serverErrors?.[field];

          if (messages?.length) {
            hasFieldErrors = true;

            setError(field, {
              type: 'server',
              message: messages.join('\n'),
            });
          }
        });

        if (!hasFieldErrors) {
          setError('root.server', {
            type: 'server',
            message: error.response.data.message,
          });
        }

        return;
      }

      setError('root.server', {
        type: 'server',
        message: 'Unable to update profile. Please try again.',
      });
    }
  };

  if (isLoading || !user) {
    return (
      <div
        role="status"
        className="space-y-[20px] w-full max-w-[880px] min-h-[350px] animate-pulse"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-[10px]">
            <div className="bg-white/10 rounded w-[120px] h-[14px]" />
            <div className="bg-[#1E2031] rounded-[12px] h-[40px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => setIsSaved(false)}
      className="flex flex-col gap-[18px] w-full max-w-[880px]"
    >
      <ReusableUpdateProfileInput
        id="fullName"
        label="Full name"
        placeholder="Enter your full name"
        autoComplete="name"
        registration={register('fullName')}
        error={errors.fullName?.message}
      />

      <ReusableUpdateProfileInput
        id="email"
        label="Email"
        type="email"
        value={user.email}
        readOnly
        helperText="Set at registration and cannot be changed"
      />

      <ReusableUpdateProfileInput
        id="mobileNumber"
        label="Mobile number"
        type="tel"
        placeholder="599 123 456"
        autoComplete="tel"
        registration={register('mobileNumber')}
        error={errors.mobileNumber?.message}
      />

      <ReusableUpdateProfileInput
        id="dateOfBirth"
        label="Date of birth"
        type="date"
        autoComplete="bday"
        registration={register('dateOfBirth')}
        error={errors.dateOfBirth?.message}
      />

      <ReusableUpdateProfileInput
        id="preferredVenueId"
        label="Preferred Venue (Optional)"
        type="select"
        placeholder="Select preferred venue"
        options={venueOptions}
        registration={register('preferredVenueId')}
        error={errors.preferredVenueId?.message}
      />

      <div className="flex flex-col items-start gap-[12px] mt-[16px]">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#EC3013] rounded-full w-[143px] h-[41px] font-extrabold text-[14px] cursor-pointer"
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </button>

        {errors.root?.server?.message && (
          <p role="alert" className="text-[#FF3B30] text-[12px]">
            {errors.root.server.message}
          </p>
        )}

        {isSaved && (
          <p role="status" className="font-medium text-[#4ADE80] text-[12px]">
            Profile updated successfully.
          </p>
        )}
      </div>
    </form>
  );
};

export default PersonalInformation;
