"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import { ALERT_TRANSLATIONS } from "@/lib/translations";
import { SupportedLanguage } from "@/lib/types";
import {
  speakText,
  stopSpeaking,
  SUPPORTED_LANGUAGES,
} from "@/lib/speech";
import {
  X,
  Sun,
  Waves,
  Flame,
  ArrowUpRight,
  Check,
  Building,
  Volume2,
  VolumeX,
  MessageSquare,
  Phone,
  ShieldAlert,
  MapPin,
  Compass,
} from "lucide-react";

interface ResidentAlertViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResidentAlertView({ isOpen, onClose }: ResidentAlertViewProps) {
  const { selectedAssessment, language, setLanguage } = useRisk();

  const [hasVoted, setHasVoted] = useState<"confirmed" | "normalized" | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  // Auto-play voice alert on open (Master Doc Section 3.1)
  useEffect(() => {
    if (!isOpen || !selectedAssessment || voiceMuted) return;

    const alertContent = ALERT_TRANSLATIONS[language]
      ? ALERT_TRANSLATIONS[language](selectedAssessment)
      : ALERT_TRANSLATIONS.en(selectedAssessment);

    const spokenScript = `${alertContent.header}. ${alertContent.bodyParagraph}. ${alertContent.shelterHeading}: ${alertContent.shelterDirections}.`;

    const timer = setTimeout(() => {
      speakText(spokenScript, language, {
        rate: 0.9,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }, 400);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [isOpen, selectedAssessment, language, voiceMuted]);

  if (!isOpen || !selectedAssessment) return null;

  const alertContent = ALERT_TRANSLATIONS[language]
    ? ALERT_TRANSLATIONS[language](selectedAssessment)
    : ALERT_TRANSLATIONS.en(selectedAssessment);

  const { village, risk_level, nearest_shelter, weather } = selectedAssessment;
  const isHigh = risk_level === "High";
  const isFlood = village.primary_hazard.toLowerCase().includes("flood");

  // Two-button feedback handler
  const handleVote = async (type: "confirmed" | "normalized") => {
    setHasVoted(type);
    try {
      await fetch("/api/community-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villageId: village.id,
          feedbackType: type,
        }),
      });
    } catch (e) {
      console.warn("Vote recording error:", e);
    }
  };

  const handleToggleMute = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setVoiceMuted(true);
    } else {
      setVoiceMuted(false);
      const spokenScript = `${alertContent.header}. ${alertContent.bodyParagraph}. ${alertContent.shelterHeading}: ${alertContent.shelterDirections}.`;
      speakText(spokenScript, language, {
        rate: 0.9,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // Plain language SMS message for basic phones
  const smsBody = encodeURIComponent(
    `[SANJEEVANI ALERT] ${village.name}: ${isHigh ? "RED HEAT ALERT" : "MODERATE ADVISORY"}. Go to ${nearest_shelter.name} (${nearest_shelter.distanceKm ?? 1.5} km). Helpline: 1077.`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#0A1128] border-2 border-pink/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white select-none max-h-[94vh]"
        >
          {/* Top Accessibility Bar */}
          <div className="bg-navy-card/90 px-4 py-2.5 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink font-mono">
                {language === "mr" ? "आपत्कालीन इशारा" : "Resident Emergency Alert"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Mute / Unmute */}
              <button
                onClick={handleToggleMute}
                className={`p-1.5 rounded-full border transition-colors ${
                  isSpeaking
                    ? "bg-pink text-white border-pink animate-pulse"
                    : "bg-navy text-gray-300 border-gray-700 hover:text-white"
                }`}
                title={isSpeaking ? "Mute audio" : "Play audio broadcast"}
              >
                {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-navy border border-gray-700 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="p-5 overflow-y-auto custom-scrollbar space-y-4 text-center">
            {/* 1. Giant Icon-First Alert Symbol (Could someone who can't read follow this?) */}
            <div className="flex flex-col items-center justify-center pt-2">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 ${
                  isHigh
                    ? "bg-gradient-to-tr from-red-600 to-pink border-red-400 shadow-red-500/50"
                    : "bg-gradient-to-tr from-amber-500 to-orange-500 border-amber-300 shadow-amber-500/40"
                }`}
              >
                {isFlood ? (
                  <Waves size={64} className="text-white animate-bounce" />
                ) : (
                  <Sun size={68} className="text-white animate-spin-slow" />
                )}
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black mt-3 text-white tracking-tight">
                {isHigh
                  ? language === "mr"
                    ? "🚨 तीव्र उष्णता धोका!"
                    : "🚨 SEVERE RED ALERT!"
                  : language === "mr"
                  ? "⚠️ हवामान दक्षता!"
                  : "⚠️ CLIMATE WARNING!"}
              </h1>
              <p className="text-sm font-semibold text-pink uppercase tracking-wider mt-0.5">
                {village.name} • {village.district}
              </p>
            </div>

            {/* 2. Plain Language & Voice Status Banner */}
            <div className="bg-navy-card border border-gray-800 p-3 rounded-2xl text-xs space-y-1">
              <p className="text-gray-200 font-medium text-sm leading-snug">
                {alertContent.bodyParagraph}
              </p>
              {isSpeaking && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-mono pt-1">
                  <Volume2 size={13} className="animate-bounce" />
                  <span>
                    {language === "mr"
                      ? "ध्वनी संदेश सुरू आहे..."
                      : "Speaking emergency broadcast aloud..."}
                  </span>
                </div>
              )}
            </div>

            {/* 3. One Concrete Action Card (Large Arrow & Distance - Never a list) */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-navy-card border-2 border-emerald-500/60 p-4 rounded-2xl text-left shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Compass size={14} />
                  <span>
                    {language === "mr" ? "सुरक्षित मदत केंद्र (येथे जा)" : "SAFE REFUGE CENTER"}
                  </span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  {nearest_shelter.distanceKm ?? 1.5} km
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <ArrowUpRight size={22} className="rotate-45" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm sm:text-base leading-tight">
                    {nearest_shelter.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {nearest_shelter.type} • {nearest_shelter.open_status}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-[11px]">
                <a
                  href={`tel:${nearest_shelter.contact}`}
                  className="text-emerald-300 hover:text-white flex items-center gap-1 font-bold"
                >
                  <Phone size={12} />
                  <span>{nearest_shelter.contact}</span>
                </a>
                <span className="text-gray-400 font-mono">
                  Cap: {nearest_shelter.capacity} people
                </span>
              </div>
            </div>

            {/* 4. Two-Button Feedback Loop (Master Doc Section 3.1: Large Check vs X) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-gray-400 block font-medium">
                {language === "mr"
                  ? "तुमच्या परिसरातील स्थिती कळवा (एक बटण दाबा):"
                  : "Tap your status (One Tap Confirmation):"}
              </span>

              {hasVoted ? (
                <div className="bg-emerald-950/40 border border-emerald-500/50 p-3 rounded-2xl text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2 animate-fade-in">
                  <Check size={16} />
                  <span>
                    {hasVoted === "confirmed"
                      ? language === "mr"
                        ? "धन्यवाद! तुमची सुरक्षिततेची नोंद जिल्हा कक्षाकडे झाली आहे."
                        : "Thank you! Your safety confirmation was logged."
                      : language === "mr"
                      ? "नोंद झाली: परिस्थिती सामान्य असल्याचे कळवले."
                      : "Logged: Normal conditions reported."}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Button 1: Big Green Checkmark */}
                  <button
                    onClick={() => handleVote("confirmed")}
                    className="h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 p-2 active:scale-95 transition-transform"
                  >
                    <Check size={28} className="stroke-[3]" />
                    <span className="text-xs font-bold leading-tight">
                      {language === "mr" ? "मी सुरक्षित आहे" : "I AM SAFE"}
                    </span>
                    <span className="text-[9px] text-emerald-200">
                      {language === "mr" ? "धोका जाणवतोय" : "Hazard confirmed"}
                    </span>
                  </button>

                  {/* Button 2: Big Red X */}
                  <button
                    onClick={() => handleVote("normalized")}
                    className="h-20 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 p-2 active:scale-95 transition-transform border border-gray-600"
                  >
                    <X size={28} className="stroke-[3] text-red-400" />
                    <span className="text-xs font-bold leading-tight">
                      {language === "mr" ? "सर्व ठीक आहे" : "ALL NORMAL"}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {language === "mr" ? "धोका नाही" : "No hazard"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Basic Mobile SMS Trigger (No Smartphone/Data Required) */}
            <div className="pt-2">
              <a
                href={`sms:1077?body=${smsBody}`}
                className="w-full bg-navy-card hover:bg-navy-light border border-gray-700 hover:border-pink/50 text-gray-300 py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                title="Works on any basic feature phone without mobile internet"
              >
                <MessageSquare size={14} className="text-pink" />
                <span>
                  {language === "mr"
                    ? "मोफत साधा एसएमएस (SMS) पाठवा"
                    : "Send Free Basic Phone SMS"}
                </span>
              </a>
            </div>

            {/* Language Ribbon */}
            <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] overflow-x-auto pb-1">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code as SupportedLanguage)}
                  className={`px-2 py-0.5 rounded-full transition-colors ${
                    language === l.code
                      ? "bg-pink text-white font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
