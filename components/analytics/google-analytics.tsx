'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics Measurement ID (GA4)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export function initGA() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  // Add gtag script if not already added
  if (document.querySelector(`script[src*="gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    return;
  }

  // Add gtag.js script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Add inline script for gtag initialization
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `;
  document.head.appendChild(script2);
}

// Track page views
export function trackPageView(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  (window as any).gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  (window as any).gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// GoogleAnalytics component to initialize and track page views
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize GA on mount
    initGA();
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (GA_MEASUREMENT_ID && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

