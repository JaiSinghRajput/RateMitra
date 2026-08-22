"use client";

import React, { useRef, useState, useEffect } from 'react';
import { QrCode, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCodePoster from './QRCodePoster';
import { useOrganization } from '@clerk/nextjs';

export default function DownloadQRButton({ orgSlug }: { orgSlug: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const storeName = organization?.name || "Our Store";
  // Determine the base URL for the store
  const storeUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/store/${orgSlug}` 
    : `https://ratemitra.com/store/${orgSlug}`;

  const downloadPDF = async () => {
    if (!posterRef.current || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // html2canvas captures the DOM node
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Add image to PDF (A4 size: 210 x 297 mm)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      
      // Save the PDF
      pdf.save(`${storeName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={downloadPDF}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-accent to-orange-600 hover:from-orange-600 hover:to-accent text-white rounded-lg font-medium transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <QrCode className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Download QR</span>
      </button>
      
      {/* Hidden Poster for capture - Only render on client to avoid hydration mismatch */}
      {mounted && <QRCodePoster ref={posterRef} storeName={storeName} storeUrl={storeUrl} />}
    </>
  );
}
