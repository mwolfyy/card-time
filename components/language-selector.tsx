"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LanguageSelectorProps {
  currentLocale: string
  onChangeLocale: (locale: "en" | "bg") => void
}

export function LanguageSelector({ currentLocale, onChangeLocale }: LanguageSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-1" />
          {currentLocale === "en" ? "EN" : "BG"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChangeLocale("en")}>
          <span className={currentLocale === "en" ? "font-bold" : ""}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeLocale("bg")}>
          <span className={currentLocale === "bg" ? "font-bold" : ""}>Български</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
