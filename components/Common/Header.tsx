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

export type OfficerTab = "overview" | "map" | "priority" | "actions";

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
    <header className="w-full bg-[#203447] border-b border-[#2D465A] text-[#F4F7F8] z-30 relative shadow-sm">
      {/* Row 1: Global Identity, District Telemetry, Search & Primary Actions */}
      <div className="px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + District Selector */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-8 h-8 rounded bg-[#17212B] border border-[#2D465A] flex items-center justify-center p-1.5 shadow-sm group-hover:border-[#147D78] transition-colors">
              <PredictIcon size={20} color="#147D78" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base tracking-tight text-white group-hover:text-[#147D78] transition-colors">
                  SANJEEVANI
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#2D465A] text-[#D5DFE5] border border-[#526575] px-1.5 py-0.5 rounded">
                  Officer Command
                </span>
              </div>
              <p className="text-[10px] text-[#A9B7C6] tracking-normal hidden sm:block">
                District Disaster Management Authority · {currentDistrictInfo.name}
              </p>
            </div>
          </Link>

          {/* District Context Selector */}
          <div className="flex items-center gap-2 bg-[#17212B] border border-[#2D465A] hover:border-[#147D78] px-3 py-1 rounded-md transition-all">
            <MapPin size={13} className="text-[#147D78] flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#7D8C98] tracking-wider leading-none">
                District Jurisdiction
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs border-none focus:outline-none cursor-pointer py-0.5"
                aria-label="Select District"
              >
                {availableDistricts.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#203447] text-white">
                    {d.name}, {d.state} ({d.region})
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-[#2D465A] text-[10px] text-[#2E8B68]">
              <span className="w-2 h-2 rounded-full bg-[#2E8B68]"></span>
              <span className="font-mono">Live Telemetry</span>
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
            className="flex items-center gap-1.5 bg-[#2D465A] hover:bg-[#3B536B] text-white border border-[#526575] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-all"
            title="Export DDMA Executive Morning Situation Report (Print / PDF)"
          >
            <FileText size={13} className="text-[#147D78]" />
            <span className="hidden sm:inline">Morning SITREP</span>
            <span className="bg-[#EAF5F0] text-[#2E8B68] border border-[#BCE1D1] text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              Ready
            </span>
          </button>

          {/* Direct Link to Resident Safety Dashboard */}
          <Link
            href="/resident"
            className="flex items-center gap-1.5 bg-[#147D78] hover:bg-[#0E625E] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition-all shadow-sm"
            title="Switch to dedicated low-literacy Resident Safety Dashboard"
          >
            <Smartphone size={13} />
            <span>Resident View</span>
          </Link>

          {/* Multilingual Selector */}
          <div className="bg-[#17212B] border border-[#2D465A] px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs text-[#A9B7C6]">
            <Globe size={13} className="text-[#147D78] flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium text-xs border-none focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en" className="bg-[#203447] text-white">EN</option>
              <option value="hi" className="bg-[#203447] text-white">हिन्दी</option>
              <option value="mr" className="bg-[#203447] text-white">मराठी</option>
              <option value="te" className="bg-[#203447] text-white">తెలుగు</option>
              <option value="ta" className="bg-[#203447] text-white">தமிழ்</option>
              <option value="bn" className="bg-[#203447] text-white">বাংলা</option>
              <option value="gu" className="bg-[#203447] text-white">ગુજરાતી</option>
              <option value="kn" className="bg-[#203447] text-white">ಕನ್ನಡ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Operational Navigation Tabs & Analysis Tools Menu */}
      <div className="px-4 sm:px-6 bg-[#17212B] border-t border-[#2D465A] flex items-center justify-between overflow-x-auto custom-scrollbar-dark">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 py-1" aria-label="Officer Workspace Tabs">
          <button
            onClick={() => onTabChange?.("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "overview"
                ? "bg-[#203447] text-white font-semibold border-b-2 border-b-[#147D78]"
                : "text-[#7D8C98] hover:text-white hover:bg-[#203447]/60"
            }`}
          >
            <LayoutDashboard size={13} className={activeTab === "overview" ? "text-[#147D78]" : "text-[#7D8C98]"} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onTabChange?.("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "map"
                ? "bg-[#203447] text-white font-semibold border-b-2 border-b-[#147D78]"
                : "text-[#7D8C98] hover:text-white hover:bg-[#203447]/60"
            }`}
          >
            <MapIcon size={13} className={activeTab === "map" ? "text-[#147D78]" : "text-[#7D8C98]"} />
            <span>Risk Map</span>
          </button>

          <button
            onClick={() => onTabChange?.("priority")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "priority"
                ? "bg-[#203447] text-white font-semibold border-b-2 border-b-[#C43D3D]"
                : "text-[#7D8C98] hover:text-white hover:bg-[#203447]/60"
            }`}
          >
            <ListOrdered size={13} className={activeTab === "priority" ? "text-[#C43D3D]" : "text-[#7D8C98]"} />
            <span>Priority Zones</span>
            {districtStats.high_risk_count > 0 && (
              <span className="bg-[#C43D3D] text-white text-[9px] font-bold px-1.5 rounded-full">
                {districtStats.high_risk_count}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange?.("actions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "actions"
                ? "bg-[#203447] text-white font-semibold border-b-2 border-b-[#2E8B68]"
                : "text-[#7D8C98] hover:text-white hover:bg-[#203447]/60"
            }`}
          >
            <Truck size={13} className={activeTab === "actions" ? "text-[#2E8B68]" : "text-[#7D8C98]"} />
            <span>Response Fleet</span>
          </button>
        </nav>

        {/* Secondary Analysis Tools Dropdown */}
        <div className="relative py-1">
          <button
            onClick={() => setIsToolsDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              isSimulationRunning
                ? "bg-[#FBF3E8] border-[#B7791F] text-[#B7791F]"
                : isToolsDropdownOpen
                ? "bg-[#203447] border-[#2D465A] text-white"
                : "bg-transparent border-transparent text-[#7D8C98] hover:text-white hover:bg-[#203447]/60"
            }`}
            title="Open simulation, backtest, and model transparency tools"
          >
            <Sliders size={13} className={isSimulationRunning ? "text-[#B7791F]" : "text-[#7D8C98]"} />
            <span>Analysis Tools</span>
            {isSimulationRunning && (
              <span className="bg-[#B7791F] text-white font-bold text-[9px] px-1 rounded">
                ACTIVE
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform ${isToolsDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Tools Menu Popover */}
          {isToolsDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#203447] border border-[#2D465A] rounded-md shadow-xl py-1 z-50 text-xs text-[#F4F7F8]">
              <div className="px-3 py-1.5 border-b border-[#2D465A] text-[10px] uppercase font-bold text-[#7D8C98] tracking-wider">
                Operational Intelligence Suite
              </div>

              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  onOpenWhatIf?.();
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#2D465A] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-[#B7791F]" />
                  <div>
                    <div className="font-semibold text-white">Scenario Simulator (What-If)</div>
                    <div className="text-[10px] text-[#7D8C98]">Adjust temperature & rain deltas</div>
                  </div>
                </div>
                {isSimulationRunning && (
                  <span className="text-[9px] bg-[#FBF3E8] text-[#B7791F] px-1.5 py-0.5 rounded font-mono font-bold">
                    ON
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  setIsBacktestOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#2D465A] flex items-center gap-2 transition-colors"
              >
                <History size={14} className="text-[#2F6F9F]" />
                <div>
                  <div className="font-semibold text-white">Disaster Backtest (ERA5)</div>
                  <div className="text-[10px] text-[#7D8C98]">Verify 48-72h lead time on past records</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  setIsTransparencyOpen(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#2D465A] flex items-center gap-2 transition-colors"
              >
                <Binary size={14} className="text-[#635B8F]" />
                <div>
                  <div className="font-semibold text-white">Risk Math & XAI Model</div>
                  <div className="text-[10px] text-[#7D8C98]">Inspect weights & mathematical formula</div>
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
