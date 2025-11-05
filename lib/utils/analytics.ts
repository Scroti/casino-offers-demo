/**
 * Google Analytics utility functions
 * Use these to track events throughout your application
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Declare gtag function
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a page view
 */
export function trackPageView(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Track button clicks
 */
export function trackButtonClick(buttonName: string, location?: string) {
  trackEvent('click', 'button', `${buttonName}${location ? ` - ${location}` : ''}`);
}

/**
 * Track form submissions
 */
export function trackFormSubmit(formName: string, success: boolean = true) {
  trackEvent('submit', 'form', `${formName} - ${success ? 'success' : 'error'}`);
}

/**
 * Track user actions
 */
export function trackUserAction(action: string, details?: string) {
  trackEvent(action, 'user_action', details);
}

/**
 * Track casino interactions
 */
export function trackCasinoView(casinoName: string) {
  trackEvent('view', 'casino', casinoName);
}

/**
 * Track bonus interactions
 */
export function trackBonusClick(bonusTitle: string, casinoName?: string) {
  trackEvent('click', 'bonus', `${bonusTitle}${casinoName ? ` - ${casinoName}` : ''}`);
}

/**
 * Track game interactions
 */
export function trackGamePlay(gameName: string) {
  trackEvent('play', 'game', gameName);
}

