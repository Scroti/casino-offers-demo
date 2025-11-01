"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

type GameCardProps = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  provider?: string;
};

export default function GameCard({
  id,
  title,
  description,
  thumbnail,
  category,
  provider,
}: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link 
      href={`/games/${id}`} 
      className="block h-full"
      prefetch={true}
    >
      <Card className="w-full h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-md border border-border/50 group cursor-pointer overflow-hidden">
        <CardContent className="flex flex-col p-0 flex-grow relative">
          {/* Thumbnail */}
          <div className="aspect-[4/3] rounded-t-xl bg-muted overflow-hidden relative">
            {thumbnail && !imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Play className="h-16 w-16 text-primary/30 animate-pulse" />
                  </div>
                )}
                <img
                  src={thumbnail}
                  alt={title}
                  className={`object-cover w-full h-full group-hover:scale-110 transition-transform duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground px-2 line-clamp-2">{title}</p>
                </div>
              </div>
            )}
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 rounded-full p-4">
                  <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>
            </div>
            {/* Category Badge */}
            {category && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <CardTitle className="text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {description}
              </p>
            )}
            {provider && (
              <p className="text-xs text-muted-foreground mt-auto pt-2">
                by {provider}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

