import { generateMetadata as genMeta } from '@/lib/utils/seo';
import { getAllGamesWithEmbedUrls, generateCasinoGuruUrl } from '@/app/lib/constants/games';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>;
}): Promise<ReturnType<typeof genMeta>> {
  const { gameId } = await params;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';
  
  try {
    const res = await fetch(`${apiUrl}/games/gameId/${gameId}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const game = await res.json();
      return genMeta({
        title: `Play ${game.title} Free Online - ${game.provider}`,
        description: game.description || `Play ${game.title} for free online. ${game.category} game by ${game.provider}. No download required.`,
        keywords: [game.title, game.category, game.provider, 'free casino game', 'online game'],
        url: `/games/${gameId}`,
        image: game.thumbnail,
        type: 'article',
      });
    }
  } catch (error) {
    console.error('Failed to fetch game for metadata:', error);
  }

  // Fallback to constants
  const constantGames = getAllGamesWithEmbedUrls();
  const constantGame = constantGames.find(g => g.id === gameId);
  
  if (constantGame) {
    return genMeta({
      title: `Play ${constantGame.title} Free Online - ${constantGame.provider}`,
      description: constantGame.description || `Play ${constantGame.title} for free online. ${constantGame.category} game by ${constantGame.provider}.`,
      keywords: [constantGame.title, constantGame.category, constantGame.provider, 'free casino game'],
      url: `/games/${gameId}`,
      image: constantGame.thumbnail,
      type: 'article',
    });
  }

  return genMeta({
    title: 'Game Not Found',
    description: 'The game you are looking for does not exist.',
    url: `/games/${gameId}`,
    noIndex: true,
  });
}

export default function GameDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

