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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-4xl max-h-[94vh] bg-navy border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="bg-navy-card px-5 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink/20 border border-pink/50 flex items-center justify-center text-pink">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm text-white">
                  Exportable District Risk Briefing
                </h2>
                <p className="text-[11px] text-gray-400">
                  Morning briefing document for District Magistrate & Municipal Commissioner (P2)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="bg-navy-light hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-700"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy Briefing"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-pink hover:bg-pink-hover text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer size={13} />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-navy-light transition-colors ml-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Briefing Document Canvas */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-white text-gray-900 printable-document">
            {/* Document Letterhead */}
            <div className="border-b-2 border-gray-800 pb-4 text-center space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-gray-600">
                Government of India • State Disaster Management Authority
              </div>
              <h1 className="text-xl font-bold font-serif uppercase tracking-tight text-gray-950">
                District Disaster Management Authority ({districtStats.district.toUpperCase()})
              </h1>
              <div className="text-xs font-medium text-gray-600 flex items-center justify-center gap-2">
                <span>Morning Executive Situation Report (SITREP)</span>
                <span>•</span>
                <span>{todayStr}</span>
              </div>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 p-3.5 rounded-lg text-center">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Wards Monitored</span>
                <span className="text-lg font-bold text-gray-900">{districtStats.assessed_count}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">High Risk Wards</span>
                <span className="text-lg font-bold text-red-600">{districtStats.high_risk_count}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Critical Population</span>
                <span className="text-lg font-bold text-gray-900">{totalCriticalPop.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Hazard Focus</span>
                <span className="text-xs font-bold text-pink mt-1 block">{currentDistrictInfo.recommended_focus}</span>
              </div>
            </div>

            {/* Critical Wards Matrix */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1">
                1. High-Priority Wards Requiring Immediate Administrative Action
              </h3>

              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold text-[11px] border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Ward / Village</th>
                      <th className="py-2 px-3">Population</th>
                      <th className="py-2 px-3">Forecast Temp</th>
                      <th className="py-2 px-3">Aquifer mbgl</th>
                      <th className="py-2 px-3">Primary Risk Driver</th>
                      <th className="py-2 px-3">Assigned Relief Shelter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    {highRiskWards.map((a) => (
                      <tr key={a.village.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-bold text-red-700">{a.village.name}</td>
                        <td className="py-2 px-3">{a.village.population.toLocaleString()}</td>
                        <td className="py-2 px-3 font-semibold">{Math.round(a.weather.max_temperature_forecast)}°C</td>
                        <td className="py-2 px-3">{a.groundwater.water_level_mbgl} mbgl ({a.groundwater.category})</td>
                        <td className="py-2 px-3 text-gray-600">{a.primary_risk_driver}</td>
                        <td className="py-2 px-3 font-medium">{a.nearest_shelter.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Directives */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1">
                2. Inter-Departmental Response Mobilization Orders (DMA 2005)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                  <strong className="text-blue-700 block mb-1">Public Health & Hospital Services:</strong>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    Position heatstroke resuscitation beds at Sub-District Hospital; deploy mobile medical vans to informal settlements in Ballarpur and Warora between 11:30 AM and 4:00 PM.
                  </p>
                </div>

                <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                  <strong className="text-cyan-700 block mb-1">Municipal Water Supply Grid:</strong>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    Route {Math.max(4, highRiskWards.length * 3)} potable water tankers (10,000L) to high-density clusters; install continuous chlorinated water swales at bus stands.
                  </p>
                </div>

                <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                  <strong className="text-amber-700 block mb-1">Labour Department & Factory Inspectorate:</strong>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    Enforce mandatory work cessation for all open-air manual labor between 12:00 PM and 4:00 PM under DMA Section 34; inspect coal siding worksites.
                  </p>
                </div>

                <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                  <strong className="text-emerald-700 block mb-1">Civil Defense & Community Shelters:</strong>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    Operationalize designated community halls 24/7 with industrial air coolers, power backup, and free ORS distribution points.
                  </p>
                </div>
              </div>
            </div>

            {/* Sign-off Seal */}
            <div className="pt-6 border-t border-gray-300 flex items-center justify-between text-[11px] text-gray-600">
              <div>
                <span>Sanjeevani Automated Disaster Decision-Support System</span>
                <span className="block font-mono text-[10px]">Telemetry Source: Open-Meteo & CGWB India-WRIS</span>
              </div>
              <div className="text-right">
                <span className="font-bold block text-gray-900">District Magistrate & Collector</span>
                <span>Chairperson, District Disaster Management Authority</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-navy-card px-5 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>Official Government Briefing Document</span>
            <button
              onClick={onClose}
              className="bg-navy-light hover:bg-gray-700 text-white px-4 py-1.5 rounded transition-colors text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
