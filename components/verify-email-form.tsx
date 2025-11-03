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
import { Mail, CheckCircle2, ArrowLeft, RotateCcw } from "lucide-react";
import { 
  useVerifyEmailMutation, 
  useResendVerificationEmailMutation 
} from "@/app/lib/data-access/configs/auth.config";

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [verifyEmailMutation, { isLoading, error }] = useVerifyEmailMutation();
  const [resendVerificationMutation, { isLoading: isResending }] = useResendVerificationEmailMutation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleAutoVerify = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    setFormError(null);

    try {
      await verifyEmailMutation({ token }).unwrap();
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 3000);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Invalid or expired verification token.";
      setFormError(apiMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // If token is present in URL, auto-verify
  useEffect(() => {
    if (token && !isSuccess && !isVerifying) {
      handleAutoVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isSuccess, isVerifying]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setResendSuccess(false);
    setVerificationCode(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!verificationCode) {
      setFormError("Please enter the verification code.");
      return;
    }

    if (verificationCode.length !== 6) {
      setFormError("Verification code must be 6 digits.");
      return;
    }

    try {
      await verifyEmailMutation({ code: verificationCode }).unwrap();
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 3000);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Invalid verification code. Please try again.";
      setFormError(apiMessage);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setFormError("Email address is required to resend verification code.");
      return;
    }

    setFormError(null);
    setResendSuccess(false);

    try {
      await resendVerificationMutation({ email }).unwrap();
      setResendSuccess(true);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to resend verification email. Please try again.";
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
              <h1 className="text-2xl font-bold">Email verified!</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Your email has been successfully verified. Redirecting to login...
              </p>
            </div>
          </div>

          <Field>
            <Link href="/login?verified=true">
              <Button className="w-full">
                Continue to login
              </Button>
            </Link>
          </Field>
        </FieldGroup>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Verifying your email</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
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
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {email 
              ? `We've sent a verification code to ${email}`
              : "Enter the verification code sent to your email address"
            }
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="code">Verification Code</FieldLabel>
          <Input
            id="code"
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={onChange}
            maxLength={6}
            required
            className="text-center text-2xl tracking-widest font-mono"
          />
          <FieldDescription>
            Enter the 6-digit code from your email.
          </FieldDescription>
        </Field>

        {/* Error block shown only if there's a form (validation or API) error */}
        {formError && (
          <div className="mt-2 text-red-600 text-center text-sm">
            {formError}
          </div>
        )}

        {/* Success message for resend */}
        {resendSuccess && (
          <div className="mt-2 text-green-600 text-center text-sm">
            Verification email sent successfully!
          </div>
        )}

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Verify email"}
          </Button>
        </Field>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="w-full"
          >
            <RotateCcw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? "Sending..." : "Resend code"}
          </Button>

          <FieldDescription className="text-center">
            <Link href="/login" className="underline underline-offset-4 font-medium">
              <ArrowLeft className="inline mr-1 h-3 w-3" />
              Back to login
            </Link>
          </FieldDescription>
        </div>
      </FieldGroup>
    </form>
  );
}

