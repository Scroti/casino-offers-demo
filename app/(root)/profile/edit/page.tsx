"use client";

import { useEffect, useState, Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useMeQuery, useUpdateProfileMutation } from "@/app/lib/data-access/configs/auth.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function EditProfilePageContent() {
  const router = useRouter();
  const { user: authUser, accessToken, hydrated } = useAuth();
  const { data: userProfile, isLoading: isLoadingProfile, refetch } = useMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "prefer-not-to-say" | "">("");
  const [ageRange, setAgeRange] = useState<"18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+" | "prefer-not-to-say" | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setProfileImageUrl(userProfile.profileImageUrl || "");
      setGender((userProfile.gender as any) || "");
      setAgeRange((userProfile.ageRange as any) || "");
    }
  }, [userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (hydrated && !accessToken && !authUser) {
      router.push("/login");
    }
  }, [hydrated, accessToken, authUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const updateData: {
        name?: string;
        profileImageUrl?: string;
        gender?: "male" | "female" | "prefer-not-to-say";
        ageRange?: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+" | "prefer-not-to-say";
      } = {};

      if (name && name.trim()) {
        updateData.name = name.trim();
      }
      if (profileImageUrl && profileImageUrl.trim()) {
        updateData.profileImageUrl = profileImageUrl.trim();
      }
      // Always include gender and ageRange so they're saved/updated
      // Send the value if it exists, otherwise send undefined to keep existing value
      if (gender) {
        updateData.gender = gender as "male" | "female" | "prefer-not-to-say";
      }
      if (ageRange) {
        updateData.ageRange = ageRange as "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+" | "prefer-not-to-say";
      }

      await updateProfile(updateData).unwrap();
      setSuccess("Profile updated successfully!");
      refetch(); // Refresh user data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  if (!hydrated || isLoadingProfile) {
    return (
      <div className="container py-5 px-5 mx-auto max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!accessToken && !authUser) {
    return null; // Will redirect
  }

  return (
    <div className="container py-5 px-5 mx-auto max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile information and demographic details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Preview */}
            {(profileImageUrl || userProfile?.profileImageUrl) && (
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImageUrl || userProfile?.profileImageUrl} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    Update your profile image URL
                  </p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email (Read-only) */}
            {userProfile?.email && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>
            )}

            {/* Profile Image URL */}
            <div className="space-y-2">
              <Label htmlFor="profileImageUrl">Profile Image URL</Label>
              <Input
                id="profileImageUrl"
                type="url"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/your-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile picture
              </p>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value as any)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This helps us provide better personalized content
              </p>
            </div>

            {/* Age Range Selection */}
            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range</Label>
              <Select
                value={ageRange}
                onValueChange={(value) => setAgeRange(value as any)}
              >
                <SelectTrigger id="ageRange">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55-64">55-64</SelectItem>
                  <SelectItem value="65+">65+</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This helps us understand our user demographics
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading profile...</p>
      </div>
    }>
      <EditProfilePageContent />
    </Suspense>
  );
}

