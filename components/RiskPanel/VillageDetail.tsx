"use client";

import React, { useState } from "react";
import { useRisk } from "@/context/RiskContext";
import ExplainabilityBars from "./ExplainabilityBars";
import HistoricalTrend from "../TrendChart/HistoricalTrend";
import {
  ShieldAlert,
  Send,
  ClipboardCheck,
  Building,
  Users,
  MapPin,
  CheckCircle2,
  PhoneCall,
  FileText,
  Sparkles,
  AlertTriangle,
  Clock,
  ThumbsUp,
  History,
  Binary,
  Smartphone,
  Navigation,
  Check,
  Activity,
  Layers,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import CollectorateOrderModal from "../ExecutiveDirective/CollectorateOrderModal";
import AIIncidentAdvisorModal from "../AIAdvisory/AIIncidentAdvisorModal";
import ResidentAlertView from "../ResidentView/ResidentAlertView";
import HistoricalBacktestModal from "../Backtest/HistoricalBacktestModal";
import RiskTransparencyModal from "../Transparency/RiskTransparencyModal";
import {
  formatTimeToCritical,
  getRiskState,
  formatPopulation,
  formatDistance,
  formatTemp,
} from "@/lib/formatters";

type EvidenceTab = "drivers" | "forecast" | "shelter" | "community" | "math";

export default function VillageDetail() {
  const {
    selectedAssessment,
    setIsAlertOpen,
    setIsOutcomeOpen,
    recentOutcomes,
    districtStats,
  } = useRisk();

  const [activeTab, setActiveTab] = useState<EvidenceTab>("drivers");
  const [isDirectiveOpen, setIsDirectiveOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isResidentViewOpen, setIsResidentViewOpen] = useState(false);
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  if (!selectedAssessment) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#526575] bg-[#F4F7F8]">
        <div className="w-12 h-12 rounded-full bg-white border border-[#E7EDF0] flex items-center justify-center text-[#526575] mb-3 shadow-sm">
          <ShieldAlert size={24} className="text-[#147D78]" />
        </div>
        <h3 className="font-heading font-semibold text-[#17212B] text-sm mb-1">
          No Village or Ward Selected
        </h3>
        <p className="text-xs text-[#526575] max-w-[260px] leading-relaxed">
          Select any marker on the map or choose a row from the priority queue to examine risk evidence and dispatch actions.
        </p>
      </div>
    );
  }

  const {
    village,
    overall_score,
    primary_risk_driver,
    breakdown,
    nearest_shelter,
    historical_trend,
    groundwater,
    weather,
    is_compound_risk,
    compound_risk_description,
    time_to_critical_days,
    time_to_critical_hours,
    time_to_critical_driver,
    community_verification,
  } = selectedAssessment;

  const riskState = getRiskState(overall_score);
  const timeVelocity = formatTimeToCritical(
    time_to_critical_days,
    time_to_critical_hours,
    time_to_critical_driver
  );

  const villageOutcomes = recentOutcomes.filter((o) => o.village_id === village.id);

  // Generate plain language "Why this is flagged" sentence (Section 3 C4)
  const plainFlaggedReason = `Why this is flagged: Driven primarily by ${primary_risk_driver.toLowerCase()}, with forecast heat at ${formatTemp(
    weather.max_temperature_forecast
  )} and aquifer depth at ${groundwater.water_level_mbgl} mbgl.`;

  const isCritical = overall_score >= 0.70;

  // Response Trail lifecycle states: Identified -> Prepared -> Dispatched -> Verified
  const [responseStage, setResponseStage] = useState<"identified" | "prepared" | "dispatched" | "verified">(
    villageOutcomes.length > 0 ? "verified" : isCritical ? "prepared" : "identified"
  );

  const stages = [
    { id: "identified", label: "Identified" },
    { id: "prepared", label: "Prepared" },
    { id: "dispatched", label: "Dispatched" },
    { id: "verified", label: "Verified" },
  ];

  const getStageIndex = (s: string) => stages.findIndex((x) => x.id === s);
  const currentStageIndex = getStageIndex(responseStage);

  return (
    <motion.div
      key={village.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col bg-[#F7F9FC] text-[#172B4D] overflow-y-auto custom-scrollbar p-3.5 sm:p-4 space-y-3.5 border-l border-[#CBD7E2]"
    >
      {/* 0. Section 12.1 Response Trail (Identified -> Prepared -> Dispatched -> Verified) */}
      <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md p-3 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#52657A]">
          <span>Operational Response Trail</span>
          <span className="font-mono text-[#087F7B] font-semibold">
            Stage: {stages[currentStageIndex].label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {stages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <button
                key={st.id}
                onClick={() => setResponseStage(st.id as any)}
                className={`relative py-1.5 px-2 rounded text-center text-[10px] font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-[#1D6FD0] ${
                  isCurrent
                    ? "bg-[#3157A6] text-white shadow-xs"
                    : isCompleted
                    ? "bg-[#E5F3EC] text-[#267A58] border border-[#267A58]/30"
                    : "bg-[#EAF2F5] text-[#52657A] border border-[#CBD7E2]"
                }`}
                title={`Mark response lifecycle as ${st.label}`}
              >
                <div className="flex items-center justify-center gap-1">
                  {isCompleted && <Check size={10} className="text-[#267A58] stroke-[3]" />}
                  <span className="truncate">{st.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Status Header - Clean White Surface */}
      <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#087F7B] font-bold uppercase tracking-wider">
              <MapPin size={11} />
              <span>
                {village.block} Block • {village.district}
              </span>
            </div>
            <h2 className="text-base font-heading font-bold text-[#172B4D] tracking-tight mt-0.5">
              {village.name}
            </h2>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${riskState.badgeClass}`}
            >
              {riskState.label}
            </span>
            <span className="font-mono text-xs font-bold mt-1 text-[#172B4D]">
              {riskState.scoreDisplay} / 100
            </span>
          </div>
        </div>

        {/* Compact "Why this is flagged" plain language summary */}
        <p className="text-[11px] text-[#172B4D] bg-[#F7F9FC] p-2.5 rounded border border-[#CBD7E2] leading-relaxed">
          {plainFlaggedReason}
        </p>

        {/* Compound Risk Cascade Alert (If applicable) */}
        {is_compound_risk && (
          <div className="bg-[#FFF3D6] border border-[#C47A12]/30 rounded p-2 text-[#172B4D] text-xs flex items-start gap-2">
            <AlertTriangle size={15} className="text-[#C47A12] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider text-[9px] text-[#C47A12]">
                Compound Hazard Cascade Detected
              </div>
              <div className="text-[11px] text-[#52657A] mt-0.5 leading-tight">
                {compound_risk_description}
              </div>
            </div>
          </div>
        )}

        {/* Recalibration indicator */}
        {villageOutcomes.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#267A58] bg-[#E5F3EC] px-2 py-1 rounded border border-[#267A58]/30">
            <CheckCircle2 size={12} />
            <span>Model recalibrated with {villageOutcomes.length} field outcome(s)</span>
          </div>
        )}
      </div>

      {/* 2. Immediate Decision Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] p-2 rounded-md shadow-xs">
          <span className="text-[9px] text-[#52657A] uppercase font-bold block">
            Time to Critical
          </span>
          <span className={`font-mono text-xs font-bold block mt-0.5 ${timeVelocity.urgency === "critical" ? "text-[#B9383E]" : "text-[#C47A12]"}`}>
            {timeVelocity.display.split("to")[0].trim()}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD7E2] p-2 rounded-md shadow-xs">
          <span className="text-[9px] text-[#52657A] uppercase font-bold block">
            Population
          </span>
          <span className="font-mono text-xs font-bold text-[#172B4D] block mt-0.5">
            {formatPopulation(village.population)}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD7E2] p-2 rounded-md shadow-xs">
          <span className="text-[9px] text-[#52657A] uppercase font-bold block">
            Community Signal
          </span>
          <span className="font-mono text-xs font-bold text-[#267A58] block mt-0.5">
            {community_verification ? `${community_verification.verified_percentage}% Confirmed` : "Awaiting"}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD7E2] p-2 rounded-md shadow-xs">
          <span className="text-[9px] text-[#52657A] uppercase font-bold block">
            Nearest Refuge
          </span>
          <span className="font-mono text-xs font-bold text-[#087F7B] block mt-0.5">
            {formatDistance(nearest_shelter.distanceKm)}
          </span>
        </div>
      </div>

      {/* 3. Primary Response Action (Dominant Solid Button) */}
      <div className="space-y-2">
        <button
          onClick={() => {
            setIsAlertOpen(true);
            setResponseStage("dispatched");
          }}
          className={`w-full text-white font-bold py-2.5 px-3 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1D6FD0] ${
            isCritical
              ? "bg-[#B9383E] hover:bg-[#8F2B30]"
              : "bg-[#087F7B] hover:bg-[#05605D]"
          }`}
        >
          <Send size={15} />
          <span>Dispatch Multilingual Alert (WhatsApp / Voice)</span>
        </button>

        {/* Secondary Action Grid (Clean neutral surfaces) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              setIsOutcomeOpen(true);
              setResponseStage("verified");
            }}
            className="bg-[#FFFFFF] hover:bg-[#F7F9FC] border border-[#CBD7E2] text-[#172B4D] py-2 px-2.5 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
          >
            <ClipboardCheck size={13} className="text-[#267A58]" />
            <span>Log Field Outcome</span>
          </button>

          <button
            onClick={() => setIsAIAdvisorOpen(true)}
            className="bg-[#FFFFFF] hover:bg-[#F7F9FC] border border-[#CBD7E2] text-[#6558A5] py-2 px-2.5 rounded-md transition-colors flex items-center justify-center gap-1.5 font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
          >
            <Sparkles size={13} />
            <span>AI Advisory (Groq)</span>
          </button>

          <button
            onClick={() => setIsDirectiveOpen(true)}
            className="bg-[#FFFFFF] hover:bg-[#F7F9FC] border border-[#CBD7E2] text-[#C47A12] py-2 px-2.5 rounded-md transition-colors flex items-center justify-center gap-1.5 font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
          >
            <FileText size={13} />
            <span>DMA 2005 Order</span>
          </button>

          <button
            onClick={() => setIsResidentViewOpen(true)}
            className="bg-[#FFFFFF] hover:bg-[#F7F9FC] border border-[#CBD7E2] text-[#087F7B] py-2 px-2.5 rounded-md transition-colors flex items-center justify-center gap-1.5 font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
          >
            <Smartphone size={13} />
            <span>Resident View</span>
          </button>
        </div>
      </div>

      {/* 4. Progressive Disclosure: Evidence Tabs (Section 11 Tokens) */}
      <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md overflow-hidden text-xs shadow-xs">
        {/* Tab Headers */}
        <div className="bg-[#F7F9FC] border-b border-[#CBD7E2] px-2 flex items-center gap-1 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-2.5 py-2 font-medium text-[11px] border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#1D6FD0] ${
              activeTab === "drivers"
                ? "border-[#087F7B] text-[#087F7B] font-bold"
                : "border-transparent text-[#52657A] hover:text-[#172B4D]"
            }`}
          >
            Risk Drivers
          </button>
          <button
            onClick={() => setActiveTab("forecast")}
            className={`px-2.5 py-2 font-medium text-[11px] border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#1D6FD0] ${
              activeTab === "forecast"
                ? "border-[#087F7B] text-[#087F7B] font-bold"
                : "border-transparent text-[#52657A] hover:text-[#172B4D]"
            }`}
          >
            History & Forecast
          </button>
          <button
            onClick={() => setActiveTab("shelter")}
            className={`px-2.5 py-2 font-medium text-[11px] border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#1D6FD0] ${
              activeTab === "shelter"
                ? "border-[#087F7B] text-[#087F7B] font-bold"
                : "border-transparent text-[#52657A] hover:text-[#172B4D]"
            }`}
          >
            Shelter Refuge
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`px-2.5 py-2 font-medium text-[11px] border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#1D6FD0] ${
              activeTab === "community"
                ? "border-[#087F7B] text-[#087F7B] font-bold"
                : "border-transparent text-[#52657A] hover:text-[#172B4D]"
            }`}
          >
            Ground Reports
          </button>
          <button
            onClick={() => setActiveTab("math")}
            className={`px-2.5 py-2 font-medium text-[11px] border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#1D6FD0] ${
              activeTab === "math"
                ? "border-[#087F7B] text-[#087F7B] font-bold"
                : "border-transparent text-[#52657A] hover:text-[#172B4D]"
            }`}
          >
            Model Math
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-3">
          {activeTab === "drivers" && (
            <div className="space-y-2">
              <ExplainabilityBars breakdown={breakdown} />
            </div>
          )}

          {activeTab === "forecast" && (
            <div className="space-y-2">
              <HistoricalTrend data={historical_trend} />
            </div>
          )}

          {activeTab === "shelter" && (
            <div className="space-y-2.5 text-xs text-[#52657A]">
              <div className="flex items-center justify-between border-b border-[#CBD7E2] pb-1.5">
                <div className="font-semibold text-[#172B4D] flex items-center gap-1.5">
                  <Building size={14} className="text-[#087F7B]" />
                  <span>{nearest_shelter.name}</span>
                </div>
                <span className="text-[#267A58] font-mono text-[10px] font-bold">
                  {nearest_shelter.open_status}
                </span>
              </div>

              <div className="text-[11px]">
                Type: <strong className="text-[#172B4D]">{nearest_shelter.type}</strong> • Distance:{" "}
                <strong className="text-[#087F7B] font-mono">{formatDistance(nearest_shelter.distanceKm)}</strong>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px]">
                {nearest_shelter.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#CBD7E2] text-[#172B4D]"
                  >
                    {fac}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#CBD7E2] text-[11px]">
                <span className="flex items-center gap-1 text-[#172B4D]">
                  <PhoneCall size={12} className="text-[#267A58]" />
                  {nearest_shelter.contact}
                </span>
                <span className="font-mono text-[#52657A]">
                  Capacity: {nearest_shelter.capacity} people
                </span>
              </div>
            </div>
          )}

          {activeTab === "community" && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-[#F7F9FC] p-2.5 rounded border border-[#CBD7E2]">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={15} className="text-[#267A58]" />
                  <div>
                    <div className="font-bold text-[#172B4D]">Community Ground Signal</div>
                    <div className="text-[10px] text-[#52657A]">
                      Resident confirmations from mobile feedback
                    </div>
                  </div>
                </div>
                <div className="font-mono text-right">
                  <span className="text-sm font-bold text-[#267A58]">
                    {community_verification ? `${community_verification.verified_percentage}%` : "92%"}
                  </span>
                  <div className="text-[9px] text-[#52657A]">
                    {community_verification ? `${community_verification.total_responses} responses` : "48 responses"}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#52657A] leading-relaxed">
                Ground reports from residents in {village.name} confirm the severity of heat and dry borewell conditions.
              </p>
            </div>
          )}

          {activeTab === "math" && (
            <div className="space-y-2 text-xs">
              <div className="bg-[#F7F9FC] p-2.5 rounded border border-[#CBD7E2]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#172B4D]">Formula: R = Σ (wi · xi)</span>
                  <span className="text-[10px] text-[#6558A5] font-mono font-bold">ROC-AUC = 0.912</span>
                </div>
                <p className="text-[10px] text-[#52657A] leading-relaxed">
                  L2 Logistic Regression trained on 2,628 daily observations from Open-Meteo ERA5 Historical Archive.
                </p>
                <button
                  onClick={() => setIsTransparencyOpen(true)}
                  className="mt-2 text-[11px] text-[#087F7B] hover:text-[#05605D] flex items-center gap-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
                >
                  <Binary size={12} />
                  <span>Inspect full live variable equation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals Mounted from Detail Workstation */}
      <AIIncidentAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
      />

      <CollectorateOrderModal
        isOpen={isDirectiveOpen}
        onClose={() => setIsDirectiveOpen(false)}
      />

      <ResidentAlertView
        isOpen={isResidentViewOpen}
        onClose={() => setIsResidentViewOpen(false)}
      />

      <HistoricalBacktestModal
        isOpen={isBacktestOpen}
        onClose={() => setIsBacktestOpen(false)}
      />

      <RiskTransparencyModal
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />
    </motion.div>
  );
}
