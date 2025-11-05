"use client";

import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllGamesWithEmbedUrls } from "@/app/lib/constants/games";

export const FreeGamesSection = memo(function FreeGamesSection() {
  // Get all games and randomly select 5 for the homepage
  const games = useMemo(() => {
    const allGames = getAllGamesWithEmbedUrls();
    // Shuffle and take first 5
    const shuffled = [...allGames].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Play the most popular free games right now
          </h2>
          <Button variant="link" className="text-primary text-sm sm:text-base" asChild>
            <Link href="/games">
              See all free casino games
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {games.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No games available at the moment.
            </div>
          ) : (
            games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl"
              >
                <img
                  src={game.thumbnail || '/assets/images/logo.png'}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Play Now
                    </Button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
});
