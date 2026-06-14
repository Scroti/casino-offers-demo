'use client';

import type { ImgHTMLAttributes } from 'react';

const DEFAULT_FALLBACK = '/assets/images/logo.png';

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallback?: string;
}

// Plain <img> with onError fallback. Use when sources may be missing, broken,
// or served from external CDNs that can fail DNS resolution.
export function SafeImage({
  src,
  fallback = DEFAULT_FALLBACK,
  alt,
  ...rest
}: SafeImageProps) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      {...rest}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.endsWith(fallback)) return;
        img.src = fallback;
      }}
    />
  );
}
