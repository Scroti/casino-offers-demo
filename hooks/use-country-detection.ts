"use client";

import { useState, useEffect } from "react";

interface CountryData {
  country: string | null;
  countryName: string | null;
}

let cachedResult: CountryData | null = null;
let pendingRequest: Promise<CountryData> | null = null;

async function detectCountry(): Promise<CountryData> {
  if (cachedResult) return cachedResult;

  if (!pendingRequest) {
    pendingRequest = fetch('https://ipinfo.io/json')
      .then((res) => res.json())
      .then((data) => {
        const result: CountryData = {
          country: data.country ?? null,
          countryName: data.country_name ?? null,
        };
        cachedResult = result;
        pendingRequest = null;
        return result;
      })
      .catch(() => {
        pendingRequest = null;
        return { country: null, countryName: null };
      });
  }

  return pendingRequest;
}

export function useCountryDetection() {
  const [userCountry, setUserCountry] = useState<string | null>(cachedResult?.country ?? null);
  const [countryName, setCountryName] = useState<string | null>(cachedResult?.countryName ?? null);
  const [isDetecting, setIsDetecting] = useState(!cachedResult);

  useEffect(() => {
    if (cachedResult) return;

    detectCountry().then((data) => {
      setUserCountry(data.country);
      setCountryName(data.countryName);
      setIsDetecting(false);
    });
  }, []);

  return { userCountry, countryName, isDetecting };
}
