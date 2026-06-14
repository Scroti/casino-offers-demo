'use client';

import { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gamepad2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n.context';
import { getAllGamesWithEmbedUrls } from '@/app/lib/constants/games';
import { Section } from '@/components/shared/section';
import { SectionHeader } from '@/components/shared/section-header';
import { SafeImage } from '@/components/shared/safe-image';

type Game = ReturnType<typeof getAllGamesWithEmbedUrls>[number];

const VISIBLE_COUNT = 5;

export const FreeGamesSection = memo(function FreeGamesSection() {
  const { t } = useI18n();
  // SSR-safe: deterministic slice on first render, shuffled after mount.
  const [games, setGames] = useState<Game[]>(() => getAllGamesWithEmbedUrls().slice(0, VISIBLE_COUNT));

  useEffect(() => {
    const all = getAllGamesWithEmbedUrls();
    setGames([...all].sort(() => Math.random() - 0.5).slice(0, VISIBLE_COUNT));
  }, []);

  return (
    <Section>
      <SectionHeader
        eyebrow={{ icon: Gamepad2, text: t('games.freeCasinoGames') }}
        title={
          <>
            <span className="gradient-text-subtle">{t('games.title')}</span>{' '}
            <span className="gradient-text">{t('common.hot')}</span>
          </>
        }
        cta={{ label: t('games.seeAll'), href: '/games' }}
      />

      {games.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">{t('games.noGames')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {games.map((game, i) => (
            <GameTile key={game.id} game={game} index={i + 1} />
          ))}
        </div>
      )}

      <div className="mt-6 text-center sm:hidden">
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/games">
            {t('games.seeAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
});

function GameTile({ game, index }: { game: Game; index: number }) {
  return (
    <Link href={`/games/${game.id}`} className="group relative block">
      <div className="aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-sm
                      group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-400">
        <SafeImage
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/95 flex items-center justify-center
                          shadow-lg shadow-primary/40 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow-sm">
            {game.title}
          </p>
          <p className="text-white/60 text-[10px] mt-0.5">{game.provider}</p>
        </div>

        <div className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm
                        flex items-center justify-center text-[10px] font-bold text-white/80">
          {index}
        </div>
      </div>
    </Link>
  );
}
