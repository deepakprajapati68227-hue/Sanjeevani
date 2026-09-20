"use client";

import React from "react";
import { useRisk } from "@/context/RiskContext";
import { AlertTriangle, Users, Building, ShieldCheck, Clock, ShieldAlert } from "lucide-react";
import { formatPopulation } from "@/lib/formatters";

export default function MetricRibbon() {
  const { districtStats, currentDistrictInfo } = useRisk();

  const isCriticalActive = districtStats.high_risk_count > 0;
  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="w-full bg-[#0E1726] border-b border-[#1E344D] text-[#F5F7FA]">
      {/* 1. District Operational Context & Status Banner */}
      <div className="px-4 py-2 sm:px-6 bg-[#12233A]/60 border-b border-[#1E344D]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16B8A6]"></span>
          <span className="font-semibold text-white">
            DDMA {districtStats.district.toUpperCase()}
          </span>
          <span className="text-[#94A3B8] hidden sm:inline">•</span>
          <span className="text-[#94A3B8] hidden sm:inline">
            {todayDate}
          </span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#F5F7FA] font-medium">
            {isCriticalActive ? (
              <span className="text-[#F16B6F] font-semibold">
                {districtStats.high_risk_count} critical zone{districtStats.high_risk_count > 1 ? "s" : ""} require immediate intervention
              </span>
            ) : (
              <span className="text-[#16B8A6] font-medium">
                No critical zones active; normal monitoring active
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-[#4CC9F0]" />
            <span>Refreshed live from Open-Meteo & CGWB</span>
          </span>
        </div>
      </div>

      {/* 2. Four Clean Summary Cards Max (Section 3 C2) */}
      <div className="px-4 py-2.5 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
        {/* Card 1: Critical Zones */}
        <div className="bg-[#12233A] border border-[#2C4663] rounded-md p-2.5 flex items-center gap-3 shadow-sm">
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
              isCriticalActive
                ? "bg-[#E5484D]/15 border border-[#E5484D]/40 text-[#E5484D]"
                : "bg-[#16B8A6]/15 border border-[#16B8A6]/40 text-[#16B8A6]"
            }`}
          >
            {isCriticalActive ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
              Critical Zones
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
              <span className={isCriticalActive ? "text-[#E5484D]" : "text-[#16B8A6]"}>
                {districtStats.high_risk_count} Wards
              </span>
            </div>
            <div className="text-[10px] text-[#94A3B8] truncate max-w-[150px]">
              {isCriticalActive ? "Immediate action needed" : "All zones monitored"}
            </div>
          </div>
        </div>

        {/* Card 2: Population in Critical Exposure */}
        <div className="bg-[#12233A] border border-[#2C4663] rounded-md p-2.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-md bg-[#1E344D] border border-[#2C4663] flex items-center justify-center text-[#4CC9F0] flex-shrink-0">
            <Users size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
              Population at Risk
            </div>
            <div className="text-sm font-bold text-white font-mono">
              {formatPopulation(districtStats.total_population_at_high_risk)}
            </div>
            <div className="text-[10px] text-[#94A3B8] truncate max-w-[150px]">
              In exposed labor clusters
            </div>
          </div>
        </div>

        {/* Card 3: District Risk Today */}
        <div className="bg-[#12233A] border border-[#2C4663] rounded-md p-2.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-md bg-[#F5B942]/15 border border-[#F5B942]/40 flex items-center justify-center text-[#F5B942] flex-shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
              District Risk Today
            </div>
            <div className="text-sm font-bold text-[#F5B942] font-mono">
              {Math.round(districtStats.average_risk_score * 100)} / 100
            </div>
            <div className="text-[10px] text-[#94A3B8] truncate max-w-[150px]">
              {districtStats.moderate_risk_count} Watch • {districtStats.low_risk_count} Stable
            </div>
          </div>
        </div>

        {/* Card 4: Active Relief Shelters */}
        <div className="bg-[#12233A] border border-[#2C4663] rounded-md p-2.5 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-md bg-[#16B8A6]/15 border border-[#16B8A6]/40 flex items-center justify-center text-[#16B8A6] flex-shrink-0">
            <Building size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
              Relief Shelters
            </div>
            <div className="text-sm font-bold text-[#16B8A6] font-mono">
              12 Active Centers
            </div>
            <div className="text-[10px] text-[#94A3B8] truncate max-w-[150px]">
              1,450 Bed capacity ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
