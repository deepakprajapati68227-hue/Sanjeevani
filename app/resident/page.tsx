"use client";

import React, { useState, useEffect } from "react";
import { useRisk } from "@/context/RiskContext";
import { ALERT_TRANSLATIONS } from "@/lib/translations";
import { SupportedLanguage } from "@/lib/types";
import { speakText, stopSpeaking, SUPPORTED_LANGUAGES } from "@/lib/speech";
import {
  ShieldAlert,
  Sun,
  Waves,
  Flame,
  Volume2,
  VolumeX,
  Phone,
  Building,
  Navigation,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Globe,
  MapPin,
  ChevronDown,
  Activity,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatDistance, formatTemp } from "@/lib/formatters";

export default function ResidentPage() {
  const {
    selectedAssessment,
    assessments,
    selectVillage,
    language,
    setLanguage,
    selectedDistrict,
    setSelectedDistrict,
    availableDistricts,
    currentDistrictInfo,
  } = useRisk();

  const [hasVoted, setHasVoted] = useState<"help" | "safe" | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [smsCopied, setSmsCopied] = useState(false);

  // Fallback to first assessment if none selected
  const assessment = selectedAssessment || assessments[0];

  const alertContent = assessment
    ? (ALERT_TRANSLATIONS[language] ? ALERT_TRANSLATIONS[language](assessment) : ALERT_TRANSLATIONS.en(assessment))
    : null;

  // Spoken script content
  const spokenText = alertContent
    ? `${alertContent.header}. ${alertContent.bodyParagraph}. ${alertContent.shelterHeading}: ${alertContent.shelterDirections}.`
    : "";

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(spokenText, language, {
        rate: 0.9,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleVote = async (type: "help" | "safe") => {
    if (!assessment) return;
    setHasVoted(type);
    try {
      await fetch("/api/community-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villageId: assessment.village.id,
          feedbackType: type === "help" ? "severe" : "confirmed",
        }),
      });
    } catch (e) {
      console.warn("Vote recording error:", e);
    }
  };

  const handleCopySms = () => {
    if (!assessment) return;
    const sms = `EMERGENCY ALERT: ${assessment.village.name} - ${assessment.risk_level.toUpperCase()} RISK. Shelter: ${assessment.nearest_shelter.name} (${formatDistance(assessment.nearest_shelter.distanceKm)}). Helplines: 112 / 1077.`;
    navigator.clipboard.writeText(sms);
    setSmsCopied(true);
    setTimeout(() => setSmsCopied(false), 2500);
  };

  if (!assessment || !alertContent) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 text-white text-center">
        <div className="space-y-3">
          <ShieldAlert size={36} className="text-[#4CC9F0] mx-auto animate-pulse" />
          <h2 className="text-base font-bold">Connecting to District Safety Feeds...</h2>
        </div>
      </div>
    );
  }

  const isCritical = assessment.risk_level === "High";
  const isFlood = assessment.village.primary_hazard.toLowerCase().includes("flood");

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172B4D] font-body flex flex-col items-center">
      {/* 1. Header: Brand, Ward Picker & Language Switcher - Monsoon Indigo */}
      <header className="w-full max-w-xl bg-[#3157A6] border-b border-[#24417D] px-4 py-3 flex items-center justify-between gap-2 shadow-xs sticky top-0 z-20 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#24417D] border border-[#4469B5] flex items-center justify-center text-white">
            <ShieldAlert size={18} className="text-[#087F7B]" />
          </div>
          <div>
            <span className="font-heading font-bold text-sm tracking-tight text-white block leading-none">
              SANJEEVANI
            </span>
            <span className="text-[10px] text-[#DCE6F2]">
              Resident Public Safety Advisory
            </span>
          </div>
        </div>

        {/* Right Controls: Ward Selector + Language */}
        <div className="flex items-center gap-2">
          {/* Ward Switcher */}
          <div className="bg-[#24417D] border border-[#4469B5] rounded px-2 py-1 text-xs">
            <select
              value={assessment.village.id}
              onChange={(e) => selectVillage(e.target.value)}
              className="bg-transparent text-white font-medium text-xs border-none focus:outline-none cursor-pointer"
              aria-label="Select Ward"
            >
              {assessments.map((a) => (
                <option key={a.village.id} value={a.village.id} className="bg-[#24417D] text-white">
                  {a.village.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div className="bg-[#24417D] border border-[#4469B5] rounded px-2 py-1 text-xs text-[#EAF2F5] flex items-center gap-1">
            <Globe size={12} className="text-[#087F7B]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium text-xs border-none focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en" className="bg-[#24417D] text-white">EN</option>
              <option value="hi" className="bg-[#24417D] text-white">हिन्दी</option>
              <option value="mr" className="bg-[#24417D] text-white">मराठी</option>
              <option value="te" className="bg-[#24417D] text-white">తెలుగు</option>
              <option value="ta" className="bg-[#24417D] text-white">தமிழ்</option>
              <option value="bn" className="bg-[#24417D] text-white">বাংলা</option>
              <option value="gu" className="bg-[#24417D] text-white">ગુજરાતી</option>
              <option value="kn" className="bg-[#24417D] text-white">ಕನ್ನಡ</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Single-Column Vertical Flow */}
      <main className="w-full max-w-xl p-4 sm:p-5 space-y-4 pb-12">
        {/* Officer Switch Link */}
        <div className="flex items-center justify-between text-xs text-[#52657A] px-1">
          <span className="flex items-center gap-1.5 font-medium text-[#172B4D]">
            <MapPin size={13} className="text-[#087F7B]" />
            <span>{assessment.village.name}, {assessment.village.district}</span>
          </span>
          <Link
            href="/dashboard"
            className="text-[11px] font-semibold text-[#087F7B] hover:underline flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
          >
            <span>Officer Command View</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 2. Large Alert State Banner with Semantic Color & Icon - Flat, No Gradient */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-xs ${
            isCritical
              ? "bg-[#FBE8E8] border-[#B9383E]/30 text-[#172B4D]"
              : "bg-[#FFF3D6] border-[#C47A12]/30 text-[#172B4D]"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
              isCritical ? "bg-[#B9383E] text-white" : "bg-[#C47A12] text-white"
            }`}
          >
            {isFlood ? <Waves size={26} /> : <Sun size={26} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${
                  isCritical ? "bg-[#B9383E]" : "bg-[#C47A12]"
                }`}
              >
                {isCritical ? "Critical Alert" : "Weather Watch"}
              </span>
              <span className="text-xs text-[#52657A] font-mono font-medium">
                {formatTemp(assessment.weather.max_temperature_forecast)} Peak
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-heading font-bold text-[#172B4D] mt-1 leading-tight">
              {alertContent.header}
            </h1>

            {/* 3. One-sentence plain language explanation */}
            <p className="text-xs text-[#52657A] mt-1.5 leading-relaxed">
              {alertContent.bodyParagraph}
            </p>
          </div>
        </div>

        {/* 4. One Dominant Immediate Instruction - Solid Border */}
        <div className="bg-[#FFFFFF] border-l-4 border-l-[#B9383E] border-y border-r border-[#CBD7E2] p-4 rounded-r-lg shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#B9383E] tracking-wider block">
            Immediate Action Required
          </span>
          <p className="text-sm font-bold text-[#172B4D] mt-0.5">
            {isCritical
              ? "Stop outdoor labor between 11:30 AM – 4:00 PM. Move to nearest designated cooling center."
              : "Drink water frequently. Keep livestock in shade and stay alert to weather updates."}
          </p>
        </div>

        {/* 5. Section 12.1 Voice Audio Playback Button with Flat Solid Waveform Animation */}
        <button
          onClick={handleToggleVoice}
          className={`w-full py-3.5 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1D6FD0] ${
            isSpeaking
              ? "bg-[#B9383E] text-white border-[#B9383E]"
              : "bg-[#087F7B] hover:bg-[#05605D] text-white border-[#087F7B]"
          }`}
          aria-label="Play audio voice alert"
        >
          {isSpeaking ? (
            <div className="flex items-center gap-3">
              <VolumeX size={20} />
              <span>Playing Audio Alert... Tap to Stop</span>
              {/* Section 12.1 Flat Solid Waveform Strokes (no glowing, flat strokes) */}
              <div className="flex items-center gap-1 h-5 pl-2 border-l border-white/40">
                {[14, 20, 10, 18, 12].map((height, i) => (
                  <span
                    key={i}
                    className="w-1 bg-white rounded-full animate-bounce"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: "600ms",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Volume2 size={20} className="text-white" />
              <span>Listen to Alert (हा इशारा ऐका / यह चेतावनी सुनें)</span>
            </div>
          )}
        </button>

        {/* 6. Section 12.1 Large Shelter Refuge Card with Spring Compass */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#CBD7E2] pb-2">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-[#087F7B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#172B4D]">
                Designated Safety Refuge Center
              </h3>
            </div>
            <span className="text-[10px] text-[#267A58] font-bold font-mono px-2 py-0.5 rounded bg-[#E5F3EC] border border-[#267A58]/30">
              {assessment.nearest_shelter.open_status}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#172B4D]">
              {assessment.nearest_shelter.name}
            </h4>
            <p className="text-xs text-[#52657A] mt-0.5">
              {alertContent.shelterDirections}
            </p>
          </div>

          {/* Compass & Distance Row with Spring Physics Pointer */}
          <div className="grid grid-cols-2 gap-2 bg-[#F7F9FC] p-2.5 rounded-lg border border-[#CBD7E2] text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#CBD7E2] flex items-center justify-center text-[#087F7B]">
                <Compass size={18} className="transform rotate-45 transition-transform duration-700 ease-out" />
              </div>
              <div>
                <span className="text-[9px] text-[#52657A] uppercase block">Walking Distance</span>
                <span className="font-mono font-bold text-[#172B4D]">
                  {formatDistance(assessment.nearest_shelter.distanceKm)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#CBD7E2] flex items-center justify-center text-[#267A58]">
                <Navigation size={18} />
              </div>
              <div>
                <span className="text-[9px] text-[#52657A] uppercase block">Direction</span>
                <span className="font-semibold text-[#172B4D]">
                  {(assessment.nearest_shelter.distanceKm ?? 0) < 1 ? "Within village" : "Follow main road"}
                </span>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            {assessment.nearest_shelter.facilities.map((fac, idx) => (
              <span
                key={idx}
                className="bg-[#F7F9FC] px-2 py-1 rounded border border-[#CBD7E2] text-[#52657A] font-medium"
              >
                {fac}
              </span>
            ))}
          </div>

          {/* Action Row: Google Maps & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(assessment.nearest_shelter.name + ", " + assessment.village.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F9FC] hover:bg-[#EAF2F5] text-[#087F7B] border border-[#087F7B]/30 py-2.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
            >
              <Navigation size={14} />
              <span>Directions (Google Maps)</span>
            </a>

            <a
              href={`tel:${assessment.nearest_shelter.contact}`}
              className="bg-[#087F7B] hover:bg-[#05605D] text-white py-2.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
            >
              <Phone size={14} />
              <span>Call ({assessment.nearest_shelter.contact})</span>
            </a>
          </div>
        </div>

        {/* 7. Section 12.1 Community Confirmation: Smooth Morph to Confirmed State */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-xl p-4 space-y-2.5 shadow-xs">
          <div className="text-center">
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
              Community Ground Status Check-in
            </h4>
            <p className="text-[11px] text-[#52657A] mt-0.5">
              Confirm conditions in {assessment.village.name} to help emergency teams prioritize tankers
            </p>
          </div>

          {hasVoted ? (
            <div className="py-3 text-center bg-[#E5F3EC] border border-[#267A58]/30 rounded-lg text-xs space-y-1 transition-all">
              <CheckCircle2 size={24} className="text-[#267A58] mx-auto" />
              <div className="font-bold text-[#267A58]">
                {hasVoted === "help" ? "Emergency Escalation Sent · Reported" : "Reported Safe · Verified"}
              </div>
              <p className="text-[10px] text-[#52657A]">
                {hasVoted === "help"
                  ? "Local water tankers & response coordinators notified."
                  : "Thank you for confirming your ground safety."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleVote("help")}
                className="bg-[#B9383E] hover:bg-[#8F2B30] text-white py-3.5 px-3 rounded-lg font-bold text-xs shadow-xs transition-colors flex flex-col items-center justify-center gap-1 text-center focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
              >
                <AlertTriangle size={18} />
                <span>I Need Help</span>
                <span className="text-[9px] font-normal opacity-90">मला मदत हवी आहे</span>
              </button>

              <button
                onClick={() => handleVote("safe")}
                className="bg-[#267A58] hover:bg-[#1E5F44] text-white py-3.5 px-3 rounded-lg font-bold text-xs shadow-xs transition-colors flex flex-col items-center justify-center gap-1 text-center focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]"
              >
                <CheckCircle2 size={18} />
                <span>I Am Safe</span>
                <span className="text-[9px] font-normal opacity-90">मी सुरक्षित आहे</span>
              </button>
            </div>
          )}
        </div>

        {/* 8. Basic Phone SMS Fallback & Emergency Helplines */}
        <div className="bg-[#FFFFFF] border border-[#CBD7E2] rounded-xl p-3.5 space-y-2 text-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#172B4D] flex items-center gap-1.5">
              <MessageSquare size={13} className="text-[#087F7B]" />
              <span>2G Basic Phone SMS Alert</span>
            </span>
            <button
              onClick={handleCopySms}
              className="text-[10px] font-semibold text-[#087F7B] hover:underline focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
            >
              {smsCopied ? "SMS Text Copied!" : "Copy SMS Text"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#CBD7E2] text-[11px] text-[#52657A]">
            <span>National Disaster Helpline: <strong className="text-[#172B4D] font-mono">112</strong></span>
            <span>District Disaster Cell: <strong className="text-[#172B4D] font-mono">1077</strong></span>
          </div>
        </div>

        {/* 9. Collapsible "More Information" */}
        <div className="border border-[#CBD7E2] rounded-xl overflow-hidden text-xs shadow-xs bg-[#FFFFFF]">
          <button
            onClick={() => setShowMoreInfo((prev) => !prev)}
            className="w-full bg-[#FFFFFF] p-3 text-left font-semibold text-[#172B4D] hover:bg-[#F7F9FC] flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-[#1D6FD0]"
          >
            <span>Why did I get this alert? (हे सूचना का मिळाली?)</span>
            <ChevronDown size={15} className={`text-[#52657A] transition-transform ${showMoreInfo ? "rotate-180" : ""}`} />
          </button>

          {showMoreInfo && (
            <div className="p-3.5 bg-[#F7F9FC] space-y-2 text-[11px] text-[#52657A] border-t border-[#CBD7E2] leading-relaxed">
              <p>
                This advisory was triggered by real-time Open-Meteo temperature observations and Central Ground Water Board (CGWB) aquifer monitoring.
              </p>
              <p>
                In {assessment.village.name}, ambient apparent heat is peaking above 42°C, and local water table levels are at {assessment.groundwater.water_level_mbgl} mbgl. Hydration collapse is dangerous during peak sunlight hours.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
