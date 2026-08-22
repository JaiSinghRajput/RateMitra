"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";

function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ClerkProvider
      appearance={{
        ...(mounted && resolvedTheme === "dark" ? { baseTheme: dark } : {}),
        elements: {
          card: "dark:bg-gray-900",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClerkThemeProvider>{children}</ClerkThemeProvider>
    </LanguageProvider>
  );
}
