"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Menu, X, List, Settings, Activity, Share2, Check, Moon, Sun, Languages, BarChart3, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import PWAInstallButton from "./PWAInstallButton";

export default function DashboardNavbar({ orgSlug }: { orgSlug?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className="md:hidden bg-surface border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Left */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/list" className="shrink-0 flex items-center gap-2">
              <Image src="/web-app-manifest-192x192.png" alt="RateMitra Logo" width={32} height={32} className="rounded-md" />
            </Link>
          </div>



          {/* Mobile Right */}
          <div className="flex items-center gap-3">
            {mounted && (
              <div className="flex items-center gap-2">
                <PWAInstallButton className="hidden sm:flex" />
                <div className="flex items-center bg-background rounded-full p-1 border border-border/50">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors uppercase"
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
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-surface border-l border-border shadow-2xl flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-text-primary text-lg">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-text-secondary hover:bg-background rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium ${isActive ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-background hover:text-text-primary"}`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {orgSlug && (
                <button
                  onClick={copyShareLink}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 mt-4 bg-primary-light text-primary hover:opacity-80 rounded-md text-base font-medium"
                >
                  {copied ? <Check className="w-5 h-5 text-success" /> : <Share2 className="w-5 h-5" />}
                  {copied ? "Copied!" : "Share Link"}
                </button>
              )}
            </div>

            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface shadow-sm border border-border">
                <OrganizationSwitcher hidePersonal={true} />
                <UserButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
