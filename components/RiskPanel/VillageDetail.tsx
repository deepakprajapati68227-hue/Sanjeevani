"use client";

import React from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import CollectorateOrderModal from "../ExecutiveDirective/CollectorateOrderModal";

export default function VillageDetail() {
  const {
    selectedAssessment,
    setIsAlertOpen,
    setIsOutcomeOpen,
    language,
    recentOutcomes,
    districtStats,
  } = useRisk();

  const [isDirectiveOpen, setIsDirectiveOpen] = React.useState(false);

  if (!selectedAssessment) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 bg-navy">
        <ShieldAlert size={42} className="text-gray-600 mb-3" />
        <h3 className="font-heading font-semibold text-gray-300 text-sm mb-1">
          No Village Selected
        </h3>
        <p className="text-xs text-gray-500 max-w-[260px]">
          Click any village or ward marker on the {districtStats.district} district map to analyze explainable climate risk telemetry.
        </p>
      </div>
    );
  }

  const { village, overall_score, risk_level, primary_risk_driver, breakdown, nearest_shelter, historical_trend } =
    selectedAssessment;

  const villageOutcomes = recentOutcomes.filter(
    (o) => o.village_id === village.id
  );

  const getRiskBadgeStyles = (level: string) => {
    if (level === "High")
      return "bg-red-500/20 text-red-400 border border-red-500/40";
    if (level === "Moderate")
      return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
    return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
  };

  return (
    <motion.div
      key={village.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col bg-navy text-white overflow-y-auto custom-scrollbar p-4 space-y-4"
    >
      {/* Village Header Card */}
      <div className="bg-navy-card border border-gray-700/80 rounded-card p-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-pink font-semibold uppercase tracking-wider">
              <MapPin size={12} />
              <span>
                {village.block} Block • {village.district}
              </span>
            </div>
            <h2 className="text-lg font-heading font-bold text-white tracking-tight">
              {village.name}
            </h2>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getRiskBadgeStyles(
                risk_level
              )}`}
            >
              {risk_level} Risk
            </span>
            <span className="font-mono text-xs font-bold mt-1 text-gray-300">
              Score: {Math.round(overall_score * 100)} / 100
            </span>
          </div>
        </div>

        {/* Population & Exposure Description */}
        <div className="flex items-center gap-2 text-xs text-gray-300 bg-navy/60 px-2.5 py-1.5 rounded border border-gray-800 mb-2">
          <Users size={14} className="text-pink flex-shrink-0" />
          <span>
            Pop: <strong className="text-white">{village.population.toLocaleString()}</strong> • Hazard:{" "}
            <strong className="text-white">{village.primary_hazard}</strong>
          </span>
        </div>

        <p className="text-[11px] text-gray-400 leading-relaxed">
          {village.description}
        </p>

        {/* Feedback Recalibration Status Banner */}
        {villageOutcomes.length > 0 && (
          <div className="mt-2.5 flex items-center gap-2 bg-emerald-950/40 border border-emerald-700/50 px-2.5 py-1.5 rounded text-[11px] text-emerald-300">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Model Recalibrated:</strong> {villageOutcomes.length} field outcome(s) recorded in active session.
            </span>
          </div>
        )}
      </div>

      {/* Primary Action Buttons (P0 Core Demo Beats) */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsAlertOpen(true)}
            className="bg-pink hover:bg-pink-hover text-white text-xs font-semibold py-2.5 px-3 rounded-btn shadow-md transition-all flex items-center justify-center gap-1.5 group"
          >
            <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
            <span>Simulate WhatsApp Alert</span>
          </button>

          <button
            onClick={() => setIsOutcomeOpen(true)}
            className="bg-navy-card hover:bg-navy-light border border-gray-700 hover:border-gray-500 text-gray-200 text-xs font-semibold py-2.5 px-3 rounded-btn transition-colors flex items-center justify-center gap-1.5"
          >
            <ClipboardCheck size={14} className="text-emerald-400" />
            <span>Log Field Outcome</span>
          </button>
        </div>

        {/* Executive Collectorate Directive Generator (Actionable Governance Feature) */}
        <button
          onClick={() => setIsDirectiveOpen(true)}
          className="w-full bg-gradient-to-r from-amber-600/25 to-red-600/25 hover:from-amber-600/35 hover:to-red-600/35 border border-amber-500/50 text-amber-200 text-xs font-semibold py-2 px-3 rounded-btn transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <FileText size={14} className="text-amber-400" />
          <span>Official Collectorate Disaster Order (DMA 2005)</span>
        </button>
      </div>

      {/* Collectorate Executive Order Modal */}
      <CollectorateOrderModal
        isOpen={isDirectiveOpen}
        onClose={() => setIsDirectiveOpen(false)}
      />

      {/* Explainability Breakdown (Core Differentiator) */}
      <ExplainabilityBars breakdown={breakdown} />

      {/* Historical Trend Projection (P1) */}
      <HistoricalTrend data={historical_trend} />

      {/* Response Action & Nearest Shelter Card (P0) */}
      <div className="bg-navy-card/90 border border-gray-700/80 rounded-card p-3 text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-gray-700/60 pb-1">
          <div className="flex items-center gap-1.5 font-heading font-semibold text-gray-200 text-xs">
            <Building size={14} className="text-pink" />
            <span>Recommended Response Shelter</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
            {nearest_shelter.open_status}
          </span>
        </div>

        <div>
          <h4 className="font-bold text-gray-100 text-xs">
            {nearest_shelter.name}
          </h4>
          <p className="text-[11px] text-gray-400">
            {nearest_shelter.type} • Distance:{" "}
            <span className="text-pink font-semibold font-mono">
              {nearest_shelter.distanceKm} km
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1 text-[10px]">
          {nearest_shelter.facilities.map((fac, idx) => (
            <span
              key={idx}
              className="bg-navy px-1.5 py-0.5 rounded border border-gray-700 text-gray-300"
            >
              {fac}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-800 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <PhoneCall size={12} className="text-emerald-400" />
            {nearest_shelter.contact}
          </span>
          <span className="font-mono text-gray-300">
            Cap: {nearest_shelter.capacity} people
          </span>
        </div>
      </div>
    </motion.div>
  );
}
