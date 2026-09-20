"use client";

import React from "react";
import { ComponentBreakdown } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Thermometer,
  Flame,
  CloudRain,
  Waves,
  Droplets,
  Satellite,
  ShieldAlert,
} from "lucide-react";

interface ExplainabilityBarsProps {
  breakdown: ComponentBreakdown;
}

export default function ExplainabilityBars({ breakdown }: ExplainabilityBarsProps) {
  const factors = [
    {
      key: "heatwave_index",
      data: breakdown.heatwave_index,
      icon: <Flame size={15} className="text-[#C43D3D]" />,
      colorClass: "bg-[#C43D3D]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#C43D3D] border-[#F4BEBE] bg-[#FCEBEB]",
    },
    {
      key: "temperature",
      data: breakdown.temperature,
      icon: <Thermometer size={15} className="text-[#B7791F]" />,
      colorClass: "bg-[#B7791F]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#B7791F] border-[#F3D8B0] bg-[#FBF3E8]",
    },
    {
      key: "flood_surge",
      data: breakdown.flood_surge,
      icon: <Waves size={15} className="text-[#2F6F9F]" />,
      colorClass: "bg-[#2F6F9F]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#2F6F9F] border-[#D5DFE5] bg-[#F4F7F8]",
    },
    {
      key: "precipitation",
      data: breakdown.precipitation,
      icon: <CloudRain size={15} className="text-[#147D78]" />,
      colorClass: "bg-[#147D78]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#147D78] border-[#BCE1D1] bg-[#EAF5F0]",
    },
    {
      key: "water",
      data: breakdown.water,
      icon: <Droplets size={15} className="text-[#147D78]" />,
      colorClass: "bg-[#147D78]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#147D78] border-[#BCE1D1] bg-[#EAF5F0]",
    },
    {
      key: "satellite_fire",
      data: breakdown.satellite_fire,
      icon: <Satellite size={15} className="text-[#B7791F]" />,
      colorClass: "bg-[#B7791F]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#B7791F] border-[#F3D8B0] bg-[#FBF3E8]",
    },
    {
      key: "vulnerability",
      data: breakdown.vulnerability,
      icon: <ShieldAlert size={15} className="text-[#635B8F]" />,
      colorClass: "bg-[#635B8F]",
      bgClass: "bg-white border-[#E7EDF0]",
      badgeClass: "text-[#635B8F] border-[#D5DFE5] bg-[#F4F7F8]",
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-[#17212B] font-semibold border-b border-[#E7EDF0] pb-1">
        <span>7-Parameter Explainable Risk Breakdown</span>
        <span className="text-[10px] text-[#147D78] font-mono font-bold">Multi-Hazard Engine</span>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
        {factors.map((item, idx) => {
          if (!item.data) return null;
          const percent = Math.round(item.data.normalized_score * 100);
          const contrib = Math.round(item.data.weighted_contribution * 100);

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className={`p-2.5 rounded-md border ${item.bgClass} text-xs shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-medium text-[#17212B]">
                  {item.icon}
                  <span className="text-[11px] font-semibold">{item.data.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[#17212B] text-[11px] font-bold">{item.data.raw_value}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${item.badgeClass}`}
                  >
                    {item.data.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-[#E7EDF0] h-1.5 rounded-full overflow-hidden mb-1 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.5, delay: 0.05 + idx * 0.04, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.colorClass}`}
                />
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between text-[10px] text-[#526575]">
                <span className="line-clamp-1">{item.data.description}</span>
                <span className="font-mono text-[#17212B] flex-shrink-0 ml-2">
                  Weight: {item.data.weight} → <b className="text-[#147D78]">+{contrib}%</b>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
