import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppWrapper from "./app-wrapper.component";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

export const metadata: Metadata = {
  title: "Playwise Guru - Best Online Casino Bonuses & Reviews",
  description: "Discover the best online casino bonuses, reviews, and free games. Trusted guides for safe and secure online gambling.",
};

// Force dynamic rendering at root level
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Google Analytics - Only load if measurement ID is provided */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <AppWrapper>
          {children}
          {gaId && <GoogleAnalytics />}
        </AppWrapper>
      </body>
    </html>
  );
}
