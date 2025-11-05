"use client";

import { useState, useEffect } from "react";

interface CountryData {
  country: string;
  countryName?: string;
}

export function useCountryDetection() {
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json');
        const data = await res.json();
        if (data.country) {
          setUserCountry(data.country);
          setCountryName(data.country_name || null);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
      } finally {
        setIsDetecting(false);
      }
    };

    detectCountry();
  }, []);

  return {
    userCountry,
    countryName,
    isDetecting,
  };
}

