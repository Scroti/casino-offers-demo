'use client';

import React from "react";
import { useSignupMutation } from "@/app/lib/data-access/configs/auth.config";
import { useI18n } from "@/context/i18n.context";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCachedCountries, type SimpleCountry } from "@/lib/services/countries-api";
import { allLanguages, type Language } from "@/lib/services/languages-api";
import { defaultLanguage, getLanguageFromCountry } from "@/lib/i18n/i18n";
import { Chrome } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { language } = useI18n();
  const [detectedCountry, setDetectedCountry] = React.useState<string>('');
  const [countries, setCountries] = React.useState<SimpleCountry[]>([]);
  const [loadingCountries, setLoadingCountries] = React.useState(true);
  
  // Fetch all countries on mount
  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const allCountries = await getCachedCountries();
        setCountries(allCountries);
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  // Detect country and language on mount
  React.useEffect(() => {
    const detectCountryAndLanguage = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json');
        const locationData = await res.json();
        if (locationData.country) {
          setDetectedCountry(locationData.country);
          // Auto-detect language based on country
          const detectedLang = getLanguageFromCountry(locationData.country);
          setFormData((prev) => ({ ...prev, language: detectedLang }));
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
      }
    };
    detectCountryAndLanguage();
  }, []);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: detectedCountry || "",
    language: language || defaultLanguage,
  });

  // Update form data when country is detected
  React.useEffect(() => {
    if (detectedCountry) {
      setFormData((prev) => ({ 
        ...prev, 
        country: detectedCountry,
        // Auto-update language based on detected country
        language: getLanguageFromCountry(detectedCountry)
      }));
    }
  }, [detectedCountry]);

  const router = useRouter();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [signUp, { isLoading, error }] = useSignupMutation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null); // clear as user types
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSelectChange = (field: 'country' | 'language', value: string) => {
    setFormError(null);
    if (field === 'country') {
      // Auto-update language when country changes
      const detectedLang = getLanguageFromCountry(value);
      setFormData((prev) => ({
        ...prev,
        country: value,
        language: detectedLang,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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
        country: formData.country || undefined,
        language: formData.language || undefined,
      }).unwrap();
      
      // Redirect to verify email page if verification is required
      if (result.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        // This shouldn't happen, but handle it just in case
        router.push('/login');
      }
    } catch (err: any) {
      // RTK Query error shape: { data?: { message?: string } }
      const msg =
        err?.data?.message ||
        err?.error ||
        "Signup failed. Please try again.";
      setFormError(msg);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    console.log('Google signup clicked');
    // You can implement Google OAuth here
  };

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup className="gap-5">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Form Fields - Username and Email full width, rest in 2 columns */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Username - Full Width */}
          <Field className="gap-2">
            <FieldLabel htmlFor="name" className="text-sm font-medium">Username</FieldLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={onChange}
              type="text"
              placeholder="John Doe"
              required
              className="w-full transition-all"
            />
          </Field>

          {/* Row 2: Email - Full Width */}
          <Field className="gap-2">
            <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
            <Input
              id="email"
              value={formData.email}
              onChange={onChange}
              type="email"
              placeholder="m@example.com"
              required
              className="w-full transition-all"
            />
          </Field>

          {/* Row 3: Password and Confirm Password - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <Field className="gap-2">
              <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
              <Input
                id="password"
                value={formData.password}
                onChange={onChange}
                type="password"
                required
                className="w-full transition-all"
              />
              <FieldDescription className="text-xs text-muted-foreground/80">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                type="password"
                required
                className="w-full transition-all"
              />
              <FieldDescription className="text-xs text-muted-foreground/80">
                Please confirm your password.
              </FieldDescription>
            </Field>
          </div>

          {/* Row 4: Country and Language - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <Field className="gap-2">
              <FieldLabel htmlFor="country" className="text-sm font-medium">Country</FieldLabel>
              <Select
                value={formData.country}
                onValueChange={(value) => onSelectChange('country', value)}
                disabled={loadingCountries}
              >
                <SelectTrigger id="country" className="w-full transition-all">
                  <SelectValue placeholder={loadingCountries ? "Loading countries..." : "Select your country"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="language" className="text-sm font-medium">Language</FieldLabel>
              <Select
                value={formData.language}
                onValueChange={(value) => onSelectChange('language', value)}
              >
                <SelectTrigger id="language" className="w-full transition-all">
                  <SelectValue placeholder="Select your language" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {allLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} {lang.nativeName !== lang.name ? `(${lang.nativeName})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        {/* Error block shown only if there's a form (validation or API) error */}
        {(formError || error) && (
          <div className="mt-1 text-red-600 text-center text-sm col-span-full">
            {formError ||
              (error &&
                // Try to display API error message, fallback to stringified error
                (typeof error === "object" && "data" in error && (error as any).data?.message
                  ? (error as any).data?.message
                  : JSON.stringify(error)))}
          </div>
        )}

        {/* Action Buttons - Full Width */}
        <div className="col-span-full space-y-3 mt-2">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-10 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </Button>

          <FieldSeparator className="!-my-0">Or continue with</FieldSeparator>

          <Button
            type="button"
            variant="outline"
            className="w-full h-10 border-2 hover:bg-accent/50 transition-all"
            onClick={handleGoogleSignup}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="text-center text-sm text-muted-foreground pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
