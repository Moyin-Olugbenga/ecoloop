'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockDumpSites, DumpSiteNode } from '@/lib/mock-map-data';
import { ShieldAlert, Activity } from 'lucide-react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

const customMarkerIcon = (fillRate: number) => {
  const markerColor = fillRate >= 80 ? '#DC2626' : fillRate >= 50 ? '#D97706' : '#059669';
  return L.divIcon({
    html: `<div style="background-color: ${markerColor};" class="w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse" />`,
    className: 'custom-pin-node',
    iconSize: [16, 16],
  });
};

export default function LiveEcoMap() {
  return (
    /* 🎨 FIXED: Removed 'bg-white', 'border', 'rounded-2xl', and 'shadow-xl' from the parent wrapper */
    <div className="w-full space-y-4">
      
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-600 animate-spin" />
          <h2 className="font-black text-sm text-[#063321] uppercase tracking-wider">Geospatial Sensor Node Web</h2>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded border border-emerald-100">
          Live Tracking Active
        </span>
      </div>

      {/* 🎨 FIXED: Removed 'rounded-xl' and 'shadow-inner' from the map container viewbox wrapper */}
      <div className="h-[450px] w-full relative bg-gray-50 z-10">
        <MapContainer 
          center={[7.4833, 4.5667]} 
          zoom={12} 
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mockDumpSites.map((site: DumpSiteNode) => (
            <Marker 
              key={site.id} 
              position={site.coordinates}
              icon={customMarkerIcon(site.fillRatePercentage)}
            >
              <Popup maxWidth={280}>
                <div className="font-sans text-xs text-[#1A2420] space-y-2 p-1">
                  <div className="border-b border-gray-100 pb-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase text-gray-400 block">{site.lga} LGA</span>
                    <h4 className="font-black text-sm text-[#063321] leading-tight mt-0.5">{site.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Capacity Load</span>
                      <span className={`text-xs font-black block mt-0.5 ${site.fillRatePercentage >= 80 ? 'text-red-600' : 'text-gray-700'}`}>
                        {site.fillRatePercentage}% Filled
                      </span>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Triage Threshold</span>
                      <span className="text-xs font-black text-gray-700 block mt-0.5">
                        {site.daysToFullPollution <= 2 ? `${site.daysToFullPollution} Days left` : `${site.daysToFullPollution} Days`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#F8FBF9] border border-[#9DE3C5]/20 rounded-lg p-2 flex items-center justify-between text-[10px] font-bold text-gray-500">
                    <span>Daily Load Matrix:</span>
                    <span className="font-mono text-[#063321]">{site.avgDailyDumps} dumps/day</span>
                  </div>

                  {site.fillRatePercentage >= 80 && (
                    <div className="bg-red-50 text-red-700 border border-red-100 p-2 rounded-lg flex items-center space-x-1 font-bold text-[9px] uppercase animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>Overflow Warning: Trigger logistics clearance</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}