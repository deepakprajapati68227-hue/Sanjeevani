"use client";

import React from "react";
import { useRisk } from "@/context/RiskContext";
import { Sliders, RotateCcw, Thermometer, CloudRain, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatIfSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatIfSimulator({ isOpen, onClose }: WhatIfSimulatorProps) {
  const { whatIf, updateWhatIf, resetWhatIf, districtStats } = useRisk();

  if (!isOpen) return null;

  const isModified = whatIf.tempDelta !== 0 || whatIf.precipDelta !== 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 250 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl bg-navy-card/95 backdrop-blur-md border border-pink/40 rounded-card p-4 shadow-2xl text-white text-xs"
      >
        <div className="flex items-center justify-between border-b border-gray-700/60 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-pink/20 text-pink">
              <Sliders size={16} />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-white">
                Interactive "What-If" Climate Simulator
              </span>
              <span className="text-[10px] text-gray-400 block">
                Stress-test {districtStats.district} district risk levels under simulated climate extremes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isModified && (
              <button
                onClick={resetWhatIf}
                className="flex items-center gap-1 text-[11px] bg-gray-800 hover:bg-gray-700 px-2.5 py-1 rounded text-gray-300 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset to Live</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          {/* Temperature Delta Slider */}
          <div className="bg-navy p-2.5 rounded border border-gray-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 text-gray-300 font-semibold text-[11px]">
                <Thermometer size={14} className="text-red-400" />
                <span>Temperature Delta (Heatwave)</span>
              </span>
              <span
                className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                  whatIf.tempDelta > 0
                    ? "text-red-400 bg-red-950/60"
                    : whatIf.tempDelta < 0
                    ? "text-blue-400 bg-blue-950/60"
                    : "text-gray-300"
                }`}
              >
                {whatIf.tempDelta > 0 ? `+${whatIf.tempDelta}` : whatIf.tempDelta}°C
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="5"
              step="0.5"
              value={whatIf.tempDelta}
              onChange={(e) => updateWhatIf(parseFloat(e.target.value), whatIf.precipDelta)}
              className="w-full accent-pink cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
              <span>-2°C (Cooler)</span>
              <span>0°C (Live Feed)</span>
              <span>+5°C (Extreme Heat)</span>
            </div>
          </div>

          {/* Precipitation Delta Slider */}
          <div className="bg-navy p-2.5 rounded border border-gray-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1 text-gray-300 font-semibold text-[11px]">
                <CloudRain size={14} className="text-blue-400" />
                <span>Precipitation Delta (Monsoon Surge)</span>
              </span>
              <span
                className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                  whatIf.precipDelta > 0
                    ? "text-blue-400 bg-blue-950/60"
                    : whatIf.precipDelta < 0
                    ? "text-amber-400 bg-amber-950/60"
                    : "text-gray-300"
                }`}
              >
                {whatIf.precipDelta > 0 ? `+${whatIf.precipDelta}` : whatIf.precipDelta}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="10"
              value={whatIf.precipDelta}
              onChange={(e) => updateWhatIf(whatIf.tempDelta, parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
              <span>-50% (Drought)</span>
              <span>0% (Live)</span>
              <span>+100% (Cloudburst)</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Impact Callout */}
        <div className="flex items-center justify-between bg-navy/80 px-3 py-2 rounded border border-gray-700/70 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300">
            <AlertTriangle size={14} className="flex-shrink-0 text-amber-400" />
            <span>
              Under current simulation: <strong className="text-white">{districtStats.high_risk_count}</strong> of 12 wards triggered into <strong className="text-red-400">High Risk</strong>.
            </span>
          </div>
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            Watch circle markers on the map scale and pulse live.
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
