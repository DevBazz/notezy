'use client'
import React from 'react'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from './ui/button'

const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}    
    </Button>
  )
}

export default ToggleTheme