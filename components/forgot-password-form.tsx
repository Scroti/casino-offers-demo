"use client";

import React, { useState } from "react";
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
import { Mail, ArrowLeft } from "lucide-react";
import { useForgotPasswordMutation } from "@/app/lib/data-access/configs/auth.config";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [forgotPasswordMutation, { isLoading, error }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      await forgotPasswordMutation({ email }).unwrap();
      setIsSuccess(true);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to send reset email. Please try again.";
      setFormError(apiMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-muted-foreground text-sm text-balance">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>

          <Field>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
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
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={onChange}
            required
          />
          <FieldDescription>
            We&apos;ll send a password reset link to this email address.
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
                  : "Failed to send reset email. Please try again."))}
          </div>
        )}

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Remember your password?{" "}
          <Link href="/login" className="underline underline-offset-4 font-medium">
            Back to login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

