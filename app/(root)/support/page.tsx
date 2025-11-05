"use client";

import { useState, Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useContactMutation } from "@/app/lib/data-access/configs/contact.config";
import { useAuth } from "@/context/auth.context";
import { PageHeader } from "@/components/shared/PageHeader";

function SupportPageContent() {
  const { user } = useAuth();
  const [contact, { isLoading }] = useContactMutation();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    category: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await contact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
      }).unwrap();
      
      setSuccess(true);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        category: "",
        message: "",
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to send message. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    if (success) setSuccess(false);
  };

  return (
    <div className="container py-5 px-5 mx-auto max-w-4xl">
      <PageHeader title="Contact Support" />
      
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              We're here to help! Reach out to us with any questions or concerns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  support@playwiseguru.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your name"
                  required
                  disabled={!!user}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={!!user}
                />
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Please provide as much detail as possible..."
                  rows={6}
                  required
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading support page...</p>
      </div>
    }>
      <SupportPageContent />
    </Suspense>
  );
}

