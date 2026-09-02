"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Languages, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceItem {
  _id: string;
  name: string;
  price: number;
  qty?: number;
  unit?: string;
  nameHi?: string;
  imageUrl?: string;
}

interface Theme {
  primaryColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  fontColor?: string;
  cardBackgroundColor?: string;
}

export default function PublicPriceList({ 
  items, 
  orgName,
  orgId,
  theme = { primaryColor: '#4f46e5', backgroundColor: '#f8fafc', backgroundImage: '', fontColor: '#1f2937', cardBackgroundColor: 'rgba(255, 255, 255, 0.8)' }
}: { 
  items: PriceItem[], 
  orgName: string,
  orgId?: string,
  theme?: Theme
}) {
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Log view
    if (orgId) {
      fetch('/api/analytics/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId })
      }).catch(err => console.error('Failed to log view', err));
    }
  }, [orgId]);

  const filteredItems = items.filter(item => {
    const itemName = language === 'hi' && item.nameHi ? item.nameHi : item.name;
    return itemName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 md:p-12 transition-colors duration-500 bg-cover bg-center bg-fixed"
      style={{ 
        backgroundColor: theme.backgroundColor,
        backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none'
      }}
    >
      <div className="max-w-4xl mx-auto relative">
        {/* Language Toggle */}
        {mounted && (
          <div className="absolute top-0 right-0 z-10 flex items-center bg-background/80 backdrop-blur-md rounded-full p-1 shadow-sm border border-border">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors uppercase"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'HI' : 'EN'}
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-8"
        >
          <div 
            className="inline-block px-4 py-1.5 mb-4 rounded-full font-semibold text-sm tracking-wide mix-blend-multiply"
            style={{ 
              backgroundColor: `${theme.primaryColor}20`, 
              color: theme.primaryColor 
            }}
          >
            OFFICIAL PRICING
          </div>
          <h1 
            className="text-4xl md:text-5xl font-extrabold tracking-tight transition-colors"
            style={{ color: theme.fontColor || '#111827' }}
          >
            {orgName}
          </h1>
          <p className="mt-4 text-xl mix-blend-multiply mb-8 transition-colors" style={{ color: theme.fontColor || '#6b7280' }}>Transparent pricing for our services.</p>
          
          <div className="max-w-md mx-auto relative">
            <style>{`
              .org-search-input::placeholder {
                color: ${theme.fontColor || '#9ca3af'};
                opacity: 0.6;
              }
            `}</style>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5" style={{ color: theme.fontColor || '#9ca3af', opacity: 0.6 }} />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="org-search-input w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 transition-all border border-white/50 shadow-sm"
              style={{ 
                '--tw-ring-color': theme.primaryColor,
                color: theme.fontColor || '#111827'
              } as any}
            />
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, boxShadow: `0 20px 25px -5px ${theme.primaryColor}30, 0 8px 10px -6px ${theme.primaryColor}20` }}
                className="p-6 md:p-8 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl flex gap-6 items-center group transition-all"
                style={{ 
                  '--tw-shadow-color': `${theme.primaryColor}30`,
                  backgroundColor: theme.cardBackgroundColor || 'rgba(255, 255, 255, 0.8)'
                } as any}
              >
                {item.imageUrl && (
                  <div 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-md cursor-pointer relative"
                    onClick={() => setSelectedImage(item.imageUrl!)}
                    title="Click to view full image"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                )}
                
                <div className="flex flex-col flex-1 justify-center py-1">
                  <div>
                    <h3 
                      className="text-2xl font-bold transition-colors mb-2" 
                      style={{ color: theme.fontColor || '#1f2937' }} 
                      onMouseEnter={(e) => (e.currentTarget.style.color = theme.primaryColor)} 
                      onMouseLeave={(e) => (e.currentTarget.style.color = theme.fontColor || '#1f2937')}
                    >
                      {language === 'hi' && item.nameHi ? item.nameHi : item.name}
                    </h3>
                    <div className="h-1 w-12 rounded-full mb-4 transition-all group-hover:w-16" style={{ backgroundColor: theme.primaryColor }}></div>
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl md:text-4xl font-extrabold" style={{ color: theme.fontColor || '#111827' }}>₹{item.price.toFixed(2)}</span>
                    <span className="text-sm md:text-base font-medium opacity-75" style={{ color: theme.fontColor || '#6b7280' }}>/ {item.qty || 1} {item.unit || 'pcs'}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 text-gray-500 text-lg mix-blend-multiply">
              {searchQuery ? "No services found matching your search." : "No public prices available at the moment."}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center text-sm text-gray-400 font-medium mix-blend-multiply"
        >
          Powered by RateMitra
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-white/5"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="w-full h-full max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
