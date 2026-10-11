'use client';

import PopupWrapper from '@/features/common/components/primitives/PopupWrapper';
import Login from './Login';
import SignUp from './SignUp';

export type AuthVariant = 'logIn' | 'signUp';

type AuthModalProps = {
  variant: AuthVariant;
  onClose: () => void;
  onSuccess: () => void;
  onChangeVariant: (variant: AuthVariant) => void;
};

const AuthModal = ({
  variant,
  onClose,
  onSuccess,
  onChangeVariant,
}: AuthModalProps) => {
  const isLogin = variant === 'logIn';

  return (
    <PopupWrapper onClose={onClose}>
      {isLogin ? (
        <Login
          onSignUpClick={() => onChangeVariant('signUp')}
          onSuccess={onSuccess}
        />
      ) : (
        <SignUp
          onLogInClick={() => onChangeVariant('logIn')}
          onSuccess={onSuccess}
        />
      )}
    </PopupWrapper>
  );
};

export default AuthModal;
