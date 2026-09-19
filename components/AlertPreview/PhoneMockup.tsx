"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import { ALERT_TRANSLATIONS } from "@/lib/translations";
import {
  X,
  ShieldCheck,
  MapPin,
  Building,
  Phone,
  CheckCheck,
  BatteryCharging,
  Wifi,
  Signal,
  Play,
  Pause,
  Mic,
} from "lucide-react";

export default function PhoneMockup() {
  const {
    isAlertOpen,
    setIsAlertOpen,
    selectedAssessment,
    language,
    setLanguage,
  } = useRisk();

  const [isVoicePlaying, setIsVoicePlaying] = React.useState(false);

  if (!isAlertOpen || !selectedAssessment) return null;

  const alertContent = ALERT_TRANSLATIONS[language](selectedAssessment);
  const isHigh = selectedAssessment.risk_level === "High";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-2 sm:p-6 bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={() => setIsAlertOpen(false)}
        />

        {/* Sliding Phone Frame */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-[390px] h-[720px] max-h-[92vh] bg-[#111B21] rounded-[36px] border-[8px] border-[#222E35] shadow-2xl flex flex-col overflow-hidden text-white select-none"
        >
          {/* Close button at top right of frame */}
          <button
            onClick={() => setIsAlertOpen(false)}
            className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-black/80 text-gray-300 p-1.5 rounded-full transition-colors"
          >
            <X size={16} />
          </button>

          {/* Smartphone Hardware Notch & Status Bar */}
          <div className="h-8 bg-[#1F2C34] flex items-center justify-between px-6 text-[11px] font-mono text-gray-300 select-none">
            <span>10:45 AM</span>
            {/* Camera Speaker Notch */}
            <div className="w-20 h-4 bg-[#111B21] rounded-b-xl flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-black/80" />
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Signal size={12} />
              <Wifi size={12} />
              <BatteryCharging size={13} className="text-emerald-400" />
            </div>
          </div>

          {/* WhatsApp / Messaging Header */}
          <div className="bg-[#1F2C34] px-4 py-2.5 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#EC1E63] flex items-center justify-center text-white font-bold text-sm shadow">
                स
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  <span>{alertContent.senderTitle}</span>
                  <ShieldCheck size={14} className="text-[#00A884]" />
                </div>
                <div className="text-[10px] text-gray-400">
                  {alertContent.senderBadge} • Official
                </div>
              </div>
            </div>

            {/* Language Pill Switcher within the Phone View */}
            <div className="flex items-center bg-[#111B21] border border-gray-700 p-0.5 rounded-full text-[10px] font-bold">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === "en" ? "bg-[#00A884] text-white" : "text-gray-400"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === "mr" ? "bg-[#00A884] text-white" : "text-gray-400"
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          {/* Chat Canvas / Messages Area */}
          <div className="flex-1 bg-[#0B141A] p-3.5 overflow-y-auto custom-scrollbar space-y-3 relative">
            {/* WhatsApp Wallpaper Texture Effect */}
            <div className="text-center my-1">
              <span className="bg-[#182229] text-gray-400 text-[10px] px-3 py-1 rounded-md font-mono">
                TODAY • EMERGENCY BROADCAST
              </span>
            </div>

            {/* Official Alert Chat Bubble */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`rounded-bubble p-3.5 text-xs shadow-md border ${
                isHigh
                  ? "bg-[#20181A] border-red-500/40 text-gray-100"
                  : "bg-[#182522] border-amber-500/40 text-gray-100"
              }`}
            >
              {/* Alert Header Banner */}
              <div
                className={`font-heading font-bold text-xs pb-1.5 mb-2 border-b flex items-center justify-between ${
                  isHigh
                    ? "border-red-500/30 text-red-400"
                    : "border-amber-500/30 text-amber-400"
                }`}
              >
                <span>{alertContent.header}</span>
              </div>

              {/* Hazard Stats Strip */}
              <div className="bg-black/40 px-2.5 py-1.5 rounded font-mono text-[11px] text-gray-200 mb-2.5 flex items-center justify-between border border-gray-800">
                <span>{alertContent.hazardBanner}</span>
              </div>

              {/* Body Text */}
              <p className="text-[11px] text-gray-200 mb-2 leading-relaxed whitespace-pre-line">
                {alertContent.bodyParagraph}
              </p>

              {/* Bulleted Action Directives */}
              <div className="bg-black/30 p-2.5 rounded border border-gray-800/80 mb-3 text-[11px] text-gray-300 whitespace-pre-line leading-relaxed font-sans">
                {alertContent.criticalAdvisory}
              </div>

              {/* Shelter Direction Box */}
              <div className="bg-[#111B21] p-2.5 rounded-lg border border-[#00A884]/40 text-[11px] text-gray-200 space-y-1 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-[#00A884] text-xs">
                  <Building size={14} />
                  <span>{alertContent.shelterHeading}</span>
                </div>
                <p className="whitespace-pre-line text-gray-300 text-[10px] leading-tight">
                  {alertContent.shelterDirections}
                </p>
              </div>

              {/* Emergency Helpline */}
              <div className="text-[10px] text-gray-400 font-medium">
                {alertContent.helplineNotice}
              </div>

              {/* Read receipt tick */}
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-gray-400 font-mono">
                <span>10:45 AM</span>
                <CheckCheck size={13} className="text-[#53BDEB]" />
              </div>
            </motion.div>

            {/* WhatsApp Audio Voice Note Simulation (The Empathy Differentiator for Low-Literacy Rural Communities) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="rounded-bubble p-3 bg-[#1F2C34] border border-[#00A884]/40 text-xs shadow-md space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-gray-700/50 pb-1">
                <span className="flex items-center gap-1 text-[#00A884] font-semibold">
                  <Mic size={12} />
                  <span>{language === "mr" ? "अधिकृत स्थानिक ध्वनी संदेश" : "Official Audio Voice Broadcast"}</span>
                </span>
                <span>ASHA Health Desk</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsVoicePlaying((p) => !p)}
                  className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#029070] text-white flex items-center justify-center flex-shrink-0 shadow transition-transform active:scale-95"
                >
                  {isVoicePlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                {/* Simulated Audio Waveform Bar */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-0.5 h-6">
                    {[12, 18, 8, 22, 16, 24, 10, 14, 20, 26, 12, 18, 24, 15, 9, 21, 13, 20, 16, 10].map(
                      (h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isVoicePlaying ? "bg-[#00A884] animate-pulse" : "bg-gray-500"
                          }`}
                          style={{
                            height: isVoicePlaying ? `${Math.min(24, Math.max(6, (h * (i % 3 + 1)) % 24))}px` : `${h / 1.6}px`,
                          }}
                        />
                      )
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                    <span>{isVoicePlaying ? "0:14 / 0:28 (Playing...)" : "0:28 • Voice Bulletin"}</span>
                    <span className="text-[#53BDEB] flex items-center gap-0.5">
                      <CheckCheck size={11} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-300 italic bg-black/25 p-1.5 rounded">
                {language === "mr"
                  ? '🔊 "लक्ष द्या: आज दुपारी १२ ते ४ दरम्यान उन्हात काम थांबवा. महापालिकेचे शीतकरण केंद्र खुले आहे."'
                  : '🔊 "Alert: Halt outdoor work between 12-4 PM today. Municipal cooling hall open with free ORS."'}
              </div>
            </motion.div>

            {/* Quick Action Button for Resident Simulation */}
            <div className="bg-[#182229] p-3 rounded-card text-center space-y-2">
              <span className="text-[11px] text-gray-400 block">
                Resident Quick Action
              </span>
              <a
                href={`tel:${selectedAssessment.nearest_shelter.contact}`}
                className="w-full bg-[#00A884] hover:bg-[#029070] text-white font-bold py-2 rounded-btn text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone size={14} />
                <span>Call Emergency Coordinator</span>
              </a>
            </div>
          </div>

          {/* Bottom Virtual Android Bar */}
          <div className="h-5 bg-[#111B21] flex items-center justify-center">
            <div className="w-28 h-1 bg-gray-600 rounded-full" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
