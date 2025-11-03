import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get client IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  const remoteAddress = request.headers.get('remote-addr');
  
  // x-forwarded-for can contain multiple IPs, take the first one
  let clientIp = forwarded 
    ? forwarded.split(',')[0].trim() 
    : realIp || cfConnectingIp || remoteAddress || 'unknown';

  // Check if localhost (development)
  const isLocalhost = clientIp === '::1' || clientIp === '127.0.0.1' || clientIp === 'localhost' || clientIp.startsWith('::ffff:127.0.0.1');

  // Get language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || 'en';
  // Parse the first language preference
  const primaryLanguage = acceptLanguage.split(',')[0].split(';')[0].trim();

  // Get country from IP using ip-api.com (free service)
  let country = null;
  let countryCode = null;
  let countryName = null;
  let timezone = null;
  let city = null;

  if (!isLocalhost) {
    try {
      // Use ip-api.com free tier (no API key needed, 45 req/min limit)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const geoResponse = await fetch(
        `http://ip-api.com/json/${clientIp}?fields=status,message,country,countryCode,timezone,city`,
        {
          signal: controller.signal,
        }
      ).finally(() => {
        clearTimeout(timeoutId);
      });

      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        
        if (geoData.status === 'success') {
          countryCode = geoData.countryCode;
          countryName = geoData.country;
          timezone = geoData.timezone;
          city = geoData.city;
          country = {
            code: countryCode,
            name: countryName,
            city: city,
            timezone: timezone,
          };
        }
      }
    } catch (error) {
      console.error('Failed to fetch country from IP:', error);
      // Continue without country data
    }
  } else {
    // In development/localhost, return mock data or skip
    country = {
      code: 'US', // Default for development
      name: 'United States',
      city: 'Local',
      timezone: 'America/New_York',
    };
    countryCode = 'US';
    countryName = 'United States';
  }

  return NextResponse.json({
    ip: clientIp,
    isLocalhost,
    environment: process.env.NODE_ENV,
    country: country,
    countryCode: countryCode,
    countryName: countryName,
    city: city,
    timezone: timezone,
    language: primaryLanguage,
    acceptLanguage: acceptLanguage,
    headers: {
      'x-forwarded-for': forwarded || null,
      'x-real-ip': realIp || null,
      'cf-connecting-ip': cfConnectingIp || null,
      'remote-addr': remoteAddress || null,
      'accept-language': acceptLanguage || null,
    },
  });
}

