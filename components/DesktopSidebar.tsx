"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { List, Settings, Activity, Share2, Check, Moon, Sun, Languages, BarChart3, QrCode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PWAInstallButton from "./PWAInstallButton";

export default function DesktopSidebar({ orgSlug }: { orgSlug?: string | null }) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/dashboard/list", label: t('dashboard'), icon: List },
    { href: "/dashboard/theme", label: t('settings'), icon: Settings },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/qrcode", label: "QR Poster", icon: QrCode },
    { href: "/dashboard/activity", label: t('activity'), icon: Activity },
  ];

  const copyShareLink = () => {
    if (!orgSlug) return;
    const url = `${window.location.origin}/store/${orgSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border transition-colors shrink-0">
      <div className="p-6 border-b border-border">
        <Link href="/dashboard/list" className="flex items-center justify-center gap-2">
          <Image src="/web-app-manifest-512x512.png" alt="RateMitra Logo" width={160} height={160} className="w-full max-w-35 h-auto object-contain rounded-lg" priority />
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}

        {orgSlug && (
          <div className="p-4 border-t border-border mt-auto flex flex-col gap-2 bg-background">
            <PWAInstallButton />
            <button
              onClick={copyShareLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span>{copied ? "Copied!" : "Share Link"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border space-y-4">
        {/* Toggles */}
        {mounted && (
          <div className="flex items-center justify-between bg-background rounded-xl p-1.5 border border-border/50">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-text-secondary hover:bg-surface hover:text-text-primary transition-all shadow-sm"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'HI' : 'EN'}
            </button>
            <div className="w-px h-6 bg-border mx-2"></div>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-text-secondary hover:bg-surface hover:text-text-primary transition-all shadow-sm"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {resolvedTheme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        )}

        {/* User / Org */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/50">
          <OrganizationSwitcher hidePersonal={true} />
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
