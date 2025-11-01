/**
 * Games Configuration
 * 
 * Each game needs:
 * - id: Unique identifier
 * - casinoGuruIdentifier: Casino Guru identifier for embedding
 * - title: Game display name
 * - category: Game category (Slots, Table Games, etc.)
 * - description: Game description
 * - thumbnail: Game thumbnail image URL
 * 
 * To add more games, get the Casino Guru identifier from their embed URL:
 * https://casino.guru/embedGame?identifier=IDENTIFIER_HERE
 */

export interface Game {
  id: string;
  casinoGuruIdentifier?: string; // Casino Guru identifier for embedding
  title: string;
  embedUrl?: string; // If you have a pre-generated embed URL
  thumbnail?: string;
  category: string;
  description?: string;
  provider: string;
}

/**
 * Generate a Casino Guru embed URL (works without login)
 */
export function generateCasinoGuruUrl(identifier: string): string {
  return `https://casino.guru/embedGame?identifier=${identifier}`;
}

/**
 * Games Catalog
 * Add more games here with their Casino Guru identifiers
 */
/**
 * Generate a placeholder thumbnail URL with game name
 */
function generateThumbnailUrl(gameName: string): string {
  // Use a service that generates images with text
  const encodedName = encodeURIComponent(gameName);
  return `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodedName}`;
}

export const pragmaticPlayGames: Game[] = [
  {
    id: 'juicy-fruits',
    casinoGuruIdentifier: 'c2b5d09f-b90c-4da5-a5ee-7389ee980bd6',
    title: 'Juicy Fruits',
    category: 'Slots',
    description: 'A vibrant and exciting slot game with fruity themes',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Juicy Fruits'),
  },
  {
    id: 'sweet-bonanza',
    casinoGuruIdentifier: '145973b9-38a1-4542-9b11-86a3a558196a',
    title: 'Sweet Bonanza',
    category: 'Slots',
    description: 'A candy-themed slot with tumbling reels and high multipliers',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Sweet Bonanza'),
  },
  {
    id: 'gates-of-olympus',
    casinoGuruIdentifier: '17e3beef-3c98-4112-8955-e0d396d330f7',
    title: 'Gates of Olympus',
    category: 'Slots',
    description: 'An ancient Greek-themed slot featuring cascading reels and random multipliers',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Gates of Olympus'),
  },
  {
    id: 'sugar-rush',
    casinoGuruIdentifier: '1c022365-2d42-4d8e-9d26-7ea2a33067db',
    title: 'Sugar Rush',
    category: 'Slots',
    description: 'A sweet slot with cluster pays and multiplier symbols',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Sugar Rush'),
  },
  {
    id: 'wanted-dead-or-a-wild',
    casinoGuruIdentifier: 'cebf541a-2e79-4d95-83d9-344191ef9185',
    title: 'Wanted Dead or a Wild',
    category: 'Slots',
    description: 'A western-themed slot with wild features and exciting gameplay',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Wanted Dead or a Wild'),
  },
  {
    id: 'sugar-rush-1000',
    casinoGuruIdentifier: '391545eb-380c-4710-8895-0c4da8262bfc',
    title: 'Sugar Rush 1000',
    category: 'Slots',
    description: 'The 1000x multiplier version of the popular Sugar Rush slot',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Sugar Rush 1000'),
  },
  {
    id: 'big-bamboo',
    casinoGuruIdentifier: '6f84dc00-10fc-4f22-b64b-81d9cba6f158',
    title: 'Big Bamboo',
    category: 'Slots',
    description: 'An Asian-themed slot with exciting features and multipliers',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Big Bamboo'),
  },
  {
    id: 'big-bass-bonanza-1000',
    casinoGuruIdentifier: '8a9b294f-2aca-475d-b367-c30006148b30',
    title: 'Big Bass Bonanza 1000',
    category: 'Slots',
    description: 'The 1000x multiplier version of Big Bass Bonanza fishing slot',
    provider: 'Pragmatic Play',
    thumbnail: generateThumbnailUrl('Big Bass Bonanza 1000'),
  },
];

/**
 * Get game with generated embed URL
 * Uses Casino Guru format (works without login)
 */
export function getGameWithEmbedUrl(game: Game): Game & { embedUrl: string } {
  // If embedUrl is already provided, use it
  if (game.embedUrl) {
    return { ...game, embedUrl: game.embedUrl };
  }

  // Use Casino Guru format (works without login)
  if (game.casinoGuruIdentifier) {
    return {
      ...game,
      embedUrl: generateCasinoGuruUrl(game.casinoGuruIdentifier),
    };
  }

  // If no identifier is available, throw an error
  throw new Error(`Game ${game.id} has no Casino Guru identifier configured`);
}

/**
 * Get all games with embed URLs
 */
export function getAllGamesWithEmbedUrls(): Array<Game & { embedUrl: string }> {
  return pragmaticPlayGames.map(game => getGameWithEmbedUrl(game));
}

