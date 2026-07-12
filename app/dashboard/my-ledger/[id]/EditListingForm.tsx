'use client';

import React, { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, CheckCircle } from 'lucide-react';
import { updateListing } from '@/app/actions/listings';
import { WasteType } from '@/app/generated/prisma/enums';

export default function EditListingForm({ listing }: { listing: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    wasteType: listing.wasteType,
    quantityKg: listing.quantityKg.toString(),
    price: listing.price ? listing.price.toString() : '',
    location: listing.location || '',
    imageBase64: listing.imageUrl || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file payload limits exceed standard 5MB bounds tier.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await updateListing({
          id: listing.id,
          wasteType: form.wasteType as any,
          quantityKg: parseFloat(form.quantityKg),
          price: form.price ? parseFloat(form.price) : undefined,
          location: form.location || undefined,
          imageBase64: form.imageBase64 || undefined,
        });
        
        router.push('/dashboard/my-ledger');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Modification failed to process');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium">
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-bold text-gray-600">Waste Streams Type</label>
          <select
            value={form.wasteType}
            onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
            className="w-full text-xs font-bold p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] cursor-pointer"
          >
            {Object.values(WasteType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-gray-600">Net Mass Volume (KG)</label>
          <input
            type="number" step="0.1" required placeholder="0.0"
            value={form.quantityKg}
            onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
            className="w-full text-xs p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-gray-600">Asking Price Evaluation (₦)</label>
        <input
          type="number" placeholder="Set transaction valuation cost"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full text-xs p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-gray-600">Collection Point Address</label>
        <input
          type="text" required placeholder="Street address details, Lagos"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full text-xs p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
        />
      </div>

      {/* Cloudinary Asset Input Block Dropzone Component */}
      <div className="space-y-1.5">
        <label className="font-bold text-gray-600">Update Photographic Proof Documentation</label>
        <input 
          type="file" accept="image/*" capture="environment"
          ref={fileInputRef} onChange={handleFileChange} className="hidden" 
        />
        
        {!form.imageBase64 ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-[#063321] rounded-xl p-6 bg-[#F8FBF9] text-center space-y-2 cursor-pointer transition-all flex flex-col items-center justify-center group"
          >
            <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#063321]" />
            <span className="font-bold text-gray-600 block">Replace Current File Photo</span>
          </div>
        ) : (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm h-40 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.imageBase64} alt="Pre-loaded server url reference" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => setForm((prev) => ({ ...prev, imageBase64: '' }))}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black transition-all shadow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>}

      {/* Primary Action Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs disabled:opacity-60 transition-all shadow-md flex items-center justify-center space-x-2"
      >
        <span>{isPending ? 'Syncing modified state parameters...' : 'Confirm Listing Mutations'}</span>
      </button>

    </form>
  );
}