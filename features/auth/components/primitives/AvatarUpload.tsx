'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useController, type Control } from 'react-hook-form';

import type { RegisterPayload } from '@/features/auth/types/type';

type AvatarUploadProps = {
  control: Control<RegisterPayload>;
  error?: string;
};

const AvatarUpload = ({ control, error }: AvatarUploadProps) => {
  const { field } = useController({
    name: 'avatar',
    control,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const handleFileChange = (file?: File) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const url = file?.type.startsWith('image/')
      ? URL.createObjectURL(file)
      : null;

    previewRef.current = url;
    setPreviewUrl(url);
    field.onChange(file ?? null);
  };

  return (
    <div>
      <input
        id="register-avatar"
        type="file"
        name={field.name}
        ref={field.ref}
        onBlur={field.onBlur}
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'register-avatar-error' : undefined}
        className="sr-only"
      />

      <label
        htmlFor="register-avatar"
        className="flex items-center gap-[10px] cursor-pointer"
      >
        <div className="flex justify-center items-center bg-[#1D2033] rounded-[8px] w-[40px] h-[40px] overflow-hidden shrink-0">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar preview"
              width={40}
              height={40}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <Image src="/icons/uploadicon.svg" alt="" width={12} height={11} />
          )}
        </div>

        <div>
          <p className="font-semibold text-[14px] text-white leading-[18px]">
            Upload avatar (optional)
          </p>

          <p className="mt-[3px] text-[#A6A6AD] text-[12px] leading-[16px]">
            JPG, PNG or WEBP
          </p>
        </div>
      </label>

      {error && (
        <p
          id="register-avatar-error"
          role="alert"
          className="mt-2 text-[#FF3B30] text-[12px]"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AvatarUpload;
