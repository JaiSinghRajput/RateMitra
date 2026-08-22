"use client";

import Link from 'next/link';
import { Home, ArrowLeft, SearchX } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-150 bg-linear-to-b from-primary/15 to-accent/10 blur-3xl -z-10 rounded-full" />
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="text-center z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Animated 404 Graphic */}
        <div className="relative mb-8 flex justify-center items-center">
          <div className="absolute inset-0 bg-linear-to-r from-primary to-accent opacity-20 blur-2xl rounded-full animate-pulse" />
          <h1 className="text-[12rem] sm:text-[16rem] font-black text-transparent bg-clip-text bg-linear-to-br from-primary via-primary-dark to-accent/80 leading-none drop-shadow-lg select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <SearchX className="w-64 h-64 text-text-primary" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 tracking-tight">
          Page Not Found
        </h2>
        
        <p className="text-lg text-text-secondary mb-10 max-w-md mx-auto leading-relaxed">
          The store or page you are looking for doesn't exist, has been moved, or you might have the wrong URL.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/25 transform hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          
          <button 
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-surface hover:bg-background text-text-primary rounded-2xl font-bold text-lg transition-all shadow-sm border border-border w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
      
      {/* Branding footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-60">
        <Image src="/web-app-manifest-512x512.png" alt="RateMitra Logo" width={24} height={24} className="w-6 h-6 object-contain rounded-md" />
        <span className="text-sm font-bold text-text-secondary tracking-widest uppercase">RateMitra</span>
      </div>
    </div>
  );
}
