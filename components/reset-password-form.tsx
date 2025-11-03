"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Lock } from "lucide-react";
import { useResetPasswordMutation } from "@/app/lib/data-access/configs/auth.config";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [resetPasswordMutation, { isLoading, error }] = useResetPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setFormError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const { id, value } = e.target;
    if (id === "password") {
      setPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError("Invalid or missing reset token.");
      return;
    }

    if (!password) {
      setFormError("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordMutation({ token, password }).unwrap();
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?passwordReset=true");
      }, 3000);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to reset password. Please try again.";
      setFormError(apiMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Password reset successfully!</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Your password has been reset. Redirecting to login...
              </p>
            </div>
          </div>

          <Field>
            <Link href="/login?passwordReset=true">
              <Button className="w-full">
                Continue to login
              </Button>
            </Link>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={onChange}
            required
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={onChange}
            required
          />
          <FieldDescription>
            Please confirm your new password.
          </FieldDescription>
        </Field>

        {/* Error block shown only if there's a form (validation or API) error */}
        {(formError || error) && (
          <div className="mt-2 text-red-600 text-center text-sm">
            {formError ||
              (error &&
                (typeof error === "object" &&
                "data" in error &&
                (error as any).data?.message
                  ? (error as any).data?.message
                  : "Failed to reset password. Please try again."))}
          </div>
        )}

        <Field>
          <Button type="submit" disabled={isLoading || !token} className="w-full">
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          <Link href="/login" className="underline underline-offset-4 font-medium">
            <ArrowLeft className="inline mr-1 h-3 w-3" />
            Back to login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

