"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PWAInstallButton({ className = "" }: { className?: string }) {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!installPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className={`flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-full transition-colors shadow-sm ${className}`}
      title={language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">{language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
    </button>
  );
}
