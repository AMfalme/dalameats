"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider"; // adjust this path to your auth hook
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // assuming your hook provides these

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null; // or a spinner while checking auth

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
