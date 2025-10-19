"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon } from "lucide-react";

type CardProductProps = {
  title: string;
  description?: string;
  price: number | string;
  rating?: number;
  image?: string;
  onAdd?: () => void;
  href?: string;
};

export default function CardProduct({
  title,
  description,
  price,
  rating = 0,
  image,
  onAdd,
  href,
}: CardProductProps) {
  const filledStars = Math.floor(rating);

  const cardInner = (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-all bg-card/80 backdrop-blur-md border border-border/50">
      <CardContent className="flex flex-col p-4 flex-grow">
        {/* Image */}
        <div className="aspect-[4/3] rounded-md bg-muted mb-3 overflow-hidden">
          {image?.startsWith("http") ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={image || "/placeholder.png"}
              alt={title}
              width={400}
              height={300}
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {/* Title & Description */}
        <CardTitle className="text-base mb-1 line-clamp-1">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs mb-2 line-clamp-2 text-muted-foreground">
            {description}
          </CardDescription>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                className={`h-3 w-3 ${
                  i <= filledStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
          {rating > 0 && (
            <span className="text-xs text-muted-foreground">
              ({rating.toFixed(1)})
            </span>
          )}
        </div>

        {/* Price + Button */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-bold">{price}</span>
          <Button
            size="sm"
            className="text-xs px-2 py-1 h-7"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
          >
            Get Bonus
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block w-full h-full">
      {cardInner}
    </Link>
  ) : (
    cardInner
  );
}
