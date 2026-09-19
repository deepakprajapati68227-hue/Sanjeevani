"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import {
  Sparkles,
  X,
  AlertTriangle,
  Bot,
  Truck,
  Building,
  ShieldCheck,
  Send,
  Loader2,
  Copy,
  Check,
  Megaphone,
  Clock,
  ArrowRight,
} from "lucide-react";

interface AIAdvisoryData {
  threat_summary: string;
  urgency: string;
  department_directives: Array<{
    department: string;
    action: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM";
  }>;
  resource_deployment: {
    water_tankers: string;
    cooling_shelters: string;
    medical_support: string;
  };
  citizen_advisory_en: string;
  citizen_advisory_regional: string;
  chat_answer?: string;
}

interface AIIncidentAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIIncidentAdvisorModal({
  isOpen,
  onClose,
}: AIIncidentAdvisorModalProps) {
  const { selectedAssessment } = useRisk();

  const [advisory, setAdvisory] = useState<AIAdvisoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("qwen/qwen3.8-27b");

  // Fetch initial advisory when modal opens
  useEffect(() => {
    if (!isOpen || !selectedAssessment) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setChatAnswer(null);

    fetch("/app/api/ai-advisory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        village: selectedAssessment.village,
        weather: selectedAssessment.weather,
        groundwater: selectedAssessment.groundwater,
        overall_score: selectedAssessment.overall_score,
        risk_level: selectedAssessment.risk_level,
      }),
    })
      .then(async (res) => {
        // Fallback to relative /api/ai-advisory
        if (!res.ok) {
          return fetch("/api/ai-advisory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              village: selectedAssessment.village,
              weather: selectedAssessment.weather,
              groundwater: selectedAssessment.groundwater,
              overall_score: selectedAssessment.overall_score,
              risk_level: selectedAssessment.risk_level,
            }),
          });
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.advisory) {
          setAdvisory(data.advisory);
          if (data.model_used) setModelUsed(data.model_used);
        } else {
          throw new Error("Invalid advisory format");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Advisory error:", err);
        setError("Failed to generate AI advisory. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedAssessment]);

  // Handle custom authority query
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !selectedAssessment) return;

    setIsAsking(true);
    try {
      const res = await fetch("/api/ai-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          village: selectedAssessment.village,
          weather: selectedAssessment.weather,
          groundwater: selectedAssessment.groundwater,
          overall_score: selectedAssessment.overall_score,
          risk_level: selectedAssessment.risk_level,
          user_query: customQuestion.trim(),
        }),
      });

      const data = await res.json();
      if (data.advisory?.chat_answer) {
        setChatAnswer(data.advisory.chat_answer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!isOpen || !selectedAssessment) return null;

  const v = selectedAssessment.village;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-navy border border-purple-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header Bar */}
          <div className="bg-navy-card px-5 py-3.5 border-b border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300">
                <Bot size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-sm tracking-tight text-white">
                    DDMA AI Incident Action Advisor
                  </h2>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    Groq Ultra-Fast AI
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Tactical authority solutions for {v.name} Ward, {v.district} • {v.state}
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
            {/* Telemetry Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-card border border-navy-light p-3 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Ward:</span>
                <strong className="text-white font-heading">{v.name}</strong>
                <span className="text-gray-500">({v.population.toLocaleString()} citizens)</span>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-gray-400 mr-1.5">Live Temp:</span>
                  <strong className="text-amber-400">
                    {Math.round(selectedAssessment.weather.max_temperature_forecast)}°C
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 mr-1.5">Groundwater:</span>
                  <strong className="text-blue-400">
                    {selectedAssessment.groundwater.water_level_mbgl} mbgl ({selectedAssessment.groundwater.category})
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 mr-1.5">Risk Score:</span>
                  <strong className="text-pink">
                    {Math.round(selectedAssessment.overall_score * 100)}/100 ({selectedAssessment.risk_level})
                  </strong>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="py-14 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 size={32} className="text-purple-400 animate-spin" />
                <p className="text-sm font-medium text-gray-300">
                  Synthesizing real-time telemetry into departmental directives...
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Engine: Groq {modelUsed} • Disaster Management Act, 2005 Protocol
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-xs">
                {error}
              </div>
            )}

            {/* Content Display */}
            {!isLoading && advisory && (
              <div className="space-y-5 animate-fade-in">
                {/* 1. Executive Summary & Urgency */}
                <div className="bg-gradient-to-r from-purple-950/40 via-navy-card to-pink/10 border border-purple-500/40 p-4 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-purple-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                        Incident Appraisal for District Magistrate / Municipal Commissioner
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 uppercase">
                      Urgency: {advisory.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed font-sans">
                    {advisory.threat_summary}
                  </p>
                </div>

                {/* 2. Departmental Tactical Directives */}
                <div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-pink" />
                    <span>Immediate Departmental Action Matrix</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {advisory.department_directives?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-navy-card border border-navy-light/80 hover:border-purple-500/40 p-3.5 rounded-lg flex flex-col justify-between transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-heading font-semibold text-xs text-white">
                              {item.department}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                item.priority === "CRITICAL"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {item.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Physical Resource Allocation Directives */}
                <div className="bg-navy-card border border-navy-light/80 p-4 rounded-lg">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Truck size={14} className="text-cyan-400" />
                    <span>Emergency Logistics & Physical Assets Mobilization</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded bg-navy border border-gray-800">
                      <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
                        <Truck size={13} />
                        <span>Potable Water Fleet</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {advisory.resource_deployment?.water_tankers}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-navy border border-gray-800">
                      <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                        <Building size={13} />
                        <span>Cooling & Relief Shelters</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {advisory.resource_deployment?.cooling_shelters}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-navy border border-gray-800">
                      <div className="text-pink font-bold mb-1 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        <span>Medical Rapid Response</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {advisory.resource_deployment?.medical_support}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Public Loudspeaker & WhatsApp Broadcast Scripts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* English Broadcast */}
                  <div className="bg-navy-card border border-navy-light/80 p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                          <Megaphone size={13} className="text-pink" />
                          <span>Public Megaphone Script (English)</span>
                        </span>
                        <button
                          onClick={() => handleCopy(advisory.citizen_advisory_en, "en")}
                          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 bg-navy px-2 py-0.5 rounded border border-gray-700"
                        >
                          {copiedSection === "en" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          <span>{copiedSection === "en" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-mono bg-navy p-2 rounded">
                        "{advisory.citizen_advisory_en}"
                      </p>
                    </div>
                  </div>

                  {/* Regional Broadcast (Marathi / Local) */}
                  <div className="bg-navy-card border border-navy-light/80 p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                          <Megaphone size={13} className="text-emerald-400" />
                          <span>स्थानिक ध्वनिक्षेपक संदेश (Marathi / Hindi)</span>
                        </span>
                        <button
                          onClick={() => handleCopy(advisory.citizen_advisory_regional, "regional")}
                          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 bg-navy px-2 py-0.5 rounded border border-gray-700"
                        >
                          {copiedSection === "regional" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          <span>{copiedSection === "regional" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans bg-navy p-2 rounded">
                        "{advisory.citizen_advisory_regional}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Interactive "Ask AI Incident Commander" Custom Query Box */}
                <div className="bg-gradient-to-b from-navy-card to-navy p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={15} className="text-purple-400" />
                    <span className="font-heading font-semibold text-xs text-white">
                      Ask AI Incident Commander a Custom Tactical Question
                    </span>
                  </div>

                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder={`e.g. "Should we close outdoor schools in ${v.name} tomorrow?" or "Where to route extra tankers?"`}
                      className="flex-1 bg-navy border border-gray-700 focus:border-purple-400 px-3 py-2 rounded text-xs text-white placeholder:text-gray-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isAsking || !customQuestion.trim()}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors flex-shrink-0"
                    >
                      {isAsking ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                      <span>Ask AI</span>
                    </button>
                  </form>

                  {chatAnswer && (
                    <div className="mt-3 p-3 bg-purple-950/40 border border-purple-500/50 rounded-lg text-xs text-purple-200 leading-relaxed animate-fade-in">
                      <div className="font-bold text-[11px] text-purple-300 uppercase tracking-wider mb-1">
                        Incident Commander Response:
                      </div>
                      <p>{chatAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-navy-card px-5 py-3 border-t border-navy-light/80 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Ultra-Fast LLM Inference: Powered by Groq ({modelUsed})</span>
            </div>
            <button
              onClick={onClose}
              className="bg-navy-light hover:bg-gray-700 text-white px-4 py-1.5 rounded transition-colors text-xs font-semibold"
            >
              Close Advisory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
