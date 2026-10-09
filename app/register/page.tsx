import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/composites/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </>
  );
}
