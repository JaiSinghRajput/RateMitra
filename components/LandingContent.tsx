"use client";

import { SignInButton } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Languages, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PWAInstallButton from './PWAInstallButton';

export default function LandingContent() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-125 bg-linear-to-b from-primary/15 to-accent/10 blur-3xl -z-10 rounded-full" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/web-app-manifest-512x512.png" alt="RateMitra Logo" width={40} height={40} className="w-20 h-auto object-contain rounded-lg" priority />
        </Link>

        {mounted && (
          <div className="flex items-center gap-3">
            <PWAInstallButton />
            <div className="flex items-center bg-background rounded-full p-1 border border-border/50">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors uppercase"
              >
                <Languages className="w-4 h-4" />
                {language === 'en' ? 'HI' : 'EN'}
              </button>
              <div className="w-px h-4 bg-border mx-1"></div>
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-1.5 text-text-secondary hover:text-text-primary rounded-full transition-colors"
              >
                {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">


        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-light text-primary font-bold text-xs tracking-widest uppercase border border-primary/20">
          {t('landingTagline')}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-text-primary via-text-secondary to-text-secondary/50 tracking-tight mb-8 max-w-4xl leading-tight">
          {t('landingHeadline1')} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">{t('landingHeadline2')}</span>
          <span className="inline-block w-0.75 h-[1em] ml-2 bg-text-primary animate-pulse align-middle" />
        </h1>

        <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl leading-relaxed">
          {t('landingDesc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <SignInButton mode="modal">
            <button className="px-8 py-4 bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/25 transform hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto">
              {t('getStarted')}
            </button>
          </SignInButton>

          <a href="#" className="px-8 py-4 bg-surface hover:bg-background text-text-primary rounded-2xl font-bold text-lg transition-all shadow-sm border border-border w-full sm:w-auto text-center">
            {t('viewExample')}
          </a>
        </div>
      </main>
    </div>
  );
}
