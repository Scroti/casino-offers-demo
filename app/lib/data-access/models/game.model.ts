export interface Game {
  _id?: string;
  gameId: string;
  casinoGuruIdentifier?: string;
  title: string;
  embedUrl?: string;
  thumbnail?: string;
  category: string;
  description?: string;
  provider: string;
  isActive?: boolean;
  views?: number;
  plays?: number;
  createdAt?: string;
  updatedAt?: string;
}

