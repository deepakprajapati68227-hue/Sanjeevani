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
    <div className="min-h-screen bg-[#F4F7F8] text-[#17212B] font-body flex flex-col items-center">
      {/* 1. Header: Brand, Ward Picker & Language Switcher */}
      <header className="w-full max-w-xl bg-[#203447] border-b border-[#2D465A] px-4 py-3 flex items-center justify-between gap-2 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#147D78] flex items-center justify-center text-white">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="font-heading font-bold text-sm tracking-tight text-white block leading-none">
              SANJEEVANI
            </span>
            <span className="text-[10px] text-[#E7EDF0]">
              Resident Public Safety Advisory
            </span>
          </div>
        </div>

        {/* Right Controls: Ward Selector + Language */}
        <div className="flex items-center gap-2">
          {/* Ward Switcher */}
          <div className="bg-[#17212B] border border-[#2D465A] rounded px-2 py-1 text-xs">
            <select
              value={assessment.village.id}
              onChange={(e) => selectVillage(e.target.value)}
              className="bg-transparent text-white font-medium text-xs border-none focus:outline-none cursor-pointer"
              aria-label="Select Ward"
            >
              {assessments.map((a) => (
                <option key={a.village.id} value={a.village.id} className="bg-[#203447] text-white">
                  {a.village.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div className="bg-[#17212B] border border-[#2D465A] rounded px-2 py-1 text-xs text-[#E7EDF0] flex items-center gap-1">
            <Globe size={12} className="text-[#147D78]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium text-xs border-none focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en" className="bg-[#203447] text-white">EN</option>
              <option value="hi" className="bg-[#203447] text-white">हिन्दी</option>
              <option value="mr" className="bg-[#203447] text-white">मराठी</option>
              <option value="te" className="bg-[#203447] text-white">తెలుగు</option>
              <option value="ta" className="bg-[#203447] text-white">தமிழ்</option>
              <option value="bn" className="bg-[#203447] text-white">বাংলা</option>
              <option value="gu" className="bg-[#203447] text-white">ગુજરાતી</option>
              <option value="kn" className="bg-[#203447] text-white">ಕನ್ನಡ</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Single-Column Vertical Flow */}
      <main className="w-full max-w-xl p-4 sm:p-5 space-y-4 pb-12">
        {/* Officer Switch Link */}
        <div className="flex items-center justify-between text-xs text-[#526575] px-1">
          <span className="flex items-center gap-1.5 font-medium text-[#17212B]">
            <MapPin size={13} className="text-[#147D78]" />
            <span>{assessment.village.name}, {assessment.village.district}</span>
          </span>
          <Link
            href="/dashboard"
            className="text-[11px] font-semibold text-[#147D78] hover:underline flex items-center gap-1"
          >
            <span>Officer Command View</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 2. Large Alert State Banner with Semantic Color & Icon */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-xs ${
            isCritical
              ? "bg-[#FCEBEB] border-[#F4BEBE] text-[#17212B]"
              : "bg-[#FBF3E8] border-[#F3D8B0] text-[#17212B]"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
              isCritical ? "bg-[#C43D3D] text-white" : "bg-[#B7791F] text-white"
            }`}
          >
            {isFlood ? <Waves size={26} /> : <Sun size={26} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${
                  isCritical ? "bg-[#C43D3D]" : "bg-[#B7791F]"
                }`}
              >
                {isCritical ? "Critical Alert" : "Weather Watch"}
              </span>
              <span className="text-xs text-[#526575] font-mono font-medium">
                {formatTemp(assessment.weather.max_temperature_forecast)} Peak
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-heading font-bold text-[#17212B] mt-1 leading-tight">
              {alertContent.header}
            </h1>

            {/* 3. One-sentence plain language explanation */}
            <p className="text-xs text-[#526575] mt-1.5 leading-relaxed">
              {alertContent.bodyParagraph}
            </p>
          </div>
        </div>

        {/* 4. One Dominant Immediate Instruction */}
        <div className="bg-white border-l-4 border-l-[#C43D3D] border-y border-r border-[#E7EDF0] p-4 rounded-r-lg shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#C43D3D] tracking-wider block">
            Immediate Action Required
          </span>
          <p className="text-sm font-bold text-[#17212B] mt-0.5">
            {isCritical
              ? "Stop outdoor labor between 11:30 AM – 4:00 PM. Move to nearest designated cooling center."
              : "Drink water frequently. Keep livestock in shade and stay alert to weather updates."}
          </p>
        </div>

        {/* 5. Large Voice Audio Playback Button */}
        <button
          onClick={handleToggleVoice}
          className={`w-full py-3.5 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xs ${
            isSpeaking
              ? "bg-[#C43D3D] text-white border-[#C43D3D]"
              : "bg-[#147D78] hover:bg-[#0E625E] text-white border-[#147D78]"
          }`}
          aria-label="Play audio voice alert"
        >
          {isSpeaking ? (
            <>
              <VolumeX size={20} />
              <span>Playing Audio Alert... Tap to Stop</span>
            </>
          ) : (
            <>
              <Volume2 size={20} className="text-white" />
              <span>Listen to Alert (हा इशारा ऐका / यह चेतावनी सुनें)</span>
            </>
          )}
        </button>

        {/* 6. Large Shelter Refuge Card with Walking Compass */}
        <div className="bg-white border border-[#E7EDF0] rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E7EDF0] pb-2">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-[#147D78]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#17212B]">
                Designated Safety Refuge Center
              </h3>
            </div>
            <span className="text-[10px] text-[#2E8B68] font-bold font-mono px-2 py-0.5 rounded bg-[#EAF5F0] border border-[#BCE1D1]">
              {assessment.nearest_shelter.open_status}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#17212B]">
              {assessment.nearest_shelter.name}
            </h4>
            <p className="text-xs text-[#526575] mt-0.5">
              {alertContent.shelterDirections}
            </p>
          </div>

          {/* Compass & Distance Row */}
          <div className="grid grid-cols-2 gap-2 bg-[#F4F7F8] p-2.5 rounded-lg border border-[#E7EDF0] text-xs">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-[#147D78]" />
              <div>
                <span className="text-[9px] text-[#7D8C98] uppercase block">Walking Distance</span>
                <span className="font-mono font-bold text-[#17212B]">
                  {formatDistance(assessment.nearest_shelter.distanceKm)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Navigation size={18} className="text-[#2E8B68]" />
              <div>
                <span className="text-[9px] text-[#7D8C98] uppercase block">Direction</span>
                <span className="font-semibold text-[#17212B]">
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
                className="bg-[#F4F7F8] px-2 py-1 rounded border border-[#E7EDF0] text-[#526575] font-medium"
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
              className="bg-[#F4F7F8] hover:bg-[#E7EDF0] text-[#147D78] border border-[#BCE1D1] py-2.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation size={14} />
              <span>Directions (Google Maps)</span>
            </a>

            <a
              href={`tel:${assessment.nearest_shelter.contact}`}
              className="bg-[#147D78] hover:bg-[#0E625E] text-white py-2.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={14} />
              <span>Call ({assessment.nearest_shelter.contact})</span>
            </a>
          </div>
        </div>

        {/* 7. Two Unambiguous Community Response Buttons */}
        <div className="bg-white border border-[#E7EDF0] rounded-xl p-4 space-y-2.5 shadow-xs">
          <div className="text-center">
            <h4 className="text-xs font-bold text-[#17212B] uppercase tracking-wider">
              Community Ground Status Check-in
            </h4>
            <p className="text-[11px] text-[#526575] mt-0.5">
              Confirm conditions in {assessment.village.name} to help emergency teams prioritize tankers
            </p>
          </div>

          {hasVoted ? (
            <div className="py-3 text-center bg-[#EAF5F0] border border-[#BCE1D1] rounded-lg text-xs space-y-1">
              <CheckCircle2 size={24} className="text-[#2E8B68] mx-auto" />
              <div className="font-bold text-[#2E8B68]">Status Transmitted to DDMA Workstation</div>
              <p className="text-[10px] text-[#526575]">
                {hasVoted === "help"
                  ? "Emergency escalation sent to local response team."
                  : "Thank you for confirming your safety."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleVote("help")}
                className="bg-[#C43D3D] hover:bg-[#982F35] text-white py-3.5 px-3 rounded-lg font-bold text-xs shadow-xs transition-colors flex flex-col items-center justify-center gap-1 text-center"
              >
                <AlertTriangle size={18} />
                <span>I Need Help</span>
                <span className="text-[9px] font-normal opacity-90">मला मदत हवी आहे</span>
              </button>

              <button
                onClick={() => handleVote("safe")}
                className="bg-[#2E8B68] hover:bg-[#236C51] text-white py-3.5 px-3 rounded-lg font-bold text-xs shadow-xs transition-colors flex flex-col items-center justify-center gap-1 text-center"
              >
                <CheckCircle2 size={18} />
                <span>I Am Safe</span>
                <span className="text-[9px] font-normal opacity-90">मी सुरक्षित आहे</span>
              </button>
            </div>
          )}
        </div>

        {/* 8. Basic Phone SMS Fallback & Emergency Helplines */}
        <div className="bg-white border border-[#E7EDF0] rounded-xl p-3.5 space-y-2 text-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#17212B] flex items-center gap-1.5">
              <MessageSquare size={13} className="text-[#147D78]" />
              <span>2G Basic Phone SMS Alert</span>
            </span>
            <button
              onClick={handleCopySms}
              className="text-[10px] font-semibold text-[#147D78] hover:underline"
            >
              {smsCopied ? "SMS Text Copied!" : "Copy SMS Text"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E7EDF0] text-[11px] text-[#526575]">
            <span>National Disaster Helpline: <strong className="text-[#17212B] font-mono">112</strong></span>
            <span>District Disaster Cell: <strong className="text-[#17212B] font-mono">1077</strong></span>
          </div>
        </div>

        {/* 9. Collapsible "More Information" */}
        <div className="border border-[#E7EDF0] rounded-xl overflow-hidden text-xs shadow-xs bg-white">
          <button
            onClick={() => setShowMoreInfo((prev) => !prev)}
            className="w-full bg-white p-3 text-left font-semibold text-[#17212B] hover:bg-[#F4F7F8] flex items-center justify-between transition-colors"
          >
            <span>Why did I get this alert? (हे सूचना का मिळाली?)</span>
            <ChevronDown size={15} className={`text-[#526575] transition-transform ${showMoreInfo ? "rotate-180" : ""}`} />
          </button>

          {showMoreInfo && (
            <div className="p-3.5 bg-[#F4F7F8] space-y-2 text-[11px] text-[#526575] border-t border-[#E7EDF0] leading-relaxed">
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
