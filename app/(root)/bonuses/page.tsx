"use client";

import CardProduct from "@/components/ui/card-product";

export default function BonusesPage() {
  const bonuses = [
    {
      title: "Welcome Bonus on MaxBet",
      description: "Get 100% up to $500 on your first deposit",
      price: "$500",
      rating: 5,
      image:
        "https://xbets.ro/wp-content/uploads/2023/06/Pareri-Maxbet-%E2%80%93-Recenzie-completa-si-ce-cred-romanii-despre-aceasta-casa-de-pariuri.webp",
      href: "/bonuses/welcome",
    },
    {
      title: "Reload Bonus on Superbet",
      description: "50% bonus on every deposit",
      price: "$200",
      rating: 4.5,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Superbet_logo.png/1006px-Superbet_logo.png",
      href: "/bonuses/reload",
    },
    {
      title: "Weekly Cashback on Betano",
      description: "Get 10% cashback on weekly losses",
      price: "10%",
      rating: 4,
      image: "https://case-pariuri.ro/wp-content/uploads/2024/06/Betano-Logo.webp",
      href: "/bonuses/cashback",
    },
    {
      title: "Castiga o masina cu MrBit",
      description: "Masina de vis cu MR.BIT! Joaca acum si intra in cursa pentru marele premiu!",
      price: "2500 RON + 25FS",
      rating: 5,
      image:
        "https://play-lh.googleusercontent.com/TVYXfu3Uy4jvuoHTmds0jziKttU731SqRrJigNvKv0SH19LbZrx48JpBal0ehMI2CAVEWJsfNchjePAjNLATFw=w526-h296-rw",
      href: "/bonuses/welcome",
    },
    
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Casino Bonuses
      </h1>

      <div
        className="
          grid
          gap-8
          grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
          justify-items-center
        "
      >
        {bonuses.map((bonus, index) => (
          <CardProduct
            key={index}
            title={bonus.title}
            description={bonus.description}
            price={bonus.price}
            rating={bonus.rating}
            image={bonus.image}
            href={bonus.href}
            onAdd={() => alert(`${bonus.title} activated! 🎰`)}
          />
        ))}
      </div>
    </div>
  );
}
