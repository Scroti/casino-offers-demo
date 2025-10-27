'use client';

import * as React from 'react';

interface BonusTableImageProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export function BonusTableImage({ 
  imageUrl, 
  alt = "Bonus logo", 
  className = "w-12 h-12 rounded object-cover border" 
}: BonusTableImageProps) {
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
    />
  );
}
