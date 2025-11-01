"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const FreeGamesSection = memo(function FreeGamesSection() {
  const games = [
    {
      name: "Sweet Bonanza",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnN4n7bIv6GHgJsuSONukNtnkeOBFneMad9w&s",
    },
    { name: "Hit the Gold", image: "/assets/games/hit-gold.png" },
    { name: "Cleopatra", image: "/assets/games/cleopatra.png" },
    { name: "Mustang Money", image: "/assets/games/mustang.png" },
    { name: "Wolf Gold", image: "/assets/games/wolf-gold.png" },
  ];

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Play the most popular free games right now
          </h2>
          <Button variant="link" className="text-primary">
            See all free casino games
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {games.map((game, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Play Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
