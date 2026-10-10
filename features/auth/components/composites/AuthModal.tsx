'use client';

import PopupWrapper from '@/features/common/components/primitives/PopupWrapper';
import Login from './Login';
import SignUp from './SignUp';

export type AuthVariant = 'logIn' | 'signUp';

type AuthModalProps = {
  variant: AuthVariant;
  onClose: () => void;
  onChangeVariant: (variant: AuthVariant) => void;
};

const AuthModal = ({ variant, onClose, onChangeVariant }: AuthModalProps) => {
  const isLogin = variant === 'logIn';

  return (
    <PopupWrapper onClose={onClose}>
      {isLogin ? (
        <Login
          onSignUpClick={() => onChangeVariant('signUp')}
          onSuccess={onClose}
        />
      ) : (
        <SignUp
          onLogInClick={() => onChangeVariant('logIn')}
          onSuccess={onClose}
        />
      )}
    </PopupWrapper>
  );
};

export default AuthModal;
