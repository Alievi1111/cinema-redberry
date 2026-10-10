'use client';

import PopupWrapper from '@/features/common/components/primitives/PopupWrapper';
import Login from '../primitives/Login';
import SignUp from '../primitives/SignUp';

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
        <Login onSignUpClick={() => onChangeVariant('signUp')} />
      ) : (
        <SignUp onLogInClick={() => onChangeVariant('logIn')} />
      )}
    </PopupWrapper>
  );
};

export default AuthModal;
