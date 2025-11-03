'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useLazyValidateCampaignTokenQuery } from '@/app/lib/data-access/configs/campaigns.config';

/**
 * Detects if user came from a valid campaign token and stores it in cookie
 * Looks for: ?campaign=TOKEN (e.g., ?campaign=summer2024)
 * Validates the token against the database
 */
export function useEmailCampaign() {
  const searchParams = useSearchParams();
  const [isFromCampaign, setIsFromCampaign] = useState<boolean>(false);
  const [campaignToken, setCampaignToken] = useState<string | null>(null);
  const [validateCampaign, { isLoading }] = useLazyValidateCampaignTokenQuery();

  useEffect(() => {
    // Check cookie first - if we already have a valid campaign saved
    const savedCampaignToken = Cookies.get('campaign-token');
    if (savedCampaignToken) {
      // Re-validate the campaign to ensure it's still valid and not expired
      validateCampaign(savedCampaignToken)
        .then((result) => {
          if (result.data?.valid && result.data?.campaign) {
            // Campaign is still valid
            setCampaignToken(savedCampaignToken);
            setIsFromCampaign(true);
          } else {
            // Campaign has expired or is invalid, remove cookie
            Cookies.remove('campaign-token', { path: '/' });
            setCampaignToken(null);
            setIsFromCampaign(false);
          }
        })
        .catch(() => {
          // On error, remove cookie to be safe
          Cookies.remove('campaign-token', { path: '/' });
          setCampaignToken(null);
          setIsFromCampaign(false);
        });
      return;
    }

    // Check URL parameters for campaign token
    const campaignParam = searchParams?.get('campaign');
    
    if (campaignParam) {
      // Validate the campaign token against the database
      validateCampaign(campaignParam)
        .then((result) => {
          if (result.data?.valid && result.data?.campaign) {
            setIsFromCampaign(true);
            setCampaignToken(campaignParam);
            
            // Calculate cookie expiration based on campaign expiration date
            let cookieExpires: number | Date;
            if (result.data.campaign.expiresAt) {
              // Use the campaign's expiration date
              const expiresDate = new Date(result.data.campaign.expiresAt);
              cookieExpires = expiresDate;
            } else {
              // If no expiration date set, use 30 days as fallback
              cookieExpires = 30;
            }
            
            // Store in cookie with campaign's expiration date
            Cookies.set('campaign-token', campaignParam, {
              expires: cookieExpires,
              path: '/',
              sameSite: 'lax',
            });
            console.log('📧 Valid campaign detected:', result.data.campaign.name);
            if (result.data.campaign.expiresAt) {
              console.log('📅 Cookie expires:', new Date(result.data.campaign.expiresAt).toLocaleDateString());
            }
          } else {
            console.log('❌ Invalid or expired campaign token');
          }
        })
        .catch((error) => {
          console.error('Failed to validate campaign:', error);
        });
    }
  }, [searchParams, validateCampaign]);

  return { isFromCampaign, campaignToken, isLoading };
}

