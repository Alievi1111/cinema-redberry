'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/features/auth/hook/use-login';
import { loginSchema } from '@/features/auth/schema/login-schema';
import type { LoginPayload, LoginSession } from '@/features/auth/types/type';
import {
  AuthFeedback,
  AuthFormHeader,
  AuthFormSwitch,
  AuthSubmitButton,
} from '../primitives/AuthFormUI';
import AuthInput from '../primitives/AuthInput';
import { applyAuthErrors } from '@/features/auth/utils/apply-auth-errors';

type LoginProps = {
  onSignUpClick: () => void;
  onSuccess?: (session: LoginSession) => void;
};

const Login = ({ onSignUpClick, onSuccess }: LoginProps) => {
  const login = useLogin();

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [email, password] = useWatch({
    control,
    name: ['email', 'password'],
  });

  const isFilled = Boolean(email?.trim() && password?.trim());

  const submit = async (values: LoginPayload) => {
    clearErrors('root.server');

    try {
      const session = await login.mutateAsync(values);
      onSuccess?.(session);
    } catch (error) {
      applyAuthErrors(
        error,
        setError,
        ['email', 'password'],
        'Unable to log in. Try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <AuthFormHeader title="Log in" />

      <div className="flex flex-col gap-[24px] mt-[24px]">
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />

        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          registration={register('password')}
          error={errors.password?.message}
        />
      </div>

      <AuthFeedback message={errors.root?.server?.message} />

      {login.isSuccess && (
        <AuthFeedback
          success
          message={`Logged in as ${login.data.user.username}.`}
        />
      )}

      <div className="mt-[32px]">
        <AuthSubmitButton isPending={login.isPending} isFilled={isFilled}>
          {login.isPending ? 'Logging in...' : 'Log in'}
        </AuthSubmitButton>
      </div>

      <AuthFormSwitch
        className="mt-[16px]"
        text="Don't have an account?"
        action="Sign up"
        onClick={onSignUpClick}
      />
    </form>
  );
};

export default Login;
