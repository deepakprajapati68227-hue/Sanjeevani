"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PredictIcon, AlertIcon, RespondIcon } from "@/components/Common/Icons";
import MapWrapper from "@/components/Map/MapWrapper";
import { ArrowRight, ShieldAlert, Activity, Radio, MapPin, AlertTriangle } from "lucide-react";

const TICKER_ITEMS = [
  "Scanning Chandrapur district telemetry...",
  "12 wards monitored in real-time",
  "1 critical hotspot active in Ballarpur",
  "Open-Meteo & CGWB telemetry live",
];

const CORE_LOOP_STEPS = [
  {
    step: "1",
    title: "Predict",
    icon: <PredictIcon size={20} color="#087F7B" />,
    desc: "Open-Meteo forecasts coupled with CGWB groundwater aquifer trends and demographic vulnerability data.",
    badge: "Deterministic & Explainable",
    badgeColor: "text-[#087F7B] border-[#087F7B]/30 bg-[#E5F3EC]",
  },
  {
    step: "2",
    title: "Alert",
    icon: <AlertIcon size={20} color="#087F7B" />,
    desc: "Instant hyper-localized broadcast previews delivered in regional languages (English, मराठी, हिन्दी) without requiring resident app installation.",
    badge: "Zero App Install Required",
    badgeColor: "text-[#267A58] border-[#267A58]/30 bg-[#E5F3EC]",
  },
  {
    step: "3",
    title: "Respond",
    icon: <RespondIcon size={20} color="#087F7B" />,
    desc: "Automated routing to designated cooling shelters, drinking water hubs, and medical stations within nearest proximity.",
    badge: "Curated Emergency Facilities",
    badgeColor: "text-[#C47A12] border-[#C47A12]/30 bg-[#FFF3D6]",
  },
  {
    step: "4",
    title: "Learn",
    icon: <Activity size={20} className="text-[#6558A5]" />,
    desc: "Field supervisors log outcomes and false alarms to immediately calibrate village sensitivity weights for the next alert cycle.",
    badge: "Verified Feedback Loop",
    badgeColor: "text-[#6558A5] border-[#6558A5]/30 bg-[#EAF2F5]",
  },
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [tickerIndex, setTickerIndex] = useState(0);

  // Live status ticker cycling every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-body text-[#172B4D] flex flex-col justify-between overflow-x-hidden">
      {/* Executive Top Navigation Bar - Monsoon Indigo */}
      <header className="bg-[#3157A6] border-b border-[#24417D] px-6 py-3.5 flex items-center justify-between z-20 shadow-xs text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#24417D] border border-[#4469B5] flex items-center justify-center text-white shadow-xs">
            <PredictIcon size={18} color="#087F7B" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-white">
            SANJEEVANI
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#24417D] text-[#EAF2F5] border border-[#4469B5] px-2 py-0.5 rounded ml-1 hidden sm:inline-block">
            Disaster Early Warning &amp; Response
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/resident"
            className="bg-[#24417D] hover:bg-[#1E3666] text-white border border-[#4469B5] text-xs font-semibold px-3.5 py-2 rounded transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
          >
            <span>Resident Safety View</span>
          </Link>
          <Link
            href="/dashboard"
            className="bg-[#087F7B] hover:bg-[#05605D] text-white text-xs font-semibold px-4 py-2 rounded shadow-xs transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
          >
            <span>Officer Command</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col gap-8">
        {/* Staggered Hero Entrance Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#CBD7E2] pb-8">
          <div className="flex-1">
            {/* 1. Live Status Ticker */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#CBD7E2] shadow-xs mb-3">
              <span className="flex h-2 w-2 rounded-full bg-[#267A58] animate-pulse"></span>
              <div className="h-4 overflow-hidden relative min-w-[220px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tickerIndex}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-[11px] font-mono font-medium text-[#52657A] tracking-wide block"
                  >
                    {TICKER_ITEMS[tickerIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* 2. Primary Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#172B4D] tracking-tight leading-tight">
              Predict. Alert. Respond.
            </h1>

            {/* Concise Editorial Subheading */}
            <div className="text-xs sm:text-sm font-semibold text-[#087F7B] font-mono mt-2 tracking-wide flex items-center gap-2">
              <ShieldAlert size={15} className="text-[#087F7B]" />
              <span>Built to warn people before the map turns red — not after.</span>
            </div>

            {/* 3. Subheadline */}
            <p className="text-[#52657A] text-xs sm:text-sm max-w-2xl mt-2.5 leading-relaxed">
              Synthesizing live satellite weather telemetry, CGWB groundwater trends, and local vulnerability into actionable community alerts before the window for prevention closes.
            </p>
          </div>

          {/* 4. Action CTAs */}
          <div className="flex items-center gap-3 pt-2 md:pt-0">
            <Link
              href="/dashboard"
              className="bg-[#087F7B] hover:bg-[#05605D] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded shadow-xs transition-colors flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
            >
              <span>Officer Command Station</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/resident"
              className="bg-[#FFFFFF] hover:bg-[#F7F9FC] text-[#172B4D] border border-[#CBD7E2] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded shadow-xs transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
            >
              <span>Resident Safety View</span>
            </Link>
          </div>
        </div>

        {/* Live Functional Embedded Map Preview */}
        <div className="w-full h-[460px] sm:h-[520px] rounded-xl border border-[#CBD7E2] bg-[#FFFFFF] shadow-xs overflow-hidden relative">
          {/* Telemetry Header Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-[#3157A6] text-white border border-[#24417D] px-3 py-1.5 rounded-md flex items-center gap-2 text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#267A58] animate-pulse"></span>
            <span className="font-semibold text-white">Live District Telemetry</span>
            <span className="text-[10px] text-[#DCE6F2] font-mono">Chandrapur, MH</span>
          </div>

          {/* Embedded Dynamic Leaflet Map */}
          <MapWrapper />

          {/* Live Status Overlay: Ballarpur Hotspot */}
          <div className="absolute top-[46%] left-[44%] z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#B9383E] border-2 border-white flex-shrink-0"></div>
            <div className="bg-[#24417D] border border-[#4469B5] px-2.5 py-1 rounded text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9383E]"></span>
              <span>Ballarpur: Critical Watch Hotspot (44.5°C)</span>
            </div>
          </div>

          {/* Quick Click Invitation Banner */}
          <div className="absolute bottom-3 right-3 z-10 bg-[#FFFFFF] border border-[#CBD7E2] px-3 py-1.5 rounded-md text-xs text-[#172B4D] shadow-xs flex items-center gap-2">
            <ShieldAlert size={14} className="text-[#087F7B]" />
            <span>Interactive Map Active: Click markers to inspect real risk data</span>
            <Link
              href="/dashboard"
              className="ml-2 font-bold text-[#087F7B] hover:underline flex items-center gap-1"
            >
              Full Screen &rarr;
            </Link>
          </div>
        </div>

        {/* The 4-Step Operational Flow */}
        <section className="relative pt-4 pb-2">
          {/* Section Sub-heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#087F7B]">
                Continuous Resilience Loop
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#172B4D] tracking-tight">
                How Sanjeevani Protects Lives
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#52657A] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#267A58]"></span>
              <span>Closed Feedback Architecture</span>
            </div>
          </div>

          {/* 4 Connected Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {CORE_LOOP_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-[#FFFFFF] border border-[#CBD7E2] hover:border-[#087F7B] rounded-xl p-5 flex flex-col justify-between transition-colors shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2F5] border border-[#CBD7E2] flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#52657A]">
                      0{step.step}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#172B4D] mb-1.5">
                    {step.step}. {step.title}
                  </h3>
                  <p className="text-[#52657A] text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CBD7E2]">
                  <span className={`inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Grounded Technical Footer */}
      <footer className="border-t border-[#CBD7E2] bg-[#FFFFFF] px-6 py-4 text-xs text-[#52657A] flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#172B4D]">Sanjeevani Climate Resilience Platform</span>
          <span>•</span>
          <span>Government of Maharashtra / DDMA Chandrapur Pilot</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Data Telemetry: Open-Meteo • CGWB India-WRIS • NASA FIRMS</span>
        </div>
      </footer>
    </div>
  );
}
