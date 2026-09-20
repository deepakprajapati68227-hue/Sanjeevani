"use client";

import React from "react";
import { useRisk } from "@/context/RiskContext";
import { AlertTriangle, Users, Building, ShieldCheck, Clock, ShieldAlert } from "lucide-react";
import { formatPopulation } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full bg-[#F7F9FC] border-b border-[#CBD7E2] text-[#172B4D]">
      {/* 1. Personalized District Operational Context Banner - Warm Saffron & River Teal */}
      <div className="px-4 py-2 sm:px-6 bg-[#FFF3D6] border-b border-[#C47A12]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-[#087F7B] animate-pulse"></span>
          <span className="font-semibold text-[#172B4D]">
            {greeting}, {districtStats.district} response team
          </span>
          <span className="text-[#CBD7E2] hidden sm:inline">•</span>
          <span className="text-[#52657A] hidden sm:inline">
            DDMA · {todayDate}
          </span>
          <span className="text-[#CBD7E2] hidden sm:inline">•</span>
          <span className="text-[#172B4D] font-medium">
            {isCriticalActive ? (
              <span className="text-[#B9383E] font-semibold flex items-center gap-1">
                <AlertTriangle size={13} className="text-[#B9383E] inline" />
                What needs attention: {districtStats.high_risk_count} critical zone{districtStats.high_risk_count > 1 ? "s" : ""} require immediate field intervention
              </span>
            ) : (
              <span className="text-[#267A58] font-medium flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#267A58] inline" />
                What needs attention: All monitored zones are currently within stable thresholds
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#52657A]">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-[#087F7B]" />
            <span>Refreshed live from Open-Meteo & CGWB</span>
          </span>
        </div>
      </div>

      {/* 2. Four Clean Summary Cards Max - Pure White Surfaces, Section 11 Tokens */}
      <div className="px-4 py-2.5 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
        {/* Card 1: Critical Zones */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md p-2.5 flex items-center gap-3 shadow-xs hover:border-[#1D6FD0] transition-colors">
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
              isCriticalActive
                ? "bg-[#FBE8E8] text-[#B9383E] border border-[#B9383E]/30"
                : "bg-[#E5F3EC] text-[#267A58] border border-[#267A58]/30"
            }`}
          >
            {isCriticalActive ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <div className="text-[10px] text-[#52657A] uppercase font-bold tracking-wider">
              Critical Zones
            </div>
            <motion.div
              key={`crit-${districtStats.district}-${districtStats.high_risk_count}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold text-[#172B4D] flex items-center gap-1.5 font-mono"
            >
              <span className={isCriticalActive ? "text-[#B9383E]" : "text-[#267A58]"}>
                {districtStats.high_risk_count} Wards
              </span>
            </motion.div>
            <div className="text-[10px] text-[#52657A] truncate max-w-[150px]">
              {isCriticalActive ? "Immediate field action needed" : "All zones monitored"}
            </div>
          </div>
        </div>

        {/* Card 2: Population in Critical Exposure */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md p-2.5 flex items-center gap-3 shadow-xs hover:border-[#1D6FD0] transition-colors">
          <div className="w-9 h-9 rounded-md bg-[#EAF2F5] border border-[#CBD7E2] flex items-center justify-center text-[#2B6EA6] flex-shrink-0">
            <Users size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#52657A] uppercase font-bold tracking-wider">
              Population at Risk
            </div>
            <motion.div
              key={`pop-${districtStats.district}-${districtStats.total_population_at_high_risk}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold text-[#172B4D] font-mono"
            >
              {formatPopulation(districtStats.total_population_at_high_risk)}
            </motion.div>
            <div className="text-[10px] text-[#52657A] truncate max-w-[150px]">
              In high vulnerability clusters
            </div>
          </div>
        </div>

        {/* Card 3: District Risk Today */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md p-2.5 flex items-center gap-3 shadow-xs hover:border-[#1D6FD0] transition-colors">
          <div className="w-9 h-9 rounded-md bg-[#FFF3D6] border border-[#C47A12]/30 flex items-center justify-center text-[#C47A12] flex-shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#52657A] uppercase font-bold tracking-wider">
              District Risk Today
            </div>
            <motion.div
              key={`risk-${districtStats.district}-${districtStats.average_risk_score}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold text-[#C47A12] font-mono"
            >
              {Math.round(districtStats.average_risk_score * 100)} / 100
            </motion.div>
            <div className="text-[10px] text-[#52657A] truncate max-w-[150px]">
              {districtStats.moderate_risk_count} Watch • {districtStats.low_risk_count} Stable
            </div>
          </div>
        </div>

        {/* Card 4: Active Relief Shelters */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-md p-2.5 flex items-center gap-3 shadow-xs hover:border-[#1D6FD0] transition-colors">
          <div className="w-9 h-9 rounded-md bg-[#E5F3EC] border border-[#267A58]/30 flex items-center justify-center text-[#267A58] flex-shrink-0">
            <Building size={18} />
          </div>
          <div>
            <div className="text-[10px] text-[#52657A] uppercase font-bold tracking-wider">
              Active Relief Shelters
            </div>
            <div className="text-sm font-bold text-[#267A58] font-mono">
              12 Active Centers
            </div>
            <div className="text-[10px] text-[#52657A] truncate max-w-[150px]">
              1,450 Bed capacity ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
