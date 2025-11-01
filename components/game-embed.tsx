'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Play, ExternalLink } from 'lucide-react';

interface GameEmbedProps {
  gameUrl: string;
  gameTitle?: string;
  gameId?: string;
  fullscreen?: boolean;
}

export default function GameEmbed({ 
  gameUrl, 
  gameTitle = 'Game',
  gameId,
  fullscreen = false 
}: GameEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', () => {
        setLoading(false);
      });
      iframeRef.current.addEventListener('error', () => {
        setError('Failed to load game');
        setLoading(false);
      });
    }
  }, []);

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    
    if (isFullscreen) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    } else {
      iframeRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">{gameTitle}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(gameUrl, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0 relative bg-muted/50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading game...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={gameUrl}
          className="w-full h-full min-h-[600px] border-0"
          allow="fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={gameTitle}
        />
      </CardContent>
    </Card>
  );
}

