"use client";

import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, MessageSquare, Headphones, CheckCircle2 } from "lucide-react";

interface LanguageOptionsProps {
  websiteLanguages?: string[];
  liveChatLanguages?: string[];
  customerSupportLanguages?: string[];
}

export const LanguageOptions = memo(function LanguageOptions({
  websiteLanguages,
  liveChatLanguages,
  customerSupportLanguages,
}: LanguageOptionsProps) {
  return (
    <div className="space-y-1.5">
      <h4 className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-foreground">
        LANGUAGE OPTIONS:
      </h4>
      <div className="space-y-1.5 text-[10px] sm:text-xs">
        {websiteLanguages && websiteLanguages.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Website:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
                  {websiteLanguages.length} languages
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-48 max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {websiteLanguages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1 px-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {liveChatLanguages && liveChatLanguages.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Live chat:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
                  {liveChatLanguages.length} languages
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-48 max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {liveChatLanguages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1 px-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {customerSupportLanguages && customerSupportLanguages.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Headphones className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Customer support:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
                  {customerSupportLanguages.length} language{customerSupportLanguages.length !== 1 ? 's' : ''}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-48 max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {customerSupportLanguages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1 px-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
});

