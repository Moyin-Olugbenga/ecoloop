'use client';

import React, { useState, useRef } from 'react';
import { X, Plus, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { createListing } from '@/app/actions/listings';

const WasteType = ['PLASTIC', 'METAL', 'ORGANIC', 'EWASTE', 'PAPER', 'GLASS', 'OTHER'];

export default function CreateListingModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Updated state structure to pass base64 directly to Cloudinary action hook
  const [form, setForm] = useState({
    wasteType: 'PLASTIC',
    quantityKg: '',
    price: '',
    location: '',
    imageBase64: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setForm({ wasteType: 'PLASTIC', quantityKg: '', price: '', location: '', imageBase64: '' });
    setError(null);
  }

  // Handle client-side binary extraction to clean base64 data strings safely
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject assets exceeding standard 5MB tiers for rapid hackathon validation
    if (file.size > 5 * 1024 * 1024) {
      setError('Image snapshot payload limits exceed maximum allowed 5MB cap.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createListing({
        wasteType: form.wasteType as any,
        quantityKg: parseFloat(form.quantityKg),
        price: form.price ? parseFloat(form.price) : undefined,
        location: form.location || undefined,
        imageBase64: form.imageBase64 || undefined, // Cloudinary secure upload routing parameter mapping
      });
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish listing');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#063321] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4 text-[#9DE3C5]" />
        Add Listing
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative space-y-5 transform transition-all border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Structural color identifier top block line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321] rounded-t-2xl" />
            
            <div className="flex justify-between items-center pt-2">
              <h2 className="text-lg font-black text-[#063321] tracking-tight">Create New Listing</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Waste Type</label>
                  <select
                    value={form.wasteType}
                    onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] cursor-pointer"
                  >
                    {Object.values(WasteType).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Quantity (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="0.0"
                    value={form.quantityKg}
                    onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Asking Price (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 20000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Pickup Location Area</label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Lagos LGA"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]"
                />
              </div>

              {/* Native Native Base64 Streaming Input Area Dropzone box interface */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Batch Photo Proof <span className="font-normal text-gray-400">(Required)</span></label>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" // Forces smartphone cameras to initialize instantly when triggered by user instances
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {!form.imageBase64 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-[#063321] rounded-xl p-6 bg-[#F8FBF9] text-center space-y-2 cursor-pointer transition-all flex flex-col items-center justify-center group"
                  >
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#063321] transition-colors" />
                    <span className="text-xs font-bold text-gray-600 block">Snap Picture or Upload File</span>
                    <span className="text-[10px] text-gray-400 block font-medium">Max upload limit tier payload capacity: 5MB</span>
                  </div>
                ) : (
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm h-40 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageBase64} alt="Captured preview snapshot verification lot" className="w-full h-full object-cover" />
                    <button 
                        type="button" 
                        onClick={() => setForm((prev) => ({ ...prev, imageBase64: '' }))} // ✨ Fixed: 'p' changed to 'prev'
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black transition-all shadow"
                    >
                        <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {error && <p className="text-xs text-red-600 font-bold tracking-tight bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#063321] hover:bg-opacity-95 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs disabled:opacity-60 transition-all shadow-md mt-2"
              >
                {isSubmitting ? 'Syncing image data...' : 'Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}