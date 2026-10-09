import Link from "next/link";

import { LoginForm } from "@/features/auth/components/composites/LoginForm";

const Auth = () => {
  return (
    <>
      <LoginForm />
      <p>
        Don&apos;t have an account? <Link href="/register">Sign Up</Link>
      </p>
    </>
  );
};

export default Auth;
