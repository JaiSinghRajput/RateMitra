"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function OrgRequiredState() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="p-10 bg-surface rounded-3xl shadow-xl shadow-border max-w-lg text-center">
        <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">{t('orgRequired')}</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          {t('orgRequiredDesc')}
        </p>
      </div>
    </div>
  );
}
