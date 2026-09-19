"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PredictIcon, AlertIcon, RespondIcon } from "@/components/Common/Icons";
import MapWrapper from "@/components/Map/MapWrapper";
import { ArrowRight, ShieldAlert, Sparkles, Activity, Radio, MapPin, AlertTriangle } from "lucide-react";

const TICKER_ITEMS = [
  "Scanning Chandrapur district...",
  "12 wards monitored",
  "2 critical zones detected",
  "Live weather feed active",
];

const CORE_LOOP_STEPS = [
  {
    step: "1",
    title: "Predict",
    icon: <PredictIcon size={20} color="#EC1E63" />,
    desc: "Open-Meteo forecasts coupled with CGWB groundwater aquifer trends and demographic vulnerability data.",
    badge: "Deterministic & Explainable",
    badgeColor: "text-pink border-pink/30 bg-pink/10",
  },
  {
    step: "2",
    title: "Alert",
    icon: <AlertIcon size={20} color="#EC1E63" />,
    desc: "Instant hyper-localized broadcast previews delivered in regional languages (English & मराठी) on simulated WhatsApp interfaces.",
    badge: "Zero App Installation Needed",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    step: "3",
    title: "Respond",
    icon: <RespondIcon size={20} color="#EC1E63" />,
    desc: "Automated routing to designated cooling shelters, drinking water hubs, and medical stations within nearest proximity.",
    badge: "Curated Emergency Facilities",
    badgeColor: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  },
  {
    step: "4",
    title: "Learn",
    icon: <Activity size={20} className="text-emerald-400" />,
    desc: "Field supervisors log outcomes and false alarms to immediately calibrate village sensitivity weights for the next alert cycle.",
    badge: "Verified Feedback Loop",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
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
    <div className="min-h-screen bg-navy font-body text-white flex flex-col justify-between overflow-x-hidden">
      {/* Sleek Top Navigation Bar */}
      <header className="border-b border-navy-light/60 px-6 py-4 flex items-center justify-between z-20">
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
          className="bg-pink hover:bg-[#D81557] hover:scale-[1.03] text-white text-xs font-semibold px-4 py-2 rounded-btn shadow transition-all duration-150 flex items-center gap-1.5 active:scale-[0.98]"
        >
          <span>Open Live Dashboard</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col gap-8">
        {/* Staggered Hero Entrance Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-light/60 pb-6">
          <div className="flex-1">
            {/* 1. Live Status Ticker (Pill-shaped above headline) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-navy-card/90 border border-pink/30 shadow-md mb-3"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>

              <div className="h-4 overflow-hidden relative min-w-[210px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tickerIndex}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-[11px] font-mono font-medium text-gray-200 tracking-wide block"
                  >
                    {TICKER_ITEMS[tickerIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* 2. Primary Headline */}
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight"
            >
              Predict. Alert. Respond.
            </motion.h1>

            {/* Concise Punchline */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-xs sm:text-sm font-semibold text-pink font-mono mt-1.5 tracking-wide flex items-center gap-2"
            >
              <Sparkles size={14} className="text-pink" />
              <span>Built to warn people before the map turns red — not after.</span>
            </motion.div>

            {/* 3. Subheadline */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="text-gray-400 text-xs sm:text-sm max-w-2xl mt-2.5 leading-relaxed"
            >
              Synthesizing live satellite weather telemetry, CGWB groundwater trends, and local vulnerability into actionable community alerts before the window for prevention closes.
            </motion.p>
          </div>

          {/* 4. CTA Button (Staggered entrance + hover micro-interaction) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="flex items-center gap-3 pt-2 md:pt-0"
          >
            <Link
              href="/dashboard"
              className="bg-pink hover:bg-[#D81557] hover:scale-[1.03] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-btn shadow-lg hover:shadow-pink/30 transition-all duration-150 flex items-center gap-2 group active:scale-[0.98]"
            >
              <span>Launch Supervisor Station</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-150" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll-Triggered Reveal: Live Functional Embedded Map Preview */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full h-[460px] sm:h-[520px] rounded-card border border-navy-light/80 shadow-2xl overflow-hidden relative group"
        >
          {/* Telemetry Header Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-navy/90 backdrop-blur-sm border border-navy-light/80 px-3 py-1.5 rounded-card flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Live District Telemetry</span>
            <span className="text-[10px] text-gray-400 font-mono">Chandrapur, MH</span>
          </div>

          {/* Embedded Dynamic Leaflet Map */}
          <MapWrapper />

          {/* Pulsing Live Danger Marker 1: Ballarpur Hotspot Overlay */}
          <div className="absolute top-[46%] left-[44%] z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.18, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(236, 30, 99, 0.9)",
                        "0 0 0 16px rgba(236, 30, 99, 0)",
                        "0 0 0 0 rgba(236, 30, 99, 0.9)",
                      ],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-4 h-4 rounded-full bg-pink border-2 border-white flex-shrink-0"
            />
            <div className="bg-navy/90 backdrop-blur-md border border-pink/60 px-2 py-1 rounded text-[10px] font-bold text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Ballarpur: High Danger Hotspot (43.8°C)</span>
            </div>
          </div>

          {/* Pulsing Live Danger Marker 2: Chandrapur East Urban Hotspot Overlay */}
          <div className="absolute top-[34%] left-[39%] z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.18, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(211, 47, 47, 0.9)",
                        "0 0 0 14px rgba(211, 47, 47, 0)",
                        "0 0 0 0 rgba(211, 47, 47, 0.9)",
                      ],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white flex-shrink-0"
            />
            <div className="bg-navy/90 backdrop-blur-md border border-red-500/60 px-2 py-1 rounded text-[10px] font-bold text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Ward 14: Thermal Inversion Zone</span>
            </div>
          </div>

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
        </motion.div>

        {/* Scroll-Triggered Reveal: The 4-Step Animated Flow with Connecting Path */}
        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="relative pt-4 pb-2"
        >
          {/* Section Sub-heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-pink">
                Continuous Resilience Loop
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                How Sanjeevani Protects Lives
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Closed Feedback Architecture</span>
            </div>
          </div>

          {/* Animated Connecting Path Container */}
          <div className="relative">
            {/* Desktop Horizontal Connecting SVG Line */}
            <div className="hidden lg:block absolute top-[28px] left-[6%] right-[6%] h-[2px] z-0 pointer-events-none">
              <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                <motion.line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#EC1E63"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </div>

            {/* 4 Connected Cards Grid / Horizontal Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {CORE_LOOP_STEPS.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + idx * 0.15,
                    ease: "easeOut",
                  }}
                  className="bg-navy-card border border-gray-800 hover:border-pink/50 rounded-card p-5 flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink/5 group"
                >
                  <div>
                    {/* Step Icon seated on the connecting line */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-lg bg-navy border border-pink/40 flex items-center justify-center shadow-md group-hover:border-pink transition-colors">
                        {step.icon}
                      </div>
                      <span className="font-mono text-xs font-bold text-gray-500 group-hover:text-pink transition-colors">
                        0{step.step}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-white mb-1.5 group-hover:text-pink-light transition-colors">
                      {step.step}. {step.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800">
                    <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Scroll-Triggered Reveal: Grounded Technical Footer */}
      <motion.footer
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="border-t border-navy-light/60 px-6 py-4 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10"
      >
        <div className="flex items-center gap-2">
          <span>Sanjeevani Climate Resilience Prototype</span>
          <span>•</span>
          <span className="text-gray-400">Chandrapur District Pilot</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Data Sources: Open-Meteo • CGWB India-WRIS • NASA FIRMS</span>
        </div>
      </motion.footer>
    </div>
  );
}
