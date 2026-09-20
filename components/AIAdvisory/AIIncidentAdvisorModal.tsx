"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import { SupportedLanguage } from "@/lib/types";
import {
  speakText,
  stopSpeaking,
  getSpeakingStatus,
  SUPPORTED_LANGUAGES,
} from "@/lib/speech";
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
  Volume2,
  VolumeX,
  Globe,
  Play,
  Square,
  Languages,
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
  const { selectedAssessment, language: globalLanguage } = useRisk();

  const [advisory, setAdvisory] = useState<AIAdvisoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("qwen/qwen3.8-27b");

  // Multilingual & TTS States
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(globalLanguage || "en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedAdvisory, setTranslatedAdvisory] = useState<AIAdvisoryData | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  // Sync with global language on open
  useEffect(() => {
    if (globalLanguage) {
      setTargetLang(globalLanguage);
    }
  }, [globalLanguage]);

  // Cleanup speech on modal close or unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleClose = () => {
    stopSpeaking();
    setIsVoiceActive(false);
    setSpeakingSection(null);
    onClose();
  };

  // Fetch initial advisory when modal opens
  useEffect(() => {
    if (!isOpen || !selectedAssessment) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setChatAnswer(null);
    setTranslatedAdvisory(null);
    stopSpeaking();
    setIsVoiceActive(false);

    fetch("/api/ai-advisory", {
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
        console.warn("AI generation note, activating instant telemetry contingency:", err);
        // Resilient contingency advisory based on real telemetry
        const contingencyAdvisory: AIAdvisoryData = {
          threat_summary: `${selectedAssessment.village.name} is experiencing critical climate stress with forecast temperature of ${Math.round(selectedAssessment.weather.max_temperature_forecast)}°C and water level at ${selectedAssessment.groundwater.water_level_mbgl} mbgl. Immediate inter-departmental mitigation is required under DDMA guidelines.`,
          urgency: selectedAssessment.risk_level === "High" ? "IMMEDIATE (0-2 hrs)" : "HIGH (2-6 hrs)",
          department_directives: [
            {
              department: "Public Health & Hospital Services",
              action: `Deploy mobile health team with cold intravenous normal saline, ORS packets, and activate cooling beds for ${selectedAssessment.village.name}.`,
              priority: "CRITICAL",
            },
            {
              department: "Municipal Water Supply (PHED)",
              action: `Dispatch emergency 10,000L water tankers to high-density clusters; inspect aquifer borewells in ${selectedAssessment.village.block} block.`,
              priority: "CRITICAL",
            },
            {
              department: "Labour & Construction Enforcement",
              action: "Enforce work suspension between 11:30 AM and 4:00 PM for all outdoor workers; ensure shade and electrolyte water at worksites.",
              priority: "HIGH",
            },
            {
              department: "Civil Defense & Relief Shelters",
              action: `Activate ${selectedAssessment.nearest_shelter.name} as primary relief center with power backup, clean water, and medical kits.`,
              priority: "HIGH",
            },
          ],
          resource_deployment: {
            water_tankers: "2 tankers (10,000L) assigned to central distribution squares",
            cooling_shelters: `Operationalize ${selectedAssessment.nearest_shelter.name} with 24/7 volunteer staff`,
            medical_support: "1 Mobile ICU van pre-positioned at Sub-District Hospital",
          },
          citizen_advisory_en: `HEAT & CLIMATE ALERT for ${selectedAssessment.village.name}: Limit outdoor activity between 12 PM - 4 PM. Drink plenty of water and ORS. Report heat exhaustion to ASHA workers.`,
          citizen_advisory_regional: `उष्णतेची लाट सतर्कता (${selectedAssessment.village.name}): दुपारी १२ ते ४ दरम्यान उन्हात काम टाळा. भरपूर पाणी व ओआरएस प्या. जवळचे मदत केंद्र: ${selectedAssessment.nearest_shelter.name}.`,
        };
        setAdvisory(contingencyAdvisory);
        setModelUsed("DDMA Intelligence Protocol");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedAssessment]);

  // Dynamic Translation Handler
  const handleTranslateTo = async (langCode: SupportedLanguage) => {
    setTargetLang(langCode);
    stopSpeaking();
    setIsVoiceActive(false);

    if (!advisory || langCode === "en") {
      setTranslatedAdvisory(null);
      return;
    }

    setIsTranslating(true);
    try {
      // Translate threat summary and citizen advisory
      const [threatRes, megaphoneRes] = await Promise.all([
        fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: advisory.threat_summary,
            targetLanguage: langCode,
            context: "disaster threat situational assessment",
          }),
        }),
        fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: advisory.citizen_advisory_en,
            targetLanguage: langCode,
            context: "public emergency citizen broadcast script",
          }),
        }),
      ]);

      const threatData = await threatRes.json();
      const megaphoneData = await megaphoneRes.json();

      setTranslatedAdvisory({
        ...advisory,
        threat_summary: threatData.translatedText || advisory.threat_summary,
        citizen_advisory_regional: megaphoneData.translatedText || advisory.citizen_advisory_regional,
      });
    } catch (err) {
      console.warn("Translation failed, falling back to base regional content:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  // TTS Speech Handler
  const handleSpeakText = (text: string, sectionId: string) => {
    if (isVoiceActive && speakingSection === sectionId) {
      stopSpeaking();
      setIsVoiceActive(false);
      setSpeakingSection(null);
      return;
    }

    stopSpeaking();
    setSpeakingSection(sectionId);

    speakText(text, targetLang, {
      rate: speechRate,
      onStart: () => {
        setIsVoiceActive(true);
      },
      onEnd: () => {
        setIsVoiceActive(false);
        setSpeakingSection(null);
      },
      onError: () => {
        setIsVoiceActive(false);
        setSpeakingSection(null);
      },
    });
  };

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
      console.error("Custom query error:", err);
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
  const currentAdvisory = translatedAdvisory || advisory;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={handleClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-navy border border-purple-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header Bar */}
          <div className="bg-navy-card px-5 py-3 border-b border-purple-500/30 flex items-center justify-between flex-wrap gap-2">
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
              onClick={handleClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
              title="Close Modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Multilingual Voice Broadcast & Translation Deck */}
          <div className="bg-[#121A38] px-5 py-2.5 border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Language Selector Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-400 flex items-center gap-1 font-semibold text-[11px]">
                <Globe size={13} className="text-[#147D78]" />
                <span>Language & Voice:</span>
              </span>
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
                {SUPPORTED_LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => handleTranslateTo(langItem.code)}
                    disabled={isTranslating}
                    className={`px-2 py-0.5 rounded text-[11px] transition-all font-medium ${
                      targetLang === langItem.code
                        ? "bg-purple-600 text-white font-bold shadow-sm"
                        : "bg-navy-card text-gray-400 hover:text-white border border-gray-700/80"
                    }`}
                  >
                    {langItem.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Voice Broadcast Master Controls */}
            <div className="flex items-center gap-2">
              {/* Speed toggle */}
              <button
                onClick={() => setSpeechRate((r) => (r === 0.85 ? 1.0 : r === 1.0 ? 1.25 : 0.85))}
                className="text-[10px] font-mono bg-navy border border-gray-700 px-2 py-0.5 rounded text-gray-300 hover:text-white"
                title="Voice speed rate"
              >
                {speechRate}x Speed
              </button>

              {/* Master Play/Stop TTS */}
              {currentAdvisory && (
                <button
                  onClick={() => {
                    const fullText = `Incident appraisal for ${v.name}. Urgency: ${currentAdvisory.urgency}. ${currentAdvisory.threat_summary}. Department directives: ${currentAdvisory.department_directives.map((d) => `${d.department}: ${d.action}`).join(". ")}. Public broadcast: ${currentAdvisory.citizen_advisory_regional || currentAdvisory.citizen_advisory_en}`;
                    handleSpeakText(fullText, "full_advisory");
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isVoiceActive && speakingSection === "full_advisory"
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-[#635B8F] hover:bg-[#534B7D] text-white"
                  }`}
                  title="Speak entire incident advisory via TTS voice"
                >
                  {isVoiceActive && speakingSection === "full_advisory" ? (
                    <>
                      <Square size={12} />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <span>🔊 Read Out Advisory (TTS)</span>
                    </>
                  )}
                </button>
              )}
            </div>
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
                  <strong className="text-[#C43D3D]">
                    {Math.round(selectedAssessment.overall_score * 100)}/100 ({selectedAssessment.risk_level})
                  </strong>
                </div>
              </div>
            </div>

            {/* Translation in progress indicator */}
            {isTranslating && (
              <div className="p-2.5 bg-purple-950/40 border border-purple-500/40 rounded text-xs text-purple-200 flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin text-purple-400" />
                <span>Translating advisory to {SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.nativeName || targetLang} via Groq AI...</span>
              </div>
            )}

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
            {!isLoading && currentAdvisory && (
              <div className="space-y-5 animate-fade-in">
                {/* 1. Executive Summary & Urgency */}
                <div className="bg-[#12233A] border border-[#635B8F]/50 p-4 rounded-md">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#635B8F]"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A9B7C6]">
                        Model-Assisted Appraisal for District Magistrate / Municipal Commissioner
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Section TTS Speaker Button */}
                      <button
                        onClick={() => handleSpeakText(currentAdvisory.threat_summary, "appraisal")}
                        className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border transition-colors ${
                          isVoiceActive && speakingSection === "appraisal"
                            ? "bg-red-500 text-white border-red-400 animate-pulse"
                            : "bg-navy border-purple-500/40 text-purple-300 hover:text-white"
                        }`}
                        title="Listen to Incident Appraisal in selected language"
                      >
                        <Volume2 size={12} />
                        <span>{isVoiceActive && speakingSection === "appraisal" ? "Playing..." : "Listen"}</span>
                      </button>

                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 uppercase">
                        Urgency: {currentAdvisory.urgency}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 leading-relaxed font-sans">
                    {currentAdvisory.threat_summary}
                  </p>
                </div>

                {/* 2. Departmental Tactical Directives */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#635B8F]" />
                      <span>Immediate Departmental Action Matrix</span>
                    </h3>

                    {/* Directives TTS */}
                    <button
                      onClick={() => {
                        const dirText = currentAdvisory.department_directives
                          .map((d) => `${d.department}: Priority ${d.priority}. ${d.action}`)
                          .join(". ");
                        handleSpeakText(dirText, "directives");
                      }}
                      className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border transition-colors ${
                        isVoiceActive && speakingSection === "directives"
                          ? "bg-red-500 text-white border-red-400 animate-pulse"
                          : "bg-navy border-gray-700 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Volume2 size={12} />
                      <span>{isVoiceActive && speakingSection === "directives" ? "Playing..." : "Read Directives"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentAdvisory.department_directives?.map((item, idx) => (
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
                        {currentAdvisory.resource_deployment?.water_tankers}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-navy border border-gray-800">
                      <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                        <Building size={13} />
                        <span>Cooling & Relief Shelters</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {currentAdvisory.resource_deployment?.cooling_shelters}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-navy border border-gray-800">
                      <div className="text-[#C43D3D] font-bold mb-1 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        <span>Medical Rapid Response</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {currentAdvisory.resource_deployment?.medical_support}
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
                          <Megaphone size={13} className="text-[#147D78]" />
                          <span>Public Megaphone Script (English)</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakText(currentAdvisory.citizen_advisory_en, "megaphone_en")}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                              isVoiceActive && speakingSection === "megaphone_en"
                                ? "bg-red-500 text-white border-red-400 animate-pulse"
                                : "bg-navy text-gray-300 border-gray-700 hover:text-white"
                            }`}
                          >
                            <Volume2 size={11} />
                            <span>Listen</span>
                          </button>
                          <button
                            onClick={() => handleCopy(currentAdvisory.citizen_advisory_en, "en")}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 bg-navy px-2 py-0.5 rounded border border-gray-700"
                          >
                            {copiedSection === "en" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            <span>{copiedSection === "en" ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-mono bg-navy p-2 rounded">
                        "{currentAdvisory.citizen_advisory_en}"
                      </p>
                    </div>
                  </div>

                  {/* Regional Broadcast (Selected Language) */}
                  <div className="bg-navy-card border border-navy-light/80 p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                          <Megaphone size={13} className="text-emerald-400" />
                          <span>
                            स्थानिक ध्वनिक्षेपक संदेश ({SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.nativeName || "Regional"})
                          </span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakText(currentAdvisory.citizen_advisory_regional, "megaphone_reg")}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                              isVoiceActive && speakingSection === "megaphone_reg"
                                ? "bg-red-500 text-white border-red-400 animate-pulse"
                                : "bg-navy text-gray-300 border-gray-700 hover:text-white"
                            }`}
                          >
                            <Volume2 size={11} />
                            <span>Listen</span>
                          </button>
                          <button
                            onClick={() => handleCopy(currentAdvisory.citizen_advisory_regional, "regional")}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 bg-navy px-2 py-0.5 rounded border border-gray-700"
                          >
                            {copiedSection === "regional" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            <span>{copiedSection === "regional" ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans bg-navy p-2 rounded">
                        "{currentAdvisory.citizen_advisory_regional}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Interactive "Ask AI Incident Commander" Custom Query Box */}
                <div className="bg-[#12233A] p-4 rounded-md border border-[#2D465A]">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={15} className="text-[#635B8F]" />
                    <span className="font-heading font-semibold text-xs text-white">
                      Ask Tactical Model a Custom Operational Question
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
                    <div className="mt-3 p-3 bg-purple-950/40 border border-purple-500/50 rounded-lg text-xs text-purple-200 leading-relaxed animate-fade-in space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[11px] text-purple-300 uppercase tracking-wider">
                          Incident Commander Response:
                        </div>
                        <button
                          onClick={() => handleSpeakText(chatAnswer, "chat_answer")}
                          className="text-[10px] bg-purple-900/60 border border-purple-400/40 text-purple-200 px-2 py-0.5 rounded flex items-center gap-1"
                        >
                          <Volume2 size={11} />
                          <span>{isVoiceActive && speakingSection === "chat_answer" ? "Speaking..." : "Listen"}</span>
                        </button>
                      </div>
                      <p>{chatAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-navy-card px-5 py-3 border-t border-navy-light/80 flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>
                Engine: Groq ({modelUsed}) • Web Speech API TTS • Multilingual Translation Active
              </span>
            </div>
            <button
              onClick={handleClose}
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
