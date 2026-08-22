import React from 'react';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { auth } from '@clerk/nextjs/server';

export default async function QRCodePage() {
  const { orgSlug } = await auth();
  
  if (!orgSlug) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Required</h2>
        <p className="text-gray-500">Please select or create a store to generate a QR code.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">QR Code Poster</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Design and download a beautiful A4 poster for your store.
        </p>
      </div>
      
      <QRCodeGenerator orgSlug={orgSlug} />
    </div>
  );
}
