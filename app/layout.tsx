import type { Metadata } from "next";
import "./globals.css";
import AppWrapper from "./app-wrapper.component";

export const metadata: Metadata = {
  title: "Playwise Guru - Best Online Casino Bonuses & Reviews",
  description: "Discover the best online casino bonuses, reviews, and free games. Trusted guides for safe and secure online gambling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
