"use client"

import {useId, useEffect, useState} from "react"
import {MoonIcon, SunIcon} from "lucide-react"
import {useTheme} from "next-themes"

import {Switch} from "@/components/ui/switch"

export function ThemeSwitch() {
    const id = useId()
    const {theme, setTheme, resolvedTheme} = useTheme()
    const [mounted, setMounted] = useState(false)

    // Éviter les problèmes d'hydratation
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    // Utiliser resolvedTheme pour avoir le vrai thème actuel
    const isDark = resolvedTheme === "dark"

    const toggleSwitch = (checked: boolean) => {
        setTheme(checked ? "dark" : "light")
        console.log("Theme switched to:", checked ? "dark" : "light")
    }

    // Debug: afficher le thème actuel
    console.log("Current theme:", theme, "Resolved theme:", resolvedTheme, "isDark:", isDark)

    return (
        <div
            className="group inline-flex items-center gap-2"
            data-state={isDark ? "checked" : "unchecked"}
        >
      <span
          id={`${id}-off`}
          className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
          aria-controls={id}
          onClick={() => setTheme("light")}
      >
        <MoonIcon size={16} aria-hidden="true"/>
      </span>
            <Switch
                id={id}
                checked={isDark}
                onCheckedChange={toggleSwitch}
                aria-labelledby={`${id}-off ${id}-on`}
                aria-label="Toggle between dark and light mode"
            />
            <span
                id={`${id}-on`}
                className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
                aria-controls={id}
                onClick={() => setTheme("dark")}
            >
        <SunIcon size={16} aria-hidden="true"/>
      </span>
        </div>
    )
}