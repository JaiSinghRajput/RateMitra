import { Providers } from "@/components/Providers";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RateMitra",
  description: "RateMitra - Smart Price List Management",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        suppressHydrationWarning 
        className="min-h-full flex flex-col bg-background text-text-primary transition-colors"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <main className="flex-1">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}