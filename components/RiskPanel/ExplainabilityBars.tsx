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
      icon: <Flame size={15} className="text-red-400" />,
      colorClass: "bg-red-500",
      bgClass: "bg-red-950/25 border-red-900/40",
      badgeClass: "text-red-400 border-red-500/30 bg-red-500/20",
    },
    {
      key: "temperature",
      data: breakdown.temperature,
      icon: <Thermometer size={15} className="text-orange-400" />,
      colorClass: "bg-orange-500",
      bgClass: "bg-orange-950/20 border-orange-900/30",
      badgeClass: "text-orange-300 border-orange-500/30 bg-orange-500/20",
    },
    {
      key: "flood_surge",
      data: breakdown.flood_surge,
      icon: <Waves size={15} className="text-blue-400" />,
      colorClass: "bg-blue-500",
      bgClass: "bg-blue-950/20 border-blue-900/30",
      badgeClass: "text-blue-300 border-blue-500/30 bg-blue-500/20",
    },
    {
      key: "precipitation",
      data: breakdown.precipitation,
      icon: <CloudRain size={15} className="text-sky-400" />,
      colorClass: "bg-sky-500",
      bgClass: "bg-sky-950/20 border-sky-900/30",
      badgeClass: "text-sky-300 border-sky-500/30 bg-sky-500/20",
    },
    {
      key: "water",
      data: breakdown.water,
      icon: <Droplets size={15} className="text-cyan-400" />,
      colorClass: "bg-cyan-500",
      bgClass: "bg-cyan-950/20 border-cyan-900/30",
      badgeClass: "text-cyan-300 border-cyan-500/30 bg-cyan-500/20",
    },
    {
      key: "satellite_fire",
      data: breakdown.satellite_fire,
      icon: <Satellite size={15} className="text-amber-400" />,
      colorClass: "bg-amber-500",
      bgClass: "bg-amber-950/20 border-amber-900/30",
      badgeClass: "text-amber-300 border-amber-500/30 bg-amber-500/20",
    },
    {
      key: "vulnerability",
      data: breakdown.vulnerability,
      icon: <ShieldAlert size={15} className="text-purple-400" />,
      colorClass: "bg-purple-500",
      bgClass: "bg-purple-950/20 border-purple-900/30",
      badgeClass: "text-purple-300 border-purple-500/30 bg-purple-500/20",
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-gray-300 font-semibold border-b border-gray-700/60 pb-1">
        <span>7-Parameter Explainable Risk Breakdown</span>
        <span className="text-[10px] text-pink font-mono">Multi-Hazard Engine</span>
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
              className={`p-2.5 rounded-card border ${item.bgClass} text-xs`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-medium text-gray-200">
                  {item.icon}
                  <span className="text-[11px] font-semibold">{item.data.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-gray-200 text-[11px] font-bold">{item.data.raw_value}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${item.badgeClass}`}
                  >
                    {item.data.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-navy h-1.5 rounded-full overflow-hidden mb-1 relative border border-gray-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.5, delay: 0.05 + idx * 0.04, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.colorClass}`}
                />
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="line-clamp-1">{item.data.description}</span>
                <span className="font-mono text-gray-300 flex-shrink-0 ml-2">
                  Weight: {item.data.weight} → <b className="text-white">+{contrib}%</b>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
