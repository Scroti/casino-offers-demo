"use client";

import * as React from "react";
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

import { useDispatch } from "react-redux";
import { newsletterApi, useSubscribeToNewsletterMutation } from "@/app/lib/data-access/configs/newsletter.config";

export function NewsletterPopup() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isError, setIsError] = React.useState(false);

  const dispatch = useDispatch<any>();
  const [subscribe, { isLoading: isSubscribing }] = useSubscribeToNewsletterMutation();

  React.useEffect(() => {
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

  // Reset feedback on input change
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
          className="fixed bottom-6 right-6 z-50 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
        >
          🎁 Subscribe
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg p-7 text-center rounded-2xl border bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-extrabold text-yellow-400 tracking-tight">
            💌 Don’t Miss Exclusive Casino Bonuses & Free Spin Deals!
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-sm leading-relaxed">
            Subscribe now to get the latest{" "}
            <span className="font-semibold text-yellow-300">no deposit offers</span>,{" "}
            <span className="font-semibold text-yellow-300">free spins</span>, and{" "}
            <span className="font-semibold text-yellow-300">VIP promotions</span> —
            delivered straight to your inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={onInputChange}
            className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus-visible:ring-yellow-500"
            disabled={isSubscribing}
          />
          <Button
            onClick={handleSubscribe}
            className="bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-colors"
            disabled={isSubscribing}
          >
            {isSubscribing ? "Please wait..." : "Subscribe"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-3 italic">
          No spam. Only exclusive casino offers. 🎰
        </p>

        {feedback && (
          <p className={`${isError ? "text-red-500" : "text-yellow-300"} mt-3 font-semibold`}>
            {feedback}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
