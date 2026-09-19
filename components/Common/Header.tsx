"use client";

import React from "react";
import { useRisk } from "@/context/RiskContext";
import { PredictIcon, AlertIcon, RespondIcon } from "./Icons";
import { UI_STRINGS } from "@/lib/translations";
import { Flame, Sliders, Radio, Smartphone, Activity, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import LiveLocationSearch from "@/components/Search/LiveLocationSearch";
import { SupportedLanguage } from "@/lib/types";

interface HeaderProps {
  onToggleWhatIf?: () => void;
  isWhatIfOpen?: boolean;
}

export default function Header({ onToggleWhatIf, isWhatIfOpen }: HeaderProps) {
  const {
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    districtStats,
    showHotspotsLayer,
    toggleHotspotsLayer,
    whatIf,
    selectedDistrict,
    setSelectedDistrict,
    availableDistricts,
    currentDistrictInfo,
  } = useRisk();

  const t = UI_STRINGS[language];
  const isSimulationActive = whatIf.tempDelta !== 0 || whatIf.precipDelta !== 0;

  return (
    <header className="w-full bg-navy text-white border-b border-navy-light/60 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-md z-30 relative">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-md bg-navy-card border border-pink/40 flex items-center justify-center p-1.5 shadow-sm group-hover:border-pink transition-colors">
            <PredictIcon size={22} color="#EC1E63" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg tracking-tight text-white group-hover:text-pink-light transition-colors">
                SANJEEVANI
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-pink/20 text-pink border border-pink/30 px-1.5 py-0.5 rounded">
                v1.0 Demo
              </span>
            </div>
            <p className="text-[11px] text-gray-400 tracking-wide hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Pan-India District Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-navy-card border border-pink/40 hover:border-pink px-2.5 py-1 rounded-md transition-all shadow-sm">
          <MapPin size={14} className="text-pink flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-pink tracking-wider leading-tight">
              Select District (India)
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs border-none focus:outline-none cursor-pointer py-0.5"
              aria-label="Select District across India"
            >
              {availableDistricts.map((d) => (
                <option key={d.id} value={d.id} className="bg-navy text-white py-1">
                  {d.name}, {d.state} ({d.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Pan-India Location Search Bar (Approach A) */}
        <div className="flex items-center">
          <LiveLocationSearch />
        </div>

        {/* Hazard Focus Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-card/80 border border-gray-700/80 text-[11px] text-gray-300">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentDistrictInfo.color_accent || "#EC1E63" }}></span>
          <span className="text-gray-400">Hazard Focus:</span>
          <span className="font-medium text-white">{currentDistrictInfo.recommended_focus}</span>
        </div>

        {/* Live Data Telemetry Indicator */}
        <div className="hidden lg:flex items-center gap-2 ml-2 pl-3 border-l border-navy-light/80 text-xs text-gray-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">
            {districtStats.data_source_live ? t.liveDataBadge : t.fallbackBadge}
          </span>
        </div>
      </div>

      {/* Controls & Quick Toggles */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* What-If Scenario Button */}
        {onToggleWhatIf && (
          <button
            onClick={onToggleWhatIf}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-btn border transition-all ${
              isSimulationActive
                ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                : isWhatIfOpen
                ? "bg-navy-light border-pink text-pink"
                : "bg-navy-card border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
            title="Adjust temperature and rainfall scenarios live"
          >
            <Sliders size={14} className={isSimulationActive ? "text-amber-400" : "text-pink"} />
            <span>Scenario Slider</span>
            {isSimulationActive && (
              <span className="bg-amber-500 text-navy font-bold text-[9px] px-1 rounded">
                ACTIVE
              </span>
            )}
          </button>
        )}

        {/* NASA FIRMS Hotspots Layer Toggle */}
        <button
          onClick={toggleHotspotsLayer}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-btn border transition-all ${
            showHotspotsLayer
              ? "bg-red-500/15 border-red-500/50 text-red-300"
              : "bg-navy-card border-gray-700 text-gray-400 hover:text-gray-200"
          }`}
          title="Toggle NASA FIRMS satellite fire hotspots layer"
        >
          <Flame size={13} className={showHotspotsLayer ? "text-red-400 fill-red-400/40" : "text-gray-500"} />
          <span className="hidden sm:inline">NASA Thermal</span>
        </button>

        {/* Supervisor vs Resident View Toggle */}
        <div className="bg-navy-card border border-gray-700/80 p-0.5 rounded-btn flex items-center text-xs">
          <button
            onClick={() => setActiveRole("supervisor")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm transition-all font-medium ${
              activeRole === "supervisor"
                ? "bg-pink text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Activity size={13} />
            <span>{t.supervisorView}</span>
          </button>
          <button
            onClick={() => setActiveRole("resident")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm transition-all font-medium ${
              activeRole === "resident"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Smartphone size={13} />
            <span>{t.residentView}</span>
          </button>
        </div>

        {/* Multilingual Switcher (8 Indian Languages) */}
        <div className="bg-navy-card border border-gray-700/80 px-2 py-1 rounded-btn flex items-center gap-1.5 text-[11px] font-semibold hover:border-pink/50 transition-colors">
          <Globe size={13} className="text-pink flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="bg-transparent text-white font-semibold text-xs border-none focus:outline-none cursor-pointer py-0.5"
            aria-label="Select Language"
          >
            <option value="en" className="bg-navy text-white">English (EN)</option>
            <option value="hi" className="bg-navy text-white">हिन्दी (Hindi)</option>
            <option value="mr" className="bg-navy text-white">मराठी (Marathi)</option>
            <option value="te" className="bg-navy text-white">తెలుగు (Telugu)</option>
            <option value="ta" className="bg-navy text-white">தமிழ் (Tamil)</option>
            <option value="bn" className="bg-navy text-white">বাংলা (Bengali)</option>
            <option value="gu" className="bg-navy text-white">ગુજરાતી (Gujarati)</option>
            <option value="kn" className="bg-navy text-white">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>
      </div>
    </header>
  );
}
