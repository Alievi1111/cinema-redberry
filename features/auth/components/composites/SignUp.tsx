'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/features/auth/hook/use-register';
import { registerSchema } from '@/features/auth/schema/register-schema';
import type {
  RegisterPayload,
  RegisterSession,
} from '@/features/auth/types/type';
import { applyAuthErrors } from '@/features/auth/utils/apply-auth-errors';
import {
  AuthFeedback,
  AuthFormHeader,
  AuthFormSwitch,
  AuthSubmitButton,
} from '../primitives/AuthFormUI';
import AvatarUpload from '../primitives/AvatarUpload';
import AuthInput from '../primitives/AuthInput';

type SignUpProps = {
  onLogInClick: () => void;
  onSuccess?: (session: RegisterSession) => void;
};

const fields = [
  'username',
  'email',
  'password',
  'password_confirmation',
  'avatar',
] as const;

const SignUp = ({ onLogInClick, onSuccess }: SignUpProps) => {
  const registration = useRegister();

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      avatar: null,
    },
  });

  const [username, email, password, confirmPassword] = useWatch({
    control,
    name: ['username', 'email', 'password', 'password_confirmation'],
  });

  const isFilled = Boolean(
    username?.trim() &&
    email?.trim() &&
    password?.trim() &&
    confirmPassword?.trim()
  );

  const submit = async (values: RegisterPayload) => {
    clearErrors('root.server');

    try {
      const session = await registration.mutateAsync(values);
      onSuccess?.(session);
    } catch (error) {
      applyAuthErrors(error, setError, fields, 'Unable to sign up. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <AuthFormHeader title="Sign up" />

      <div className="mt-[24px]">
        <AvatarUpload control={control} error={errors.avatar?.message} />
      </div>

      <div className="mt-[32px]">
        <AuthInput
          id="register-username"
          label="Username"
          type="text"
          placeholder="User"
          autoComplete="username"
          registration={register('username')}
          error={errors.username?.message}
        />
      </div>

      <div className="mt-[24px]">
        <AuthInput
          id="register-email"
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="flex sm:flex-row flex-col gap-[12px] mt-[24px]">
        <div className="flex-1 min-w-0">
          <AuthInput
            id="register-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            registration={register('password')}
            error={errors.password?.message}
          />
        </div>

        <div className="flex-1 min-w-0">
          <AuthInput
            id="register-password-confirmation"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            registration={register('password_confirmation')}
            error={errors.password_confirmation?.message}
          />
        </div>
      </div>

      <AuthFeedback message={errors.root?.server?.message} />

      {registration.isSuccess && (
        <AuthFeedback
          success
          message={`Registered as ${registration.data.user.username}.${
            !registration.data.user.profileComplete
              ? ' Complete your profile before booking.'
              : ''
          }`}
        />
      )}

      <div className="mt-[30px]">
        <AuthSubmitButton
          isPending={registration.isPending}
          isFilled={isFilled}
        >
          {registration.isPending ? 'Signing up...' : 'Sign up'}
        </AuthSubmitButton>
      </div>

      <AuthFormSwitch
        className="mt-[24px]"
        text="Already have an account?"
        action="Log in"
        onClick={onLogInClick}
      />
    </form>
  );
};

export default SignUp;
