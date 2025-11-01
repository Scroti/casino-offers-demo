'use client';

import GameCard from '@/components/ui/game-card';
import { getAllGamesWithEmbedUrls } from '@/app/lib/constants/games';

// Get all games with generated embed URLs
const games = getAllGamesWithEmbedUrls();

export default function GamesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Games</h1>
        <p className="text-muted-foreground mt-1">
          Play exciting casino games directly in your browser
        </p>
      </div>

      {/* Games Grid */}
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

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games available yet.</p>
        </div>
      )}
    </div>
  );
}
