'use client';

import * as React from 'react';

interface CasinoTableImageProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export function CasinoTableImage({ 
  imageUrl, 
  alt = "Casino logo", 
  className = "w-12 h-12 rounded object-cover border" 
}: CasinoTableImageProps) {
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
    />
  );
}

