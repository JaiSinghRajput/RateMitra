"use client";

import React, { forwardRef } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface QRCodePosterProps {
  storeName: string;
  storeUrl: string;
  color1?: string;
  color2?: string;
  textColor?: string;
  qrStyle?: 'squares' | 'dots' | 'fluid';
  eyeRadius?: number | [number, number, number, number];
}

const QRCodePoster = forwardRef<HTMLDivElement, QRCodePosterProps>(({
  storeName,
  storeUrl,
  color1 = 'rgba(18,100,232,0.15)', // Default blue
  color2 = 'rgba(255,138,0,0.15)', // Default orange
  textColor = '#111827',
  qrStyle = 'dots',
  eyeRadius = 10
}, ref) => {
  return (
    <div
      ref={ref}
      className="w-198.5 h-280.75 relative overflow-hidden font-sans flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(to bottom right, #ffffff, #f8fafc, #ffffff)' }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-2/5 blur-3xl rounded-b-full" style={{ background: `linear-gradient(to bottom, ${color1}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-3/4 h-2/5 blur-3xl rounded-tl-full" style={{ background: `linear-gradient(to top, ${color2}, transparent)` }} />
      <div className="absolute -top-50 -right-50 w-125 h-125 rounded-full blur-[100px]" style={{ backgroundColor: color1 }} />
      <div className="absolute -bottom-50 -left-50 w-125 h-125 rounded-full blur-[100px]" style={{ backgroundColor: color2 }} />

      <div className="z-10 flex flex-col items-center justify-center w-full px-16 h-full text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-black tracking-tight leading-tight mb-4" style={{ color: textColor, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {storeName || "Our Store"}
          </h1>
          <p className="text-2xl font-medium tracking-wide uppercase" style={{ color: '#4b5563' }}>
            Official Price List
          </p>
        </div>

        <div className="relative p-12 rounded-[3rem] flex items-center justify-center transform transition-transform hover:scale-105 border-4" style={{ backgroundColor: '#ffffff', borderColor: '#f9fafb', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <QRCode
            value={storeUrl}
            size={350}
            ecLevel="H" // High error correction
            qrStyle={qrStyle}
            eyeRadius={eyeRadius}
            fgColor={textColor}
            bgColor="#ffffff"
            logoImage="/web-app-manifest-192x192.png"
            logoWidth={110}
            logoHeight={110}
            logoPadding={5}
            logoPaddingStyle="circle"
            removeQrCodeBehindLogo={true}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <h2 className="text-4xl font-extrabold mb-4" style={{ color: textColor }}>
            Scan to view prices instantly!
          </h2>
          <p className="text-xl font-medium flex items-center justify-center gap-2" style={{ color: '#6b7280' }}>
            <span className="flex items-center h-full mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </span>
            <span>No app required. Just use your phone's camera.</span>
          </p>
        </div>
      </div>
    </div>
  );
});

QRCodePoster.displayName = 'QRCodePoster';

export default QRCodePoster;
