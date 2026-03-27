"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground
                 hover:bg-accent transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={16} className="transition-transform duration-200" />
      ) : (
        <Sun size={16} className="transition-transform duration-200" />
      )}
    </Button>
  );
};

export default ToggleTheme;
