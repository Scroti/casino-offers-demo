'use client';

import { Suspense, useMemo } from 'react';
import GameCard from '@/components/ui/game-card';
import { getAllGamesWithEmbedUrls } from '@/app/lib/constants/games';
import { useGetActiveGamesQuery } from '@/app/lib/data-access/configs/games.config';
import { generateCasinoGuruUrl } from '@/app/lib/constants/games';
import { Skeleton } from '@/components/ui/skeleton';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function GamesPageContent() {
  const { data: dbGames = [], isLoading } = useGetActiveGamesQuery();
  
  // Fallback to constants if no games in DB
  const constantGames = useMemo(() => getAllGamesWithEmbedUrls(), []);
  
  // Transform DB games to match GameCard interface
  const games = useMemo(() => {
    if (isLoading) return [];
    
    if (dbGames.length > 0) {
      return dbGames.map((game) => ({
        id: game.gameId || game._id || '',
        title: game.title,
        description: game.description,
        thumbnail: game.thumbnail,
        category: game.category,
        provider: game.provider,
        embedUrl: game.embedUrl || (game.casinoGuruIdentifier ? generateCasinoGuruUrl(game.casinoGuruIdentifier) : undefined),
      }));
    }
    
    // Fallback to constants
    return constantGames;
  }, [dbGames, constantGames, isLoading]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Games</h1>
        <p className="text-muted-foreground mt-1">
          Play exciting casino games directly in your browser
        </p>
      </div>

      {/* Games Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              description={game.description}
              thumbnail={game.thumbnail}
              category={game.category}
              provider={game.provider}
            />
          ))}
        </div>
      )}

      {!isLoading && games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games available yet.</p>
        </div>
      )}
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading games...</p>
      </div>
    }>
      <GamesPageContent />
    </Suspense>
  );
}
