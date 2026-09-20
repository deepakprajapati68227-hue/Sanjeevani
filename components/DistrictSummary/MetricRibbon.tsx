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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="w-full bg-[#F4F7F8] border-b border-[#E7EDF0] text-[#17212B]">
      {/* 1. Personalized District Operational Context Banner (Section 5 & 7) */}
      <div className="px-4 py-2 sm:px-6 bg-white border-b border-[#E7EDF0] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-[#147D78]"></span>
          <span className="font-semibold text-[#17212B]">
            {greeting}, {districtStats.district} response team
          </span>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <span className="text-[#526575] hidden sm:inline">
            DDMA · {todayDate}
          </span>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <span className="text-[#17212B] font-medium">
            {isCriticalActive ? (
              <span className="text-[#C43D3D] font-semibold">
                What needs attention: {districtStats.high_risk_count} critical zone{districtStats.high_risk_count > 1 ? "s" : ""} require immediate field intervention
              </span>
            ) : (
              <span className="text-[#2E8B68] font-medium">
                What needs attention: All monitored zones are currently within stable thresholds
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#526575]">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-[#147D78]" />
            <span>Refreshed live from Open-Meteo & CGWB</span>
          </span>
        </div>
      </div>

      {/* 2. Four Clean Summary Cards Max (Section 3 C2 & 7.1) */}
      <div className="px-4 py-2.5 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
        {/* Card 1: Critical Zones */}
        <div className="bg-white border border-[#E7EDF0] rounded-md p-2.5 flex items-center gap-3 shadow-sm hover:border-[#CBD5E1] transition-colors">
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
              isCriticalActive
                ? "bg-[#FCEBEB] text-[#C43D3D] border border-[#F4BEBE]"
                : "bg-[#EAF5F0] text-[#2E8B68] border border-[#BCE1D1]"
            }`}
          >
            {isCriticalActive ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <div className="text-[10px] text-[#7D8C98] uppercase font-bold tracking-wider">
              Critical Zones
            </div>
            <div className="text-sm font-bold text-[#17212B] flex items-center gap-1.5 font-mono">
              <span className={isCriticalActive ? "text-[#C43D3D]" : "text-[#2E8B68]"}>
                {districtStats.high_risk_count} Wards
              </span>
            </div>
            <div className="text-[10px] text-[#526575] truncate max-w-[150px]">
              {isCriticalActive ? "Immediate field action needed" : "All zones monitored"}
            </div>
          </div>
        </div>

        {/* Card 2: Population in Critical Exposure */}
        <div className="bg-white border border-[#E7EDF0] rounded-md p-2.5 flex items-center gap-3 shadow-sm hover:border-[#CBD5E1] transition-colors">
          <div className="w-9 h-9 rounded-md bg-[#F4F7F8] border border-[#E7EDF0] flex items-center justify-center text-[#2F6F9F] flex-shrink-0">
            <Users size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#7D8C98] uppercase font-bold tracking-wider">
              Population at Risk
            </div>
            <div className="text-sm font-bold text-[#17212B] font-mono">
              {formatPopulation(districtStats.total_population_at_high_risk)}
            </div>
            <div className="text-[10px] text-[#526575] truncate max-w-[150px]">
              In high vulnerability clusters
            </div>
          </div>
        </div>

        {/* Card 3: District Risk Today */}
        <div className="bg-white border border-[#E7EDF0] rounded-md p-2.5 flex items-center gap-3 shadow-sm hover:border-[#CBD5E1] transition-colors">
          <div className="w-9 h-9 rounded-md bg-[#FBF3E8] border border-[#F3D8B0] flex items-center justify-center text-[#B7791F] flex-shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#7D8C98] uppercase font-bold tracking-wider">
              District Risk Today
            </div>
            <div className="text-sm font-bold text-[#B7791F] font-mono">
              {Math.round(districtStats.average_risk_score * 100)} / 100
            </div>
            <div className="text-[10px] text-[#526575] truncate max-w-[150px]">
              {districtStats.moderate_risk_count} Watch • {districtStats.low_risk_count} Stable
            </div>
          </div>
        </div>

        {/* Card 4: Active Relief Shelters */}
        <div className="bg-white border border-[#E7EDF0] rounded-md p-2.5 flex items-center gap-3 shadow-sm hover:border-[#CBD5E1] transition-colors">
          <div className="w-9 h-9 rounded-md bg-[#EAF5F0] border border-[#BCE1D1] flex items-center justify-center text-[#2E8B68] flex-shrink-0">
            <Building size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#7D8C98] uppercase font-bold tracking-wider">
              Active Relief Shelters
            </div>
            <div className="text-sm font-bold text-[#2E8B68] font-mono">
              12 Active Centers
            </div>
            <div className="text-[10px] text-[#526575] truncate max-w-[150px]">
              1,450 Bed capacity ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
