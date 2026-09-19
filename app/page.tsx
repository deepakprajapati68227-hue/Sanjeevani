"use client";

import React from "react";
import Link from "next/link";
import { PredictIcon, AlertIcon, RespondIcon } from "@/components/Common/Icons";
import MapWrapper from "@/components/Map/MapWrapper";
import { ArrowRight, ShieldAlert, Sparkles, Activity, Radio, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy font-body text-white flex flex-col justify-between overflow-x-hidden">
      {/* Sleek Top Navigation Bar */}
      <header className="border-b border-navy-light/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-navy-card border border-pink/40 flex items-center justify-center p-1 shadow-sm">
            <PredictIcon size={20} color="#EC1E63" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-white">
            SANJEEVANI
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider bg-pink/20 text-pink border border-pink/30 px-1.5 py-0.5 rounded ml-2">
            Climate Resilience Engine
          </span>
        </div>

        <Link
          href="/dashboard"
          className="bg-pink hover:bg-pink-hover text-white text-xs font-semibold px-4 py-2 rounded-btn shadow transition-all flex items-center gap-1.5"
        >
          <span>Open Live Dashboard</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col gap-6">
        {/* Direct, Punchy Header (No generic gradient blob hero) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-light/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-pink mb-1.5 tracking-wider uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-pink animate-ping"></span>
              Autonomous Early Warning & Response System
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Predict. Alert. Respond.
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed">
              Synthesizing live satellite weather telemetry, CGWB groundwater trends, and local vulnerability into actionable community alerts before the window for prevention closes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="bg-pink hover:bg-pink-hover text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-btn shadow-lg transition-all flex items-center gap-2 group"
            >
              <span>Launch Supervisor Station</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Live Functional Embedded Map Centerpiece */}
        <div className="w-full h-[460px] sm:h-[520px] rounded-card border border-navy-light/80 shadow-2xl overflow-hidden relative">
          {/* Overlay Tag */}
          <div className="absolute top-3 left-3 z-10 bg-navy/90 backdrop-blur-sm border border-navy-light/80 px-3 py-1.5 rounded-card flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Live District Telemetry</span>
            <span className="text-[10px] text-gray-400 font-mono">Chandrapur, MH</span>
          </div>

          <MapWrapper />

          {/* Quick Click Invitation Banner */}
          <div className="absolute bottom-3 right-3 z-10 bg-navy/95 backdrop-blur-sm border border-pink/40 px-3 py-1.5 rounded-card text-xs text-white shadow-xl flex items-center gap-2">
            <ShieldAlert size={14} className="text-pink" />
            <span>Interactive Map Active: Click markers to inspect real risk data</span>
            <Link
              href="/dashboard"
              className="ml-2 font-bold text-pink hover:underline flex items-center gap-1"
            >
              Full Screen &rarr;
            </Link>
          </div>
        </div>

        {/* The 4-Step Core Loop Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* 1. Predict */}
          <div className="bg-navy-card border border-gray-800 rounded-card p-4 flex flex-col justify-between hover:border-gray-700 transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-navy border border-pink/30 flex items-center justify-center mb-2.5">
                <PredictIcon size={18} color="#EC1E63" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white mb-1">
                1. Predict
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Open-Meteo forecasts coupled with CGWB groundwater aquifer trends and demographic vulnerability data.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono text-pink">
              Deterministic & Explainable
            </div>
          </div>

          {/* 2. Alert */}
          <div className="bg-navy-card border border-gray-800 rounded-card p-4 flex flex-col justify-between hover:border-gray-700 transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-navy border border-pink/30 flex items-center justify-center mb-2.5">
                <AlertIcon size={18} color="#EC1E63" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white mb-1">
                2. Alert
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Instant hyper-localized broadcast previews delivered in regional languages (English & मराठी) on simulated WhatsApp interfaces.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono text-emerald-400">
              Zero App Installation Needed
            </div>
          </div>

          {/* 3. Respond */}
          <div className="bg-navy-card border border-gray-800 rounded-card p-4 flex flex-col justify-between hover:border-gray-700 transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-navy border border-pink/30 flex items-center justify-center mb-2.5">
                <RespondIcon size={18} color="#EC1E63" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white mb-1">
                3. Respond
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Automated routing to designated cooling shelters, drinking water hubs, and medical stations within nearest proximity.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono text-amber-300">
              Curated Emergency Facilities
            </div>
          </div>

          {/* 4. Learn */}
          <div className="bg-navy-card border border-gray-800 rounded-card p-4 flex flex-col justify-between hover:border-gray-700 transition-colors">
            <div>
              <div className="w-8 h-8 rounded bg-navy border border-pink/30 flex items-center justify-center mb-2.5">
                <Activity size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white mb-1">
                4. Learn
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Field supervisors log outcomes and false alarms to immediately calibrate village sensitivity weights for the next alert cycle.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono text-emerald-400">
              Verified Feedback Loop
            </div>
          </div>
        </div>
      </main>

      {/* Grounded Technical Footer */}
      <footer className="border-t border-navy-light/60 px-6 py-4 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Sanjeevani Climate Resilience Prototype</span>
          <span>•</span>
          <span className="text-gray-400">Chandrapur District Pilot</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Data Sources: Open-Meteo • CGWB India-WRIS • NASA FIRMS</span>
        </div>
      </footer>
    </div>
  );
}
