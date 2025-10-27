"use client";

import CardProduct from "@/components/ui/card-product";
import { useGetAllBonusesQuery } from "@/app/lib/data-access/configs/bonuses.config";
import type { Bonus } from "@/app/lib/data-access/models/bonus.model";

export default function BonusesPage({ filter }: { filter?: string }) {
  const { data: bonuses = [], isLoading } = useGetAllBonusesQuery();

  const filtered =
    filter && filter !== "all"
      ? bonuses.filter((b) => b.type === filter)
      : bonuses;

  return (
    <div className="container py-5 px-5 mx-auto justify-items-center">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        {filter === "deposit"
          ? "Deposit Bonuses"
          : filter === "no-deposit"
          ? "No Deposit Bonuses"
          : filter === "cashback"
          ? "Cashback Bonuses"
          : "All Bonuses"}
      </h1>

      {isLoading && (
        <div className="w-full text-center text-lg">Loading bonuses...</div>
      )}
      {(!isLoading && filtered.length === 0) && (
        <div className="w-full text-center text-lg">No bonuses found.</div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {filtered.map((bonus: Bonus, index) => (
          <CardProduct
            key={bonus._id || index}
            title={bonus.title}
            description={bonus.description}
            price={bonus.price}
            rating={bonus.rating}
            image={bonus.image}
            onAdd={() => alert(`${bonus.title} activated! 🎰`)}
            href={bonus.href}
          />
        ))}
      </div>
    </div>
  );
}
