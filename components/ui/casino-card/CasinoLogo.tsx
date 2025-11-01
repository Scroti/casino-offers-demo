"use client";

import Image from "next/image";
import { memo } from "react";

interface CasinoLogoProps {
  logo?: string;
  image?: string;
  name: string;
}

export const CasinoLogo = memo(function CasinoLogo({ logo, image, name }: CasinoLogoProps) {
  const hasValidLogo = logo?.startsWith('http');
  const hasValidImage = image?.startsWith('http');
  
  if (hasValidLogo && logo) {
    return (
      <div className="absolute inset-0">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-cover"
          style={{ objectPosition: 'center center' }}
          unoptimized
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }
  
  if (hasValidImage && image) {
    return (
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          style={{ objectPosition: 'center center' }}
          unoptimized
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }
  
  // Fallback to text-based logo
  return (
    <div className="absolute inset-0 bg-foreground flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-1 text-background">
        <div className="text-5xl font-bold leading-none">
          {name.split(' ')[0]?.substring(0, 4).toUpperCase() || name.substring(0, 4).toUpperCase()}
        </div>
        {name.split(' ')[1] && (
          <div 
            className="text-4xl font-bold leading-none"
            style={{
              background: 'linear-gradient(90deg, #ec4899 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {name.split(' ')[1]?.substring(0, 4).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
});

