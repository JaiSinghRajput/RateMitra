"use client";

import { useState, useEffect } from "react";
import { Loader2, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, useOrganization } from "@clerk/nextjs";

export default function ThemeSettings() {
  const { t } = useLanguage();
  const { orgId } = useAuth();
  const { organization } = useOrganization();
  const [primaryColor, setPrimaryColor] = useState("#1264E8");
  const [backgroundColor, setBackgroundColor] = useState("#F8FAFC");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [fontColor, setFontColor] = useState("#172033");
  const [cardBackgroundColor, setCardBackgroundColor] = useState("rgba(255, 255, 255, 1)");
  const [customSlug, setCustomSlug] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (organization?.slug) {
      setCustomSlug(organization.slug);
    }
  }, [organization?.slug]);

  useEffect(() => {
    if (orgId) {
      fetchSettings();
    }
  }, [orgId]);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.primaryColor) setPrimaryColor(data.primaryColor);
        if (data.backgroundColor) setBackgroundColor(data.backgroundColor);
        if (data.backgroundImage !== undefined) setBackgroundImage(data.backgroundImage);
        if (data.fontColor) setFontColor(data.fontColor);
        if (data.cardBackgroundColor) setCardBackgroundColor(data.cardBackgroundColor);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  async function saveSettings() {
    setSavingSettings(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryColor, backgroundColor, backgroundImage, fontColor, cardBackgroundColor, customSlug }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to save settings");
      } else {
        // Force Clerk to re-fetch the organization data from the server
        if (organization) {
          await organization.reload();
        }

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings", error);
      setError("An unexpected error occurred");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border max-w-4xl mx-auto transition-colors">
      <h3 className="text-2xl font-bold text-text-primary mb-6">{t('orgTheme') || 'General Settings'}</h3>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 text-danger border border-danger/20 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success/10 text-success border border-success/20 rounded-lg text-sm">
          Settings saved successfully!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Custom Public URL Slug (Optional)</label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-background text-text-secondary sm:text-sm">
                /store/
              </span>
              <input
                type="text"
                placeholder="my-store-name"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="flex-1 block w-full px-3 py-2 rounded-none rounded-r-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary transition-all sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-text-secondary">Only letters, numbers, and dashes.</p>
          </div>

          <hr className="border-border my-4" />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('primaryColor')}</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-24 p-1 rounded-lg border border-border bg-surface cursor-pointer"
              />
              <span className="text-text-secondary font-mono text-sm uppercase">{primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('backgroundColor')}</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-12 w-24 p-1 rounded-lg border border-border bg-surface cursor-pointer"
              />
              <span className="text-text-secondary font-mono text-sm uppercase">{backgroundColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('bgImageUrl')}</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('fontColor')}</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="h-12 w-24 p-1 rounded-lg border border-border bg-surface cursor-pointer"
              />
              <span className="text-text-secondary font-mono text-sm uppercase">{fontColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('cardBgColor')}</label>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="rgba(255, 255, 255, 1) or #ffffff"
                value={cardBackgroundColor}
                onChange={(e) => setCardBackgroundColor(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary transition-all font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div
          className="bg-background rounded-2xl p-6 border border-border flex flex-col justify-center items-center relative overflow-hidden bg-cover bg-center min-h-75"
          style={{
            backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
          }}
        >
          <div className="text-sm text-text-secondary font-medium absolute top-4 left-4 mix-blend-difference">{t('livePreview')}</div>
          <div
            className="p-4 rounded-xl shadow-lg backdrop-blur border border-white/50 w-full max-w-xs mt-6 text-center group transition-all"
            style={{
              '--tw-shadow-color': primaryColor,
              backgroundColor: cardBackgroundColor
            } as any}
          >
            <div className="h-1 w-12 rounded-full mb-4 mx-auto" style={{ backgroundColor: primaryColor }}></div>
            <h4 className="text-lg font-bold mb-1" style={{ color: fontColor }}>{t('itemName')}</h4>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-2xl font-extrabold" style={{ color: fontColor }}>₹99</span>
              <span className="text-xs opacity-70" style={{ color: fontColor }}>/ 1 pcs</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={saveSettings}
        disabled={savingSettings}
        className="flex items-center gap-2 bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25 disabled:opacity-70 transform hover:-translate-y-0.5"
      >
        {savingSettings ? <Loader2 className="animate-spin h-5 w-5" /> : <Settings className="h-5 w-5" />}
        {t('saveSettings')}
      </button>
    </div>
  );
}
