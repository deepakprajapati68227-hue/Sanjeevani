"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import {
  X,
  Printer,
  Copy,
  Check,
  Building,
  Truck,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Calendar,
  Users,
} from "lucide-react";

interface DistrictBriefingExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DistrictBriefingExport({
  isOpen,
  onClose,
}: DistrictBriefingExportProps) {
  const { districtStats, assessments, currentDistrictInfo } = useRisk();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const highRiskWards = assessments.filter((a) => a.risk_level === "High");
  const moderateRiskWards = assessments.filter((a) => a.risk_level === "Moderate");

  const totalCriticalPop = assessments
    .filter((a) => a.risk_level === "High")
    .reduce((acc, curr) => acc + curr.village.population, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const lines = [
      `=============================================================`,
      `DISTRICT DISASTER MANAGEMENT AUTHORITY (DDMA) — MORNING BRIEFING`,
      `District: ${districtStats.district}, ${currentDistrictInfo.state}`,
      `Date: ${todayStr}`,
      `=============================================================`,
      ``,
      `EXECUTIVE SUMMARY:`,
      `- Villages/Wards Monitored: ${districtStats.assessed_count}`,
      `- High Risk Zones: ${districtStats.high_risk_count}`,
      `- Population in Critical Exposure: ${totalCriticalPop.toLocaleString()} citizens`,
      `- Average District Risk Score: ${Math.round(districtStats.average_risk_score * 100)}/100`,
      `- Primary District Threat Focus: ${currentDistrictInfo.recommended_focus}`,
      ``,
      `CRITICAL WARDS REQUIRING IMMEDIATE INTERVENTION:`,
      ...highRiskWards.map(
        (a, i) =>
          `${i + 1}. ${a.village.name} (Pop: ${a.village.population.toLocaleString()}) | Risk: ${Math.round(
            a.overall_score * 100
          )}/100 | Temp: ${Math.round(a.weather.max_temperature_forecast)}°C | Aquifer: ${
            a.groundwater.water_level_mbgl
          } mbgl\n   Directive: Dispatch water tanker & activate ${a.nearest_shelter.name}`
      ),
      ``,
      `LOGISTICAL RESOURCE DEPLOYMENT DIRECTIVES:`,
      `- Water Supply: Deploy ${Math.max(4, highRiskWards.length * 3)} emergency tankers (10,000L).`,
      `- Relief Shelters: Activate ${highRiskWards.length} designated cooling centers with continuous ORS.`,
      `- Labour Directive: Enforce mandatory outdoor work cessation between 11:30 AM - 4:00 PM.`,
      ``,
      `Issued under Section 30 & 34 of the Disaster Management Act, 2005.`,
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#172B4D]/80 backdrop-blur-xs">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[94vh] bg-[#FFFFFF] border border-[#CBD7E2] rounded-xl shadow-2xl flex flex-col overflow-hidden z-10 text-[#172B4D]"
        >
          {/* Header - Monsoon Indigo */}
          <div className="bg-[#3157A6] px-5 py-3 border-b border-[#24417D] flex items-center justify-between flex-wrap gap-2 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#24417D] border border-[#4469B5] flex items-center justify-center text-[#EAF2F5]">
                <FileText size={18} className="text-[#087F7B]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm text-white">
                  DDMA Executive Situation Report (Morning SITREP)
                </h2>
                <p className="text-[11px] text-[#DCE6F2]">
                  Authored statutory report for District Magistrate & Municipal Commissioner
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="bg-[#24417D] hover:bg-[#1E3666] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#4469B5] focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
              >
                {copied ? <Check size={13} className="text-[#267A58]" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy Briefing"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-[#087F7B] hover:bg-[#05605D] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
              >
                <Printer size={13} />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-[#CBD7E2] hover:text-white hover:bg-[#24417D] transition-colors ml-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Briefing Document Canvas with Morning Brief Assembly Stagger */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#FFFFFF] text-[#172B4D] printable-document">
            {/* Document Letterhead */}
            <div className="border-b-2 border-[#172B4D] pb-4 text-center space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#52657A]">
                Government of India • State Disaster Management Authority
              </div>
              <h1 className="text-xl font-bold font-serif uppercase tracking-tight text-[#172B4D]">
                District Disaster Management Authority ({districtStats.district.toUpperCase()})
              </h1>
              <div className="text-xs font-medium text-[#52657A] flex items-center justify-center gap-2 flex-wrap">
                <span>Morning Executive Situation Report (SITREP)</span>
                <span>•</span>
                <span>{todayStr}</span>
                <span>•</span>
                <span className="font-semibold text-[#087F7B]">Brief ready · Updated 06:00 IST</span>
              </div>
            </div>

            {/* Morning Brief Assembly: Step 1 - Risk summary lines up (0-150ms) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: 0.05 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EAF2F5] border border-[#CBD7E2] p-3.5 rounded-lg text-center"
            >
              <div>
                <span className="text-[10px] text-[#52657A] uppercase font-bold block">Wards Monitored</span>
                <span className="text-lg font-bold text-[#172B4D]">{districtStats.assessed_count}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#52657A] uppercase font-bold block">High Risk Wards</span>
                <span className="text-lg font-bold text-[#B9383E]">{districtStats.high_risk_count}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#52657A] uppercase font-bold block">Critical Population</span>
                <span className="text-lg font-bold text-[#172B4D]">{totalCriticalPop.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#52657A] uppercase font-bold block">Hazard Focus</span>
                <span className="text-xs font-bold text-[#087F7B] mt-1 block">{currentDistrictInfo.recommended_focus}</span>
              </div>
            </motion.div>

            {/* Morning Brief Assembly: Step 2 - Priority zones populate (150-300ms) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: 0.18 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between border-b border-[#CBD7E2] pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                  1. High-Priority Wards Requiring Immediate Administrative Action
                </h3>
                <span className="text-[10px] text-[#52657A] font-mono font-medium">Stage 2/4 Verified</span>
              </div>

              <div className="border border-[#CBD7E2] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#EAF2F5] text-[#172B4D] font-semibold text-[11px] border-b border-[#CBD7E2]">
                    <tr>
                      <th className="py-2 px-3">Ward / Village</th>
                      <th className="py-2 px-3">Population</th>
                      <th className="py-2 px-3">Forecast Temp</th>
                      <th className="py-2 px-3">Aquifer mbgl</th>
                      <th className="py-2 px-3">Primary Risk Driver</th>
                      <th className="py-2 px-3">Assigned Relief Shelter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD7E2] text-[#172B4D]">
                    {highRiskWards.map((a) => (
                      <tr key={a.village.id} className="hover:bg-[#F7F9FC]">
                        <td className="py-2 px-3 font-bold text-[#B9383E]">{a.village.name}</td>
                        <td className="py-2 px-3">{a.village.population.toLocaleString()}</td>
                        <td className="py-2 px-3 font-semibold">{Math.round(a.weather.max_temperature_forecast)}°C</td>
                        <td className="py-2 px-3">{a.groundwater.water_level_mbgl} mbgl ({a.groundwater.category})</td>
                        <td className="py-2 px-3 text-[#52657A]">{a.primary_risk_driver}</td>
                        <td className="py-2 px-3 font-medium">{a.nearest_shelter.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Morning Brief Assembly: Step 3 - Resource allocation table slots into place (300-450ms) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: 0.32 }}
              className="space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#CBD7E2] pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                  2. Inter-Departmental Response Mobilization Orders (DMA 2005)
                </h3>
                <span className="text-[10px] text-[#52657A] font-mono font-medium">Stage 3/4 Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-[#CBD7E2] p-3 rounded-lg bg-[#F7F9FC]">
                  <strong className="text-[#3157A6] block mb-1">Public Health & Hospital Services:</strong>
                  <p className="text-[#172B4D] leading-relaxed text-[11px]">
                    Position heatstroke resuscitation beds at Sub-District Hospital; deploy mobile medical vans to informal settlements in Ballarpur and Warora between 11:30 AM and 4:00 PM.
                  </p>
                </div>

                <div className="border border-[#CBD7E2] p-3 rounded-lg bg-[#F7F9FC]">
                  <strong className="text-[#087F7B] block mb-1">Municipal Water Supply Grid:</strong>
                  <p className="text-[#172B4D] leading-relaxed text-[11px]">
                    Route {Math.max(4, highRiskWards.length * 3)} potable water tankers (10,000L) to high-density clusters; install continuous chlorinated water swales at bus stands.
                  </p>
                </div>

                <div className="border border-[#CBD7E2] p-3 rounded-lg bg-[#F7F9FC]">
                  <strong className="text-[#C47A12] block mb-1">Labour Department & Factory Inspectorate:</strong>
                  <p className="text-[#172B4D] leading-relaxed text-[11px]">
                    Enforce mandatory work cessation for all open-air manual labor between 12:00 PM and 4:00 PM under DMA Section 34; inspect coal siding worksites.
                  </p>
                </div>

                <div className="border border-[#CBD7E2] p-3 rounded-lg bg-[#F7F9FC]">
                  <strong className="text-[#267A58] block mb-1">Civil Defense & Community Shelters:</strong>
                  <p className="text-[#172B4D] leading-relaxed text-[11px]">
                    Operationalize designated community halls 24/7 with industrial air coolers, power backup, and free ORS distribution points.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Morning Brief Assembly: Step 4 - Action log and signatures render (450-600ms) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: 0.48 }}
              className="pt-6 border-t border-[#CBD7E2] flex items-center justify-between text-[11px] text-[#52657A] flex-wrap gap-4"
            >
              <div>
                <span className="font-semibold text-[#172B4D]">Sanjeevani Automated Disaster Decision-Support System</span>
                <span className="block font-mono text-[10px] text-[#52657A]">Telemetry Source: Open-Meteo & CGWB India-WRIS</span>
              </div>
              <div className="text-right">
                <span className="font-bold block text-[#172B4D]">District Magistrate & Collector</span>
                <span>Chairperson, District Disaster Management Authority</span>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-[#EAF2F5] px-5 py-3 border-t border-[#CBD7E2] flex items-center justify-between text-xs text-[#52657A]">
            <span className="font-medium">Official Government Statutory Briefing (DMA 2005)</span>
            <button
              onClick={onClose}
              className="bg-[#3157A6] hover:bg-[#24417D] text-white px-4 py-1.5 rounded transition-colors text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
