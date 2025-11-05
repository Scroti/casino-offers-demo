'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameEmbed from '@/components/game-embed';
import { getAllGamesWithEmbedUrls, generateCasinoGuruUrl } from '@/app/lib/constants/games';
import { useGetGameByGameIdQuery, useIncrementGameViewsMutation } from '@/app/lib/data-access/configs/games.config';
import { useParams } from 'next/navigation';

function GamePageContent() {
  const params = useParams();
  const gameId = params?.gameId as string;
  
  const { data: dbGame, isLoading } = useGetGameByGameIdQuery(gameId, { skip: !gameId });
  const [incrementViews] = useIncrementGameViewsMutation();
  
  // Fallback to constants if not found in DB
  const constantGames = useMemo(() => getAllGamesWithEmbedUrls(), []);
  const constantGame = useMemo(() => 
    constantGames.find(g => g.id === gameId),
    [constantGames, gameId]
  );
  
  // Determine which game to use
  const game = useMemo(() => {
    if (isLoading) return null;
    
    if (dbGame) {
      return {
        id: dbGame.gameId || dbGame._id || '',
        title: dbGame.title,
        description: dbGame.description,
        thumbnail: dbGame.thumbnail,
        category: dbGame.category,
        provider: dbGame.provider,
        embedUrl: dbGame.embedUrl || (dbGame.casinoGuruIdentifier ? generateCasinoGuruUrl(dbGame.casinoGuruIdentifier) : undefined),
      };
    }
    
    return constantGame || null;
  }, [dbGame, constantGame, isLoading]);
  
  // Increment views when game is loaded
  React.useEffect(() => {
    if (dbGame?._id && !isLoading) {
      incrementViews(dbGame._id).catch(console.error);
    }
  }, [dbGame?._id, isLoading, incrementViews]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Link href="/games">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-6">
        <Link href="/games">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Game Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The game you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/games">
            <Button>Browse All Games</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link href="/games">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{game.title}</h1>
        {game.category && (
          <p className="text-muted-foreground">{game.category}</p>
        )}
        {game.description && (
          <p className="text-muted-foreground mt-2">{game.description}</p>
        )}
      </div>

      <GameEmbed
        gameUrl={game.embedUrl}
        gameTitle={game.title}
        gameId={game.id}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading game...</p>
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}
