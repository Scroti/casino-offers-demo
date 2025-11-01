"use client";

import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { getGameIcon } from "./GameIcons";
import { cn } from "@/lib/utils";

interface Game {
  name: string;
  icon?: string;
  available: boolean;
}

interface AvailableGamesProps {
  games: Game[];
  displayedLimit?: number;
}

export const AvailableGames = memo(function AvailableGames({ 
  games, 
  displayedLimit = 6 
}: AvailableGamesProps) {
  if (!games || games.length === 0) return null;

  const displayedGames = games.slice(0, displayedLimit);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-foreground">
          AVAILABLE GAMES:
        </h4>
        {games.length > displayedLimit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-primary hover:underline text-xs font-medium">
                Show all
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-64 max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-semibold mb-2 pb-1 border-b">Types of games</div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-1">
                  {games.map((game, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-1.5 py-1 px-2 text-xs rounded",
                        !game.available && "opacity-50"
                      )}
                    >
                      {game.available ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      ) : (
                        <MinusCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span>{game.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 sm:gap-1.5">
        {displayedGames.map((game, idx) => {
          const GameIcon = getGameIcon(game.name);
          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1 sm:p-2 rounded-md border bg-background relative",
                !game.available && "opacity-50"
              )}
            >
              {game.available ? (
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10" />
              ) : (
                <MinusCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10" />
              )}
              <GameIcon className={cn(
                "h-5 w-5 sm:h-6 sm:w-6",
                game.available ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-[9px] sm:text-[10px] text-center font-medium leading-tight text-foreground">
                {game.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

