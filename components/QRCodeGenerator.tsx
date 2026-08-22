"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Download, Shuffle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCodePoster from './QRCodePoster';
import { useOrganization } from '@clerk/nextjs';

const RANDOM_PALETTES = [
  { color1: 'rgba(18,100,232,0.15)', color2: 'rgba(255,138,0,0.15)', textColor: '#1264E8', qrStyle: 'dots' as const, eyeRadius: 10 },
  { color1: 'rgba(16,185,129,0.15)', color2: 'rgba(52,211,153,0.15)', textColor: '#047857', qrStyle: 'fluid' as const, eyeRadius: [10, 0, 10, 0] as [number, number, number, number] },
  { color1: 'rgba(139,92,246,0.15)', color2: 'rgba(236,72,153,0.15)', textColor: '#6d28d9', qrStyle: 'dots' as const, eyeRadius: [0, 10, 10, 10] as [number, number, number, number] },
  { color1: 'rgba(239,68,68,0.15)', color2: 'rgba(245,158,11,0.15)', textColor: '#b91c1c', qrStyle: 'squares' as const, eyeRadius: 5 },
  { color1: 'rgba(59,130,246,0.15)', color2: 'rgba(14,165,233,0.15)', textColor: '#1d4ed8', qrStyle: 'fluid' as const, eyeRadius: 15 },
  { color1: 'rgba(244,63,94,0.15)', color2: 'rgba(251,113,133,0.15)', textColor: '#be123c', qrStyle: 'dots' as const, eyeRadius: [15, 0, 15, 0] as [number, number, number, number] },
];

export default function QRCodeGenerator({ orgSlug }: { orgSlug: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // A4 pixel width is 794px
        const newScale = entry.contentRect.width / 794;
        setPreviewScale(newScale);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  const storeName = organization?.name || "Our Store";
  const storeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/store/${orgSlug}`
    : `https://ratemitra.com/store/${orgSlug}`;

  const currentPalette = RANDOM_PALETTES[paletteIndex];

  const randomizeStyle = () => {
    let nextIndex = Math.floor(Math.random() * RANDOM_PALETTES.length);
    if (nextIndex === paletteIndex) {
      nextIndex = (nextIndex + 1) % RANDOM_PALETTES.length;
    }
    setPaletteIndex(nextIndex);
  };

  const downloadPDF = async () => {
    if (!posterRef.current || isGenerating) return;

    try {
      setIsGenerating(true);

      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const wrapper = clonedDoc.getElementById('qr-scale-wrapper');
          if (wrapper) {
            wrapper.style.transform = 'none';
          }
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`${storeName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start justify-center max-w-6xl mx-auto">
      {/* Left side: Controls */}
      <div className="flex flex-col gap-6 w-full xl:w-1/3 p-6 bg-surface border border-border rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Design Your QR Poster</h2>
          <p className="text-text-secondary text-sm">
            Customize the look of your A4 print-ready poster. Click Randomize to generate a new color palette, then download the PDF to print it!
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={randomizeStyle}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-hover text-text-primary rounded-xl font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed border border-border"
          >
            <Shuffle className="w-5 h-5 text-primary" />
            Randomize Style
          </button>

          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl font-semibold transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Right side: Preview */}
      <div className="w-full xl:w-2/3 flex justify-center px-4 md:px-0">
        <div
          ref={containerRef}
          className="relative w-full max-w-99..25 aspect-[1/1.414] border shadow-2xl rounded-sm overflow-hidden bg-white"
        >
          <div id="qr-scale-wrapper" style={{ transform: `scale(${previewScale})`, transformOrigin: 'top left', width: '794px', height: '1123px' }}>
            <QRCodePoster
              ref={posterRef}
              storeName={storeName}
              storeUrl={storeUrl}
              color1={currentPalette.color1}
              color2={currentPalette.color2}
              textColor={currentPalette.textColor}
              qrStyle={currentPalette.qrStyle}
              eyeRadius={currentPalette.eyeRadius}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
