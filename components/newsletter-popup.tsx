"use client";

import { useState, useEffect, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { newsletterApi, useSubscribeToNewsletterMutation } from "@/app/lib/data-access/configs/newsletter.config";

export const NewsletterPopup = memo(function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch<any>();
  const [subscribe, { isLoading: isSubscribing }] = useSubscribeToNewsletterMutation();

  useEffect(() => {
    const shown = localStorage.getItem("newsletter_shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem("newsletter_shown", "true");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopupAfter = (ms: number) =>
    setTimeout(() => {
      setFeedback(null);
      setIsError(false);
      setOpen(false);
    }, ms);

  const handleSubscribe = async () => {
    if (!email) {
      setFeedback("Please enter a valid email!");
      setIsError(true);
      return;
    }
    try {
      // Run check endpoint imperatively and destructure data
      const result = await dispatch(newsletterApi.endpoints.checkIfNewsletterSubscriber.initiate(email));
      const { data } = result;

      // Strict check on subscription status
      if (data && data.subscribed === true) {
        setFeedback("Thank you, you are already subscribed!");
        setIsError(false);
        closePopupAfter(3000);
        return;
      }

      // Call subscribe mutation only if not subscribed
      await subscribe(email).unwrap();
      setFeedback("Subscribed successfully! 🎉");
      setIsError(false);
      closePopupAfter(3000);
    } catch (error) {
      setFeedback("An error occurred. Please try again.");
      setIsError(true);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (feedback) setFeedback(null);
    if (isError) setIsError(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Mail className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10 w-fit">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Don&apos;t Miss Exclusive Casino Bonuses!
          </DialogTitle>
          <DialogDescription className="text-base">
            Subscribe now to get the latest{" "}
            <span className="font-semibold text-primary">no deposit offers</span>,{" "}
            <span className="font-semibold text-primary">free spins</span>, and{" "}
            <span className="font-semibold text-primary">VIP promotions</span> —
            delivered straight to your inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={onInputChange}
            disabled={isSubscribing}
            className="flex-1"
          />
          <Button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="whitespace-nowrap"
          >
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          No spam. Only exclusive casino offers.
        </p>

        {feedback && (
          <div className={`text-center font-medium ${isError ? "text-destructive" : "text-green-600 dark:text-green-400"}`}>
            {feedback}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});
