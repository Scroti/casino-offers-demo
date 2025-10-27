'use client';

import React from "react";
import { useSignupMutation } from "@/app/lib/data-access/configs/auth.config";
import { useAuth } from "@/context/auth.context";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [signUp, { isLoading, error }] = useSignupMutation();
  const { login } = useAuth();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null); // clear as user types
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      login(result.accessToken, result.refreshToken);
       router.push('/');
      // Optionally redirect or show a success message here
    } catch (err: any) {
      // RTK Query error shape: { data?: { message?: string } }
      const msg =
        err?.data?.message ||
        err?.error ||
        "Signup failed. Please try again.";
      setFormError(msg);
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={onChange}
            type="text"
            placeholder="John Doe"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            value={formData.email}
            onChange={onChange}
            type="email"
            placeholder="m@example.com"
            required
          />
          <FieldDescription>
            We’ll use this to contact you. Will not share your email.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            value={formData.password}
            onChange={onChange}
            type="password"
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
            value={formData.confirmPassword}
            onChange={onChange}
            type="password"
            required
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        {/* Error block shown only if there's a form (validation or API) error */}
        {(formError || error) && (
          <div className="mt-2 text-red-600 text-center">
            {formError ||
              (error &&
                // Try to display API error message, fallback to stringified error
                (typeof error === "object" && "data" in error && (error as any).data?.message
                  ? (error as any).data?.message
                  : JSON.stringify(error)))}
          </div>
        )}
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
      </FieldGroup>
    </form>
  );
}
