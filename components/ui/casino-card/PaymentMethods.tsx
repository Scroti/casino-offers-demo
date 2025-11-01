"use client";

import { memo, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2 } from "lucide-react";
import { getPaymentLogo } from "@/lib/payment-logos";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  name: string;
}

interface PaymentMethodItemProps {
  payment: PaymentMethod;
  logoUrl: string;
  textSize: string;
  containerClass: string;
}

const PaymentMethodItem = memo(function PaymentMethodItem({ 
  payment, 
  logoUrl, 
  textSize, 
  containerClass 
}: PaymentMethodItemProps) {
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
});

interface PaymentMethodsProps {
  payments: PaymentMethod[];
  displayedLimit?: number;
}

export const PaymentMethods = memo(function PaymentMethods({ 
  payments, 
  displayedLimit = 8 
}: PaymentMethodsProps) {
  if (!payments || payments.length === 0) return null;

  const displayedPayments = payments.slice(0, displayedLimit);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-foreground">
          PAYMENT METHODS:
        </h4>
        {payments.length > displayedLimit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-primary hover:underline text-xs font-medium">
                Show all ({payments.length})
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-semibold mb-2 pb-1 border-b">
                  Payment methods ({payments.length})
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {payments.map((payment, idx) => {
                    const logoUrl = getPaymentLogo(payment.name);
                    return (
                      <PaymentMethodItem
                        key={idx}
                        payment={payment}
                        logoUrl={logoUrl}
                        textSize="text-[10px]"
                        containerClass="h-12 w-full"
                      />
                    );
                  })}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-1 sm:gap-1.5">
        {displayedPayments.map((payment, idx) => {
          const logoUrl = getPaymentLogo(payment.name);
          return (
            <PaymentMethodItem
              key={idx}
              payment={payment}
              logoUrl={logoUrl}
              textSize="text-[8px] sm:text-[9px]"
              containerClass="h-7 sm:h-8 w-full"
            />
          );
        })}
      </div>
    </div>
  );
});

