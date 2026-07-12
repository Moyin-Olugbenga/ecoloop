'use client';

import React from 'react';
import { BookOpen, Layers, Award } from 'lucide-react';

export default function SchoolDashboard({ data }: { data: any }) {
  const {
    completedCount = 0,
    totalTutorials = 0,
    categoriesCovered = 0,
    progress = [],
  } = data ?? {};

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><BookOpen className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Completed Lessons</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{completedCount} of {totalTutorials}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Layers className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Categories Covered</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">{categoriesCovered}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#063321]"><Award className="w-6 h-6" /></div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Completion Rate</span>
            <span className="text-2xl font-black text-[#063321] block mt-0.5">
              {totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-black text-[#063321] text-base">Curriculum Progress</h3>
          <a href="/learn" className="text-xs font-bold text-[#063321] hover:underline">Go to tutorials →</a>
        </div>
        <div className="space-y-3 text-xs">
          {progress.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">No tutorials available yet.</p>
          )}
          {progress.map((p: any) => (
            <div key={p.id} className="space-y-1">
              <div className="flex justify-between font-bold text-gray-600">
                <span>{p.title}</span>
                <span className="text-[#063321]">{p.watched ? '100%' : '0%'}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#063321] h-full" style={{ width: p.watched ? '100%' : '0%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}