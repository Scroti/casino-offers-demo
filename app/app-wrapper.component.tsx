"use client";
import { Provider } from "react-redux"; 
import { store } from "./lib/data-access/store/store.config";
import { ThemeProvider } from "@/components/theme-provider";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { AuthProvider } from "@/context/auth.context";
import { GlobalLoader } from "@/components/global-loader";

export default function AppWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GlobalLoader/>
        {children}
        <NewsletterPopup />
      </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
