"use client";

import React, { useState } from "react";
import { useRisk } from "@/context/RiskContext";
import { PredictIcon } from "./Icons";
import { UI_STRINGS } from "@/lib/translations";
import {
  MapPin,
  Globe,
  FileText,
  Smartphone,
  Sliders,
  History,
  Binary,
  Layers,
  ChevronDown,
  Activity,
  AlertTriangle,
  Flame,
  LayoutDashboard,
  Map as MapIcon,
  ListOrdered,
  Truck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import LiveLocationSearch from "@/components/Search/LiveLocationSearch";
import { SupportedLanguage } from "@/lib/types";
import DistrictBriefingExport from "@/components/ExecutiveDirective/DistrictBriefingExport";
import HistoricalBacktestModal from "@/components/Backtest/HistoricalBacktestModal";
import RiskTransparencyModal from "@/components/Transparency/RiskTransparencyModal";

export type OfficerTab = "overview" | "map" | "priority" | "actions" | "reports";

interface HeaderProps {
  activeTab?: OfficerTab;
  onTabChange?: (tab: OfficerTab) => void;
  onOpenWhatIf?: () => void;
  isWhatIfActive?: boolean;
}

export default function Header({
  activeTab = "overview",
  onTabChange,
  onOpenWhatIf,
  isWhatIfActive = false,
}: HeaderProps) {
  const {
    language,
    setLanguage,
    districtStats,
    whatIf,
    selectedDistrict,
    setSelectedDistrict,
    availableDistricts,
    currentDistrictInfo,
  } = useRisk();

  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  const t = UI_STRINGS[language];
  const isSimulationRunning = isWhatIfActive || whatIf.tempDelta !== 0 || whatIf.precipDelta !== 0;

  return (
    <header className="w-full bg-[#3157A6] border-b border-[#24417D] text-[#FFFFFF] z-30 relative shadow-sm">
      {/* Row 1: Global Identity, District Telemetry, Search & Primary Actions */}
      <div className="px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + District Selector */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-8 h-8 rounded bg-[#24417D] border border-[#4469B5] flex items-center justify-center p-1.5 shadow-sm group-hover:border-[#087F7B] transition-colors">
              <PredictIcon size={20} color="#087F7B" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base tracking-tight text-white group-hover:text-[#EAF2F5] transition-colors">
                  SANJEEVANI
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#24417D] text-[#EAF2F5] border border-[#4469B5] px-1.5 py-0.5 rounded">
                  Officer Command
                </span>
              </div>
              <p className="text-[10px] text-[#DCE6F2] tracking-normal hidden sm:block">
                District Disaster Management Authority · {currentDistrictInfo.name}
              </p>
            </div>
          </Link>

          {/* District Context Selector with District Pulse */}
          <div className="flex items-center gap-2 bg-[#24417D] border border-[#4469B5] hover:border-[#087F7B] px-3 py-1 rounded-md transition-all">
            <MapPin size={13} className="text-[#087F7B] flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#CBD7E2] tracking-wider leading-none">
                District Jurisdiction
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs border-none focus:outline-none cursor-pointer py-0.5"
                aria-label="Select District"
              >
                {availableDistricts.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#24417D] text-white">
                    {d.name}, {d.state} ({d.region})
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-[#4469B5] text-[10px] text-[#E5F3EC]">
              <span className="w-2 h-2 rounded-full bg-[#267A58] animate-pulse"></span>
              <span className="font-mono text-[#DCE6F2]">Refreshed live from Open-Meteo &amp; CGWB · 2 min ago</span>
            </div>
          </div>

          {/* Global Location Search */}
          <div className="hidden md:flex items-center">
            <LiveLocationSearch />
          </div>
        </div>

        {/* Right: Morning SITREP + Resident View Link + Language */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Morning SITREP Export CTA (Principal Export Action) */}
          <button
            onClick={() => setIsBriefingOpen(true)}
            className="flex items-center gap-1.5 bg-[#24417D] hover:bg-[#1E3666] text-white border border-[#4469B5] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
            title="Export DDMA Executive Morning Situation Report (Print / PDF)"
          >
            <FileText size={13} className="text-[#087F7B]" />
            <span className="hidden sm:inline">Morning SITREP</span>
            <span className="bg-[#FFF3D6] text-[#C47A12] border border-[#C47A12]/40 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              Ready
            </span>
          </button>

          {/* Direct Link to Resident Safety Dashboard */}
          <Link
            href="/resident"
            className="flex items-center gap-1.5 bg-[#087F7B] hover:bg-[#05605D] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
            title="Switch to dedicated low-literacy Resident Safety Dashboard"
          >
            <Smartphone size={13} />
            <span>Resident View</span>
          </Link>

          {/* Multilingual Selector */}
          <div className="bg-[#24417D] border border-[#4469B5] px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs text-[#EAF2F5]">
            <Globe size={13} className="text-[#087F7B] flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium text-xs border-none focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en" className="bg-[#24417D] text-white">EN</option>
              <option value="hi" className="bg-[#24417D] text-white">हिन्दी</option>
              <option value="mr" className="bg-[#24417D] text-white">मराठी</option>
              <option value="te" className="bg-[#24417D] text-white">తెలుగు</option>
              <option value="ta" className="bg-[#24417D] text-white">தமிழ்</option>
              <option value="bn" className="bg-[#24417D] text-white">বাংলা</option>
              <option value="gu" className="bg-[#24417D] text-white">ગુજરાતી</option>
              <option value="kn" className="bg-[#24417D] text-white">ಕನ್ನಡ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Operational Navigation Tabs & Analysis Tools Menu */}
      <div className="px-4 sm:px-6 bg-[#24417D] border-t border-[#3B5D9E] flex items-center justify-between overflow-x-auto custom-scrollbar-dark">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 py-1" aria-label="Officer Workspace Tabs">
          <button
            onClick={() => onTabChange?.("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "overview"
                ? "bg-[#3157A6] text-white font-semibold border-b-2 border-b-[#087F7B]"
                : "text-[#DCE6F2] hover:text-white hover:bg-[#3157A6]/60"
            }`}
          >
            <LayoutDashboard size={13} className={activeTab === "overview" ? "text-[#087F7B]" : "text-[#CBD7E2]"} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onTabChange?.("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "map"
                ? "bg-[#3157A6] text-white font-semibold border-b-2 border-b-[#087F7B]"
                : "text-[#DCE6F2] hover:text-white hover:bg-[#3157A6]/60"
            }`}
          >
            <MapIcon size={13} className={activeTab === "map" ? "text-[#087F7B]" : "text-[#CBD7E2]"} />
            <span>Risk Map</span>
          </button>

          <button
            onClick={() => onTabChange?.("priority")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "priority"
                ? "bg-[#3157A6] text-white font-semibold border-b-2 border-b-[#B9383E]"
                : "text-[#DCE6F2] hover:text-white hover:bg-[#3157A6]/60"
            }`}
          >
            <ListOrdered size={13} className={activeTab === "priority" ? "text-[#B9383E]" : "text-[#CBD7E2]"} />
            <span>Priority Zones</span>
            {districtStats.high_risk_count > 0 && (
              <span className="bg-[#B9383E] text-white text-[9px] font-bold px-1.5 rounded-full">
                {districtStats.high_risk_count}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange?.("actions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "actions"
                ? "bg-[#3157A6] text-white font-semibold border-b-2 border-b-[#267A58]"
                : "text-[#DCE6F2] hover:text-white hover:bg-[#3157A6]/60"
            }`}
          >
            <Truck size={13} className={activeTab === "actions" ? "text-[#267A58]" : "text-[#CBD7E2]"} />
            <span>Response Fleet</span>
          </button>

          <button
            onClick={() => onTabChange?.("reports")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "reports"
                ? "bg-[#3157A6] text-white font-semibold border-b-2 border-b-[#087F7B]"
                : "text-[#DCE6F2] hover:text-white hover:bg-[#3157A6]/60"
            }`}
          >
            <FileText size={13} className={activeTab === "reports" ? "text-[#087F7B]" : "text-[#CBD7E2]"} />
            <span>Reports</span>
          </button>
        </nav>

        {/* Secondary Analysis Tools Dropdown */}
        <div className="relative py-1">
          <button
            onClick={() => setIsToolsDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              isSimulationRunning
                ? "bg-[#FFF3D6] border-[#C47A12] text-[#C47A12]"
                : isToolsDropdownOpen
                ? "bg-[#3157A6] border-[#4469B5] text-white"
                : "bg-transparent border-transparent text-[#DCE6F2] hover:text-white hover:bg-[#3157A6]/60"
            }`}
            title="Open simulation, backtest, and model transparency tools"
          >
            <Sliders size={13} className={isSimulationRunning ? "text-[#C47A12]" : "text-[#CBD7E2]"} />
            <span>Analysis Tools</span>
            {isSimulationRunning && (
              <span className="bg-[#C47A12] text-white font-bold text-[9px] px-1 rounded">
                ACTIVE
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform ${isToolsDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Tools Menu Popover */}
          {isToolsDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#24417D] border border-[#4469B5] rounded-md shadow-xl py-1 z-50 text-xs text-[#FFFFFF]">
              <div className="px-3 py-1.5 border-b border-[#4469B5] text-[10px] uppercase font-bold text-[#CBD7E2] tracking-wider">
                Operational Intelligence Suite
              </div>

              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  onOpenWhatIf?.();
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#3157A6] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-[#C47A12]" />
                  <div>
                    <div className="font-semibold text-white">Scenario Simulator (What-If)</div>
                    <div className="text-[10px] text-[#CBD7E2]">Adjust temperature & rain deltas</div>
                  </div>
                </div>
                {isSimulationRunning && (
                  <span className="text-[9px] bg-[#FFF3D6] text-[#C47A12] px-1.5 py-0.5 rounded font-mono font-bold">
                    ON
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  setIsBacktestOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#3157A6] flex items-center gap-2 transition-colors"
              >
                <History size={14} className="text-[#2B6EA6]" />
                <div>
                  <div className="font-semibold text-white">Disaster Backtest (ERA5)</div>
                  <div className="text-[10px] text-[#CBD7E2]">Verify 48-72h lead time on past records</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  setIsTransparencyOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#3157A6] flex items-center gap-2 transition-colors"
              >
                <Binary size={14} className="text-[#6558A5]" />
                <div>
                  <div className="font-semibold text-white">Risk Math & XAI Model</div>
                  <div className="text-[10px] text-[#CBD7E2]">Inspect weights & mathematical formula</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Global Modals Controlled from Header */}
      <DistrictBriefingExport
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />

      <HistoricalBacktestModal
        isOpen={isBacktestOpen}
        onClose={() => setIsBacktestOpen(false)}
      />

      <RiskTransparencyModal
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />
    </header>
  );
}
