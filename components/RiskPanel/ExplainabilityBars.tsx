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
      icon: <Flame size={15} className="text-[#B9383E]" />,
      colorClass: "bg-[#B9383E]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#B9383E] border-[#B9383E]/30 bg-[#FBE8E8]",
    },
    {
      key: "temperature",
      data: breakdown.temperature,
      icon: <Thermometer size={15} className="text-[#C47A12]" />,
      colorClass: "bg-[#C47A12]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#C47A12] border-[#C47A12]/30 bg-[#FFF3D6]",
    },
    {
      key: "flood_surge",
      data: breakdown.flood_surge,
      icon: <Waves size={15} className="text-[#2B6EA6]" />,
      colorClass: "bg-[#2B6EA6]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#2B6EA6] border-[#CBD7E2] bg-[#EAF2F5]",
    },
    {
      key: "precipitation",
      data: breakdown.precipitation,
      icon: <CloudRain size={15} className="text-[#087F7B]" />,
      colorClass: "bg-[#087F7B]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#087F7B] border-[#087F7B]/30 bg-[#E5F3EC]",
    },
    {
      key: "water",
      data: breakdown.water,
      icon: <Droplets size={15} className="text-[#087F7B]" />,
      colorClass: "bg-[#087F7B]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#087F7B] border-[#087F7B]/30 bg-[#E5F3EC]",
    },
    {
      key: "satellite_fire",
      data: breakdown.satellite_fire,
      icon: <Satellite size={15} className="text-[#C47A12]" />,
      colorClass: "bg-[#C47A12]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#C47A12] border-[#C47A12]/30 bg-[#FFF3D6]",
    },
    {
      key: "vulnerability",
      data: breakdown.vulnerability,
      icon: <ShieldAlert size={15} className="text-[#6558A5]" />,
      colorClass: "bg-[#6558A5]",
      bgClass: "bg-[#FFFFFF] border-[#CBD7E2]",
      badgeClass: "text-[#6558A5] border-[#CBD7E2] bg-[#EAF2F5]",
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-[#172B4D] font-semibold border-b border-[#CBD7E2] pb-1">
        <span>7-Parameter Explainable Risk Breakdown</span>
        <span className="text-[10px] text-[#087F7B] font-mono font-bold">Multi-Hazard Engine</span>
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
              className={`p-2.5 rounded-md border ${item.bgClass} text-xs shadow-xs`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-medium text-[#172B4D]">
                  {item.icon}
                  <span className="text-[11px] font-semibold">{item.data.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[#172B4D] text-[11px] font-bold">{item.data.raw_value}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${item.badgeClass}`}
                  >
                    {item.data.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container - Flat, No Gradient */}
              <div className="w-full bg-[#EAF2F5] h-1.5 rounded-full overflow-hidden mb-1 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.35, delay: 0.05 + idx * 0.04, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.colorClass}`}
                />
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between text-[10px] text-[#52657A]">
                <span className="line-clamp-1">{item.data.description}</span>
                <span className="font-mono text-[#172B4D] flex-shrink-0 ml-2">
                  Weight: {item.data.weight} → <b className="text-[#087F7B]">+{contrib}%</b>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
