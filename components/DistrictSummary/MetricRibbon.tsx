"use client";

import React from "react";
import { useRisk } from "@/context/RiskContext";
import { AlertTriangle, MapPin, Users, Building, ShieldAlert } from "lucide-react";

export default function MetricRibbon() {
  const { districtStats, whatIf } = useRisk();

  return (
    <div className="w-full bg-navy-card/90 border-b border-navy-light/80 px-4 py-2 sm:px-6 text-white text-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 items-center">
        {/* Monitored Villages */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-navy border border-gray-700 text-gray-300">
            <MapPin size={15} className="text-pink" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              Monitored Wards
            </div>
            <div className="text-sm font-bold font-mono">
              {districtStats.assessed_count}{" "}
              <span className="text-[10px] font-normal text-gray-400">Villages</span>
            </div>
          </div>
        </div>

        {/* High Risk Count */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-red-950/50 border border-red-800 text-red-400">
            <AlertTriangle size={15} className="text-red-400" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              High Risk Hotspots
            </div>
            <div className="text-sm font-bold font-mono text-red-400 flex items-center gap-1.5">
              {districtStats.high_risk_count} Critical
              {districtStats.high_risk_count > 0 && (
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
          </div>
        </div>

        {/* Average Risk Index */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-amber-950/40 border border-amber-800 text-amber-300">
            <ShieldAlert size={15} className="text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              District Risk Index
            </div>
            <div className="text-sm font-bold font-mono text-amber-300">
              {Math.round(districtStats.average_risk_score * 100)} / 100
              <span className="text-[10px] text-gray-400 ml-1 font-normal">
                ({districtStats.moderate_risk_count} Mod, {districtStats.low_risk_count} Safe)
              </span>
            </div>
          </div>
        </div>

        {/* Population at Risk */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-navy border border-gray-700 text-gray-300">
            <Users size={15} className="text-pink" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              Pop. in Critical Zones
            </div>
            <div className="text-sm font-bold font-mono text-gray-200">
              {districtStats.total_population_at_high_risk.toLocaleString()}{" "}
              <span className="text-[10px] text-gray-400">Citizens</span>
            </div>
          </div>
        </div>

        {/* Active Shelters Ready */}
        <div className="hidden lg:flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-navy border border-gray-700 text-gray-300">
            <Building size={15} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              Relief Shelters
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              12 Active Centers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
