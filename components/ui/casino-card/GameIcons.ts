import {
  Zap,
  Target,
  Heart,
  Crown,
  Gem,
  Sparkles,
  Circle,
  X,
} from "lucide-react";

export type IconComponent = typeof Zap;

export const getGameIcon = (gameName: string): IconComponent => {
  const name = gameName.toLowerCase();
  if (name.includes('slot')) return Zap;
  if (name.includes('roulette')) return Target;
  if (name.includes('blackjack')) return Heart;
  if (name.includes('poker')) return Crown;
  if (name.includes('baccarat')) return Gem;
  if (name.includes('bingo')) return Sparkles;
  if (name.includes('betting') || name.includes('no betting')) return X;
  return Circle;
};

