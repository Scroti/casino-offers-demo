"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:opacity-0 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] opacity-0 scale-0 transition-all dark:opacity-100 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
