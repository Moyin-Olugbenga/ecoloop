'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, Play, CheckCircle, Search, User, Eye, X, Film 
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { createTutorial, markTutorialWatched } from '@/app/actions/tutorials';
import { WasteType, User as UserType } from '../generated/prisma/client';

export default function DIYVideosView({
  user,
  tutorials,
  watchedIds,
}: {
  user: UserType;
  tutorials: any[];
  watchedIds: string[];
}) {
  const [filterCategory, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalVideo, setActiveModalVideo] = useState<any>(null); // Controls full-screen pop-up player
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({ title: '', description: '', videoUrl: '', category: 'PLASTIC' });

  // Filter Logic
  const filteredVideos = tutorials.filter((t) => {
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const completionPercentage = tutorials.length > 0 
    ? Math.round((watchedIds.length / tutorials.length) * 100) 
    : 0;

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createTutorial({
          title: form.title,
          description: form.description,
          videoUrl: form.videoUrl,
          category: form.category as any,
        });
        setForm({ title: '', description: '', videoUrl: '', category: 'PLASTIC' });
        setUploadOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload exception occurred.');
      }
    });
  }

  function handleWatchVideo(video: any) {
    setActiveModalVideo(video); // Launch full screen overlay pop-up instantly
    if (!watchedIds.includes(video.id)) {
      startTransition(async () => {
        await markTutorialWatched(video.id);
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] flex font-sans antialiased">
      <Sidebar user={user} role={user.role} />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 pt-24 lg:pt-12 transition-all">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Top Info Banner & Completion Progress Matrix */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#063321]" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#063321] uppercase block">Community Knowledge Share</span>
              <h1 className="text-2xl font-black text-[#063321] tracking-tight">DIY Videos Portal</h1>
            </div>

            {/* Hub Metrics Completion Indicator */}
            <div className="w-full md:w-64 space-y-2 bg-[#F8FBF9] border border-gray-200/60 p-4 rounded-xl">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>Repository Watch Progress</span>
                <span className="text-[#063321] font-black">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#063321] h-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Filtering and Search Controls Banner row */}
          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {['all', ...Object.values(WasteType)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterType(cat)}
                  className={`text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl border transition-all ${filterCategory === cat ? 'bg-[#063321] text-white border-[#063321]' : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <input 
                  type="text" placeholder="Search DIY clips..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-11 pr-4 py-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]" 
                />
              </div>
              <button 
                onClick={() => setUploadOpen(true)}
                className="bg-[#063321] text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-opacity-90 transition-all flex-shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#9DE3C5]" /> <span>Upload DIY</span>
              </button>
            </div>
          </div>

          {/* Video Library Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.length === 0 && <p className="text-xs text-gray-400 font-medium col-span-full">No active DIY videos match your filter parameters.</p>}
            
            {filteredVideos.map((video) => {
              const isWatched = watchedIds.includes(video.id);
              return (
                <div 
                  key={video.id} 
                  onClick={() => handleWatchVideo(video)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between cursor-pointer group hover:border-gray-400 hover:shadow-md transition-all relative"
                >
                  <div className="space-y-3">
                    <div className="aspect-video w-full bg-[#063321] rounded-xl relative flex items-center justify-center text-white overflow-hidden shadow-inner">
                      <Film className="w-8 h-8 opacity-20 absolute" />
                      <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-[#9DE3C5] text-white group-hover:text-[#063321] transition-all flex items-center justify-center shadow-lg relative z-10">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-wider font-bold bg-[#063321]/80 backdrop-blur text-white px-2 py-0.5 rounded border border-white/5">{video.category || 'GENERAL'}</span>
                      {isWatched && <div className="absolute top-2 right-2 bg-[#9DE3C5] text-[#063321] p-1 rounded-full shadow"><CheckCircle className="w-3.5 h-3.5 fill-current" /></div>}
                    </div>

                    <div className="space-y-1 px-1">
                      <h3 className="font-black text-sm text-[#063321] leading-snug tracking-tight group-hover:text-emerald-800 transition-colors line-clamp-1">{video.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{video.description}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between items-center px-1 text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> By: {video.uploadedBy?.name || 'User Profile'}</span>
                    <span className="flex items-center gap-1 font-mono"><Eye className="w-3 h-3" /> {video._count?.views || 0} watched</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ─── 🍿 POP-UP MODAL PLAYER (YOUTUBE CINEMA SCREEN) ─── */}
      {activeModalVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10" onClick={() => setActiveModalVideo(null)}>
          <div 
            className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl relative flex flex-col border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Close Control Strip Bar */}
            <div className="bg-[#063321] text-white px-6 py-4 flex justify-between items-center border-b border-[#0b4d32]">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-black bg-[#0b4d32] text-[#9DE3C5] px-2 py-0.5 rounded uppercase tracking-wider">{activeModalVideo.category || 'DIY RESOURCE'}</span>
                <h2 className="font-black text-sm truncate max-w-xs sm:max-w-md">{activeModalVideo.title}</h2>
              </div>
              <button 
                onClick={() => setActiveModalVideo(null)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Cinema Viewport Frame */}
            <div className="aspect-video w-full bg-black shadow-inner relative">
              <iframe 
                src={activeModalVideo.videoUrl} 
                title={activeModalVideo.title}
                className="w-full h-full absolute inset-0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen 
              />
            </div>

            {/* Bottom Details Content Layer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Description</span>
                <p className="text-gray-600 font-medium leading-relaxed">{activeModalVideo.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-[11px] font-bold text-gray-500 shadow-sm flex-shrink-0">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>Uploader: {activeModalVideo.uploadedBy?.name || 'Ecosystem Profile'}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── CREATION SHEET FORM DIALOG MODAL ─── */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setUploadOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative space-y-5 border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#063321] rounded-t-2xl" />
            
            <div className="flex justify-between items-center pt-1">
              <h2 className="text-lg font-black text-[#063321] tracking-tight">Share DIY Video</h2>
              <button onClick={() => setUploadOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-600">Video Title</label>
                <input required type="text" placeholder="e.g. Upcycling PET Bottles into Broom Structures" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-gray-600">YouTube Embed URL</label>
                  <input required type="url" placeholder="https://www.youtube.com/embed/..." value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321]" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-600">Classification</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] font-bold cursor-pointer">
                    {Object.values(WasteType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-600">Abstract Description</label>
                <textarea required rows={3} placeholder="Provide structural upcycling insights or sorting steps..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 rounded-xl bg-[#F8FBF9] border border-gray-200 focus:outline-none focus:border-[#063321] resize-none leading-relaxed" />
              </div>

              <button 
                type="submit" disabled={isPending}
                className="w-full bg-[#063321] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs disabled:opacity-60 transition-all shadow-md mt-2"
              >
                {isPending ? 'Syncing Video...' : 'Publish DIY Video'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}