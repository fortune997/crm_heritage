"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-10 w-[76px] rounded-full bg-gray-100 dark:bg-gray-800" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
            className="
        group relative flex h-10 w-[76px] items-center rounded-full
        border border-gray-200 bg-gray-100 p-1
        shadow-sm transition-all duration-300
        hover:shadow-md
        dark:border-gray-700 dark:bg-gray-800
      "
        >
            {/* Indicateur animé */}
            <span
                className="
          absolute top-1 h-8 w-8 rounded-full
          bg-white shadow-md
          transition-transform duration-300 ease-out
          dark:bg-gray-950
        "
                style={{
                    transform: `translateX(${isDark ? "36px" : "0px"})`,
                }}
            />

            {/* Soleil */}
            <span
                className={`
          relative z-10 flex h-8 w-8 items-center justify-center
          transition-all duration-300
          ${!isDark
                        ? "text-amber-500"
                        : "text-gray-500 dark:text-gray-400"
                    }
        `}
            >
                <Sun
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-500"
                />
            </span>

            {/* Lune */}
            <span
                className={`
          relative z-10 flex h-8 w-8 items-center justify-center
          transition-all duration-300
          ${isDark
                        ? "text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    }
        `}
            >
                <Moon
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-500"
                />
            </span>
        </button>
    );
}