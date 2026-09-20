"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import { ML_MODEL_METADATA, RISK_WEIGHTS, TOTAL_WEIGHT } from "@/lib/riskWeights";
import {
  X,
  Binary,
  Cpu,
  CheckCircle2,
  HelpCircle,
  FileCode2,
  Percent,
  Sliders,
  Sparkles,
} from "lucide-react";

interface RiskTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RiskTransparencyModal({
  isOpen,
  onClose,
}: RiskTransparencyModalProps) {
  const { selectedAssessment } = useRisk();

  if (!isOpen || !selectedAssessment) return null;

  const { village, overall_score, breakdown, primary_risk_driver } = selectedAssessment;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-navy border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="bg-navy-card px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Binary size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-sm tracking-tight text-white">
                    Risk Model Transparency & Mathematical Grounding
                  </h2>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                    Explainable AI (XAI)
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Step-by-step audit of formula weights, normalization curves, and live values for {village.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 bg-[#080E24]">
            {/* 1. Mathematical Formula Box */}
            <div className="bg-navy-card border border-cyan-500/30 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                  <FileCode2 size={14} />
                  <span>Deterministic Explainable Risk Equation</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Sum of Weights = {TOTAL_WEIGHT.toFixed(2)}
                </span>
              </div>

              <div className="bg-navy/80 p-3 rounded-lg border border-gray-800 font-mono text-xs text-gray-200 overflow-x-auto text-center">
                <span className="text-pink font-bold">Risk_Score(x)</span> ={" "}
                <span className="text-cyan-300">0.167</span> × Norm(Temp) +{" "}
                <span className="text-cyan-300">0.220</span> × Norm(HeatIndex) +{" "}
                <span className="text-cyan-300">0.112</span> × Norm(Precip) +{" "}
                <span className="text-cyan-300">0.108</span> × Norm(FloodSurge) +{" "}
                <span className="text-cyan-300">0.205</span> × Norm(Groundwater) +{" "}
                <span className="text-cyan-300">0.050</span> × Norm(Fire) +{" "}
                <span className="text-cyan-300">0.138</span> × Exposure
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Weights were learned via <strong>Logistic Regression (scikit-learn)</strong> trained on <strong>2,628 historical observation days</strong> from the Open-Meteo Historical Archive and CGWB aquifer records.
              </p>
            </div>

            {/* 2. Live Value Substitution Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Sliders size={13} className="text-pink" />
                  <span>Live Input Variable Breakdown ({village.name})</span>
                </h3>
                <span className="text-[10px] font-mono text-pink font-bold">
                  Final Score: {Math.round(overall_score * 100)} / 100
                </span>
              </div>

              <div className="border border-gray-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-navy-card/90 text-[10px] text-gray-400 uppercase font-mono border-b border-gray-800">
                      <th className="py-2 px-3">Hazard Parameter</th>
                      <th className="py-2 px-3">Live Telemetry</th>
                      <th className="py-2 px-3">Norm Score</th>
                      <th className="py-2 px-3">Learned Weight</th>
                      <th className="py-2 px-3 text-right">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80 bg-navy font-mono">
                    {Object.entries(breakdown).map(([key, item]) => (
                      <tr key={key} className="hover:bg-navy-card/60 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-medium text-gray-200">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 text-white font-bold">
                          {item.raw_value}
                        </td>
                        <td className="py-2.5 px-3 text-cyan-300">
                          {item.normalized_score}
                        </td>
                        <td className="py-2.5 px-3 text-gray-400">
                          {(item.weight * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-pink">
                          +{(item.weighted_contribution * 100).toFixed(1)} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Training & Validation Audit Metadata */}
            <div className="bg-navy-card border border-gray-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 size={14} />
                <span>Empirical Machine Learning Validation</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
                <div className="bg-navy p-2 rounded border border-gray-800">
                  <span className="text-gray-400 text-[10px] block">Dataset Samples</span>
                  <span className="font-bold text-white">{ML_MODEL_METADATA.sample_size} days</span>
                </div>
                <div className="bg-navy p-2 rounded border border-gray-800">
                  <span className="text-gray-400 text-[10px] block">Disaster Events</span>
                  <span className="font-bold text-amber-400">{ML_MODEL_METADATA.disaster_events_detected}</span>
                </div>
                <div className="bg-navy p-2 rounded border border-gray-800">
                  <span className="text-gray-400 text-[10px] block">ROC-AUC Score</span>
                  <span className="font-bold text-emerald-400">{ML_MODEL_METADATA.roc_auc_accuracy}</span>
                </div>
                <div className="bg-navy p-2 rounded border border-gray-800">
                  <span className="text-gray-400 text-[10px] block">Training Source</span>
                  <span className="font-bold text-cyan-400">Open-Meteo ERA5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-navy-card px-5 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>Primary Driver: <strong className="text-pink">{primary_risk_driver}</strong></span>
            <button
              onClick={onClose}
              className="bg-navy-light hover:bg-gray-700 text-white px-4 py-1.5 rounded transition-colors text-xs font-semibold"
            >
              Close Transparency View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
