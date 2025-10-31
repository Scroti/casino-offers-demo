"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PaymentMethodItem({ 
  payment, 
  logoUrl, 
  textSize, 
  containerClass 
}: { 
  payment: { name: string }; 
  logoUrl: string; 
  textSize: string; 
  containerClass: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  if (!logoUrl || imageError) {
    return (
      <div className={cn("border rounded-md p-0.5 bg-background flex items-center justify-center", containerClass)}>
        <span className={cn("text-center leading-tight text-foreground", textSize)}>{payment.name}</span>
      </div>
    );
  }
  
  return (
    <div className={cn("relative border rounded-md p-0.5 bg-background flex items-center justify-center", containerClass)}>
      <Image
        src={logoUrl}
        alt={payment.name}
        fill
        className="object-contain p-1"
        unoptimized
        onError={() => setImageError(true)}
      />
    </div>
  );
}


