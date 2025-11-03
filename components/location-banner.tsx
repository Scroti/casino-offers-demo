'use client';

import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n.context';

interface LocationData {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  countryName?: string;
  timezone?: string;
  loc?: string;
}

export function LocationBanner() {
  const { t, language } = useI18n();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if dismissed in localStorage
    const isDismissed = localStorage.getItem('location-banner-dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
      setLoading(false);
      return;
    }

    // Fetch location data
    const fetchLocation = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json');
        const data = await res.json();
        setLocationData(data);
      } catch (error) {
        console.error('Failed to fetch location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('location-banner-dismissed', 'true');
  };

  if (dismissed || loading || !locationData || !locationData.city || !locationData.country) {
    return null;
  }

  // Get country name based on language (you can expand this)
  const getCountryName = (countryCode: string) => {
    const countryNames: Record<string, Record<string, string>> = {
      en: {
        RO: 'Romania',
        ES: 'Spain',
        FR: 'France',
        DE: 'Germany',
        US: 'United States',
        GB: 'United Kingdom',
        // Add more as needed
      },
      ro: {
        RO: 'România',
        ES: 'Spania',
        FR: 'Franța',
        DE: 'Germania',
        US: 'Statele Unite',
        GB: 'Regatul Unit',
      },
      es: {
        RO: 'Rumania',
        ES: 'España',
        FR: 'Francia',
        DE: 'Alemania',
        US: 'Estados Unidos',
        GB: 'Reino Unido',
      },
      fr: {
        RO: 'Roumanie',
        ES: 'Espagne',
        FR: 'France',
        DE: 'Allemagne',
        US: 'États-Unis',
        GB: 'Royaume-Uni',
      },
      de: {
        RO: 'Rumänien',
        ES: 'Spanien',
        FR: 'Frankreich',
        DE: 'Deutschland',
        US: 'Vereinigte Staaten',
        GB: 'Vereinigtes Königreich',
      },
    };

    return countryNames[language]?.[countryCode] || countryNames['en']?.[countryCode] || countryCode;
  };

  const countryName = getCountryName(locationData.country);

  // Translation texts
  const messages: Record<string, string> = {
    en: `You are now connected from ${locationData.city}, ${countryName}`,
    ro: `Ești acum conectat din ${locationData.city}, ${countryName}`,
    es: `Ahora estás conectado desde ${locationData.city}, ${countryName}`,
    fr: `Vous êtes maintenant connecté depuis ${locationData.city}, ${countryName}`,
    de: `Sie sind jetzt verbunden von ${locationData.city}, ${countryName}`,
  };

  const message = messages[language] || messages['en'];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm">
      <div className="bg-background border-t sm:border border-border rounded-t-lg sm:rounded-lg shadow-lg p-3 sm:p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <p className="text-xs sm:text-sm text-foreground flex-1 min-w-0">
            {message}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );
}

