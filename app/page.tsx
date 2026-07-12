'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  ArrowRight, 
  Activity, 
  Layers, 
  TrendingUp, 
  GraduationCap, 
  ShoppingBag, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

export default function MainPage() {
  // Simple state for FAQ toggles
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FBF9] text-[#1A2420] font-sans antialiased">
      
      {/* ─── 1. GLOBAL HEADER / NAVBAR ─── */}
      <header className="sticky top-0 z-50 bg-[#063321] text-white border-b border-[#0b4d32] shadow-md px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#9DE3C5] p-2 rounded-xl text-[#063321]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </div>
            <div>
              <span className="font-black text-xl tracking-wider block">ECOLOOP</span>
              <span className="text-[10px] text-[#9DE3C5] tracking-widest uppercase block -mt-1">Lagos Waste Economy</span>
            </div>
          </div>

          <nav className="hidden lg:flex space-x-8 text-sm font-semibold tracking-wide">
            <a href="#problem" className="hover:text-[#9DE3C5] transition-colors">The Problem</a>
            <a href="#live-map" className="hover:text-[#9DE3C5] transition-colors">Live Map</a>
            <a href="#ecosystem" className="hover:text-[#9DE3C5] transition-colors">Marketplace</a>
            <a href="#build-plan" className="hover:text-[#9DE3C5] transition-colors">Build Roadmap</a>
            <a href="#faq" className="hover:text-[#9DE3C5] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-4">
            <a href="/signin" className="text-sm font-bold hover:text-[#9DE3C5] transition-colors hidden sm:inline-block">
              Sign In
            </a>
            <a 
              href="/signup" 
              className="bg-[#9DE3C5] text-[#063321] px-5 py-3 rounded-xl text-sm font-black shadow-md hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO SPLIT SECTION ─── */}
      <section className="bg-[#063321] text-white py-8 sm:py-12 lg:py-16 border-b-4 border-[#9DE3C5] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center bg-[#0b4d32] border border-[#9DE3C5]/30 text-[#9DE3C5] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mx-auto lg:mx-0">
                🚀 Hackathon Project Phase Entry • 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Turning Lagos' Waste Problem Into a <span className="text-[#9DE3C5]">Waste Economy</span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/80 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A live pollution map + waste marketplace + schools curriculum—one single platform connecting households, informal collectors, industry, and the next generation.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <a 
                  href="/signup" 
                  className="bg-[#9DE3C5] text-[#063321] px-8 py-4 rounded-xl font-black shadow-lg hover:bg-opacity-95 transition-all flex items-center justify-center space-x-2 group w-full sm:w-auto"
                >
                  <span>Sell & Recycle Waste</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#live-map" 
                  className="border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <span>Explore Live Map Network</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
              <div className="bg-[#0b4d32] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-emerald-300 font-mono tracking-widest">ECO-LOOP ENGINE v1.0</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#063321]/60 p-4 rounded-xl border border-white/5">
                    <span className="text-xs uppercase tracking-wider text-emerald-200/60 block">Lagos Daily Input Metric Class</span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-3xl font-black text-white">13,000+</span>
                      <span className="text-sm font-bold text-[#9DE3C5]">Tonnes Generated Daily</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#063321]/60 p-4 rounded-xl border border-white/5">
                      <span className="text-xs uppercase tracking-wider text-emerald-200/60 block">Recyclable Material</span>
                      <span className="text-2xl font-bold text-white block mt-1">~70%</span>
                    </div>
                    <div className="bg-[#063321]/60 p-4 rounded-xl border border-white/5">
                      <span className="text-xs uppercase tracking-wider text-emerald-200/60 block">Market Yield</span>
                      <span className="text-2xl font-bold text-[#9DE3C5] block mt-1">₦ Net Positive</span>
                    </div>
                  </div>

                  <div className="bg-[#063321]/40 rounded-xl p-3 border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-[#063321]/60 p-2 rounded border-l-2 border-[#9DE3C5]">
                      <span className="font-semibold text-white">Household batch listed</span>
                      <span className="text-emerald-300 font-mono">+14.2kg PET</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#063321]/60 p-2 rounded border-l-2 border-yellow-400">
                      <span className="font-semibold text-white">Collector dispatch route confirmed</span>
                      <span className="text-yellow-300 font-mono">Ikeja Area</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. NEW SECTION: PROBLEM STATEMENT ─── */}
      <section id="problem" className="py-20 sm:py-28 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 text-red-600 font-bold tracking-widest uppercase text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>The Core Crisis</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#063321] tracking-tight">
                Lagos is drowning in waste it can't see, sort, or sell
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Most refuse is dumped in informal, scattered open sites with absolutely no data tracking. The entities generating waste, the collectors sorting it, and processing buyers operate completely disconnected.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="bg-[#F8FBF9] border border-gray-100 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">01</div>
                <h4 className="font-black text-[#063321] text-base">No Visibility</h4>
                <p className="text-xs text-gray-500 leading-relaxed">No public, real-time metrics tracking where pollution hazards are peaking.</p>
              </div>

              <div className="bg-[#F8FBF9] border border-gray-100 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">02</div>
                <h4 className="font-black text-[#063321] text-base">No Marketplace</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Households, middlemen, and manufacturing units operate completely in isolation.</p>
              </div>

              <div className="bg-[#F8FBF9] border border-gray-100 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">03</div>
                <h4 className="font-black text-[#063321] text-base">No Loop</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Children grow up amidst urban dumps without structured paths for habit optimization.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. THREE PILLAR PLATFORM ECOSYSTEM ─── */}
      <section id="ecosystem" className="py-20 sm:py-28 bg-[#F8FBF9] border-b border-gray-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#063321]">Unified Stack Platform Architecture</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1A2420] tracking-tight">
              One Closed Loop Solution, Three Critical Channels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200/60 rounded-2xl p-8 space-y-4 hover:border-[#9DE3C5] hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#063321] text-[#9DE3C5] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#063321]">1. See It (Data Layer)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Live visibility engines mapping real-time open pollution sites down to localized street views utilizing integrated IoT nodes.
              </p>
            </div>

            <div className="bg-white border border-gray-200/60 rounded-2xl p-8 space-y-4 hover:border-[#9DE3C5] hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#9DE3C5] text-[#063321] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#063321]">2. Sell It (Marketplace)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect decentralized processing pipelines. Sourced materials stream transparently from household units down to industrial fabrication buyers.
              </p>
            </div>

            <div className="bg-white border border-gray-200/60 rounded-2xl p-8 space-y-4 hover:border-[#9DE3C5] hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#063321] flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#063321]">3. Teach It (Education)</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Deploy dynamic localized gamified modules tracking clean habits directly using automated local school district metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. LIVE MAP VISUALIZATION INTERFACE ─── */}
      <section id="live-map" className="py-20 sm:py-28 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#063321] mb-2 flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Real-time Geospatial Layer</span>
            </h2>
            <p className="text-3xl font-black text-[#1A2420] tracking-tight sm:text-4xl">
              Live Pollution Severity Mapping Network
            </p>
          </div>

          <div className="bg-[#F8FBF9] rounded-2xl border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[550px] lg:h-[600px]">
            <div className="lg:col-span-4 bg-[#063321] text-white p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="bg-[#0b4d32] rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-bold text-[#9DE3C5] mb-2">Active Telemetry Spec</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    PostGIS-backed databases routing automated triggers whenever community landfill node caps drop below specified structural thresholds.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-200/50 block">Layer Controls</span>
                  <label className="flex items-center space-x-3 bg-[#0b4d32]/50 p-3 rounded-lg border border-white/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#063321] focus:ring-[#9DE3C5] accent-[#9DE3C5] w-4 h-4" />
                    <span className="text-xs font-bold text-white">Active Sensor Hardware Nodes</span>
                  </label>
                  <label className="flex items-center space-x-3 bg-[#0b4d32]/50 p-3 rounded-lg border border-white/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#063321] focus:ring-[#9DE3C5] accent-[#9DE3C5] w-4 h-4" />
                    <span className="text-xs font-bold text-white">Marketplace Drop-off batched clusters</span>
                  </label>
                </div>

                <div className="pt-2 space-y-2 border-t border-white/10">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-200/50 block">Hotspot Density Indicators</span>
                  <div className="flex items-center space-x-2 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-gray-300">Critical Open Dumping Area</span></div>
                  <div className="flex items-center space-x-2 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><span className="text-gray-300">Overflowing Secondary Node</span></div>
                  <div className="flex items-center space-x-2 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-[#9DE3C5]" /><span className="text-gray-300">Cleaned Managed Economy Hub</span></div>
                </div>
              </div>
              <button className="w-full bg-[#9DE3C5] text-[#063321] font-black text-xs py-4 rounded-xl uppercase tracking-widest shadow-md mt-6 lg:mt-0">
                Log New Dumping Hotspot
              </button>
            </div>

            <div className="lg:col-span-8 bg-gray-100 relative flex items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] min-h-[300px]">
              <div className="relative text-center z-10 space-y-2">
                <MapPin className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-[#1A2420]">Mapbox Canvas Framework Frame</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">Dynamic map layers load seamlessly in client instances via integrated PostGIS mapping models.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. NEW SECTION: 5-DAY ROADMAP BUILD PLAN ─── */}
      <section id="build-plan" className="py-20 sm:py-28 bg-[#F8FBF9] border-t border-gray-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#063321]">Project Implementation Sprint</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1A2420] tracking-tight">
              5-Day Phase Build Architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { day: 'Day 1', label: 'Foundation Set', text: 'Finalize interface endpoints & operational relational database schemas.', icon: Layers },
              { day: 'Day 2', label: 'Core Marketplace', text: 'Establish transactional pipelines connecting small sellers to aggregators.', icon: ShoppingBag },
              { day: 'Day 3', label: 'Telemetry Link', text: 'Bind mapped telemetry views with automated field hardware simulation triggers.', icon: Activity },
              { day: 'Day 4', label: 'Polish & Assert', text: 'Configure transactional ledger validations and profile security layers.', icon: ShieldCheck },
              { day: 'Day 5', label: 'Demo Ready', text: 'Final deployment instance audits and continuous loop stress tests.', icon: Award },
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative group hover:border-[#063321] transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-[#063321] bg-[#9DE3C5] px-2.5 py-1 rounded-md">{step.day}</span>
                      <StepIcon className="w-5 h-5 text-gray-400 group-hover:text-[#063321] transition-colors" />
                    </div>
                    <h4 className="font-black text-[#063321] text-base">{step.label}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. NEW SECTION: TARGET USERS & EXPECTED IMPACT ─── */}
      <section className="py-20 sm:py-28 bg-white border-y border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-[#063321] tracking-tight">
                Designed for absolute ecosystem transformation
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                By targeting precise micro-layers across Lagos public infrastructure, we enable long-term clean operational transparency.
              </p>
              <div className="bg-[#F8FBF9] p-4 rounded-xl border border-gray-200/60 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#063321]">
                  <CheckCircle className="w-4 h-4 text-[#063321]" />
                  <span>Targeted Structural Upcycling Gains</span>
                </div>
                <p className="text-xs text-gray-500">Redirects bulk commercial processing flows away from localized municipal networks.</p>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[
                { title: "Households & Estates", text: "Turns domestic trash into passive income lines by scheduling bulk marketplace pickups.", icon: Users },
                { title: "Collectors & Middlemen", text: "Optimizes collection routes via the live severity tracking console layout.", icon: TrendingUp },
                { title: "Manufacturing Buyers", text: "Secures regular pipelines of high-purity industrial raw material inputs directly.", icon: BarChart3 },
                { title: "Schools & Educators", text: "Instills eco-sorting behaviors early via interactive gamified learning instances.", icon: GraduationCap }
              ].map((user, idx) => {
                const UserIcon = user.icon;
                return (
                  <div key={idx} className="bg-[#F8FBF9] border border-gray-100 p-6 rounded-2xl flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-[#063321] border border-gray-100">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-[#063321] text-sm">{user.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{user.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─── 8. NEW SECTION: FREQUENTLY ASKED QUESTIONS ─── */}
      <section id="faq" className="py-20 sm:py-28 bg-[#F8FBF9] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#063321]">Got Questions?</h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1A2420] tracking-tight">
              Ecosystem Mechanics Decoded
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How exactly do the hardware sensors monitor pollution streams?", a: "Low-cost electronic nodes are physically deployed at micro-collection sites to read volumetric baseline fills and localized parameter outputs. This data updates the server layer instantly over open cellular or IoT routing networks." },
              { q: "How are financial payouts processed across the marketplace?", a: "Once localized sorting brokers physically weigh and confirm the chemical purity grade of a batch submission, rewards are credited straight to your dashboard profile ledger for instant local bank settlement." },
              { q: "Can individual public school boards use this without external budgets?", a: "Yes. The basic module layer is engineered to remain extremely lightweight and accessible, functioning natively over standard mobile browsers without complex software footprints." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left font-black text-[#063321] text-sm sm:text-base hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#063321]" /> : <ChevronDown className="w-4 h-4 text-[#063321]" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. GLOBAL PERSISTENT FOOTER ─── */}
      <footer className="bg-[#063321] text-white/60 text-xs py-12 border-t border-[#0b4d32] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <span className="font-black text-white block text-sm tracking-wider">ECOLOOP PLATFORM</span>
            <span className="block mt-0.5 text-white/40">Hackathon Build MVP Implementation System Architecture • 2026</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <a href="#problem" className="hover:text-[#9DE3C5] transition-colors">Crisis Overview</a>
            <a href="#live-map" className="hover:text-[#9DE3C5] transition-colors">Geospatial Nodes</a>
            <a href="#ecosystem" className="hover:text-[#9DE3C5] transition-colors">B2B Core</a>
            <a href="#build-plan" className="hover:text-[#9DE3C5] transition-colors">Phase Steps</a>
          </div>
        </div>
      </footer>

    </div>
  );
}