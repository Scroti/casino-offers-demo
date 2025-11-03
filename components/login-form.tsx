"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useLoginMutation,
  useMeQuery,
} from "@/app/lib/data-access/configs/auth.config";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Chrome, CheckCircle2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const { login, accessToken } = useAuth();
  const router = useRouter();
  
  const passwordReset = searchParams?.get("passwordReset") === "true";
  const verified = searchParams?.get("verified") === "true";

  const { data: user, isSuccess: isUserSuccess } = useMeQuery(undefined, {
    skip: !accessToken, // Skip query if no access token yet
  });

  useEffect(() => {
    if (user && isUserSuccess) {
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, isUserSuccess, router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.email || !formData.password) {
      setFormError("Please provide both email and password.");
      return;
    }
    try {
      const result = await loginMutation(formData).unwrap();
      login(result.accessToken, result.refreshToken);
      // Optionally redirect or show logged-in state/UI
    } catch (err: any) {
      // Try to extract error message from RTK Query shape
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Login failed. Please check your credentials.";
      setFormError(apiMessage);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Success messages */}
        {passwordReset && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Password reset successfully! You can now login with your new password.
            </p>
          </div>
        )}
        {verified && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Email verified successfully! You can now login to your account.
            </p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={onChange}
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            required
          />
        </Field>

        {/* Error block shown only if there's a form (validation or API) error */}
        {(formError || error) && (
          <div className="mt-2 text-red-600 text-center">
            {formError ||
              (error &&
                (typeof error === "object" &&
                "data" in error &&
                (error as any).data?.message
                  ? (error as any).data?.message
                  : JSON.stringify(error)))}
          </div>
        )}

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => {
              // TODO: Implement Google OAuth
              console.log('Google login clicked');
            }}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
