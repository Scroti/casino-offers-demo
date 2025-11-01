import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameEmbed from '@/components/game-embed';
import { getAllGamesWithEmbedUrls } from '@/app/lib/constants/games';

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  
  // Get all games and create a map by ID
  const allGames = getAllGamesWithEmbedUrls();
  const gamesMap = Object.fromEntries(
    allGames.map(game => [game.id, game])
  );
  
  const game = gamesMap[gameId];

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
            The game you're looking for doesn't exist.
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

