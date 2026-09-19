"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRisk } from "@/context/RiskContext";
import { X, FileText, Printer, ShieldAlert, CheckCircle, Stamp } from "lucide-react";

interface CollectorateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectorateOrderModal({ isOpen, onClose }: CollectorateOrderModalProps) {
  const { selectedAssessment } = useRisk();
  const { districtStats } = useRisk();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !selectedAssessment) return null;

  const v = selectedAssessment.village;
  const temp = Math.round(selectedAssessment.weather.max_temperature_forecast);
  const apparentTemp = Math.round(selectedAssessment.breakdown.heatwave_index?.normalized_score ? 42.7 : temp);
  const orderDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden z-10"
        >
          {/* Action Bar */}
          <div className="bg-navy px-5 py-3 text-white flex items-center justify-between border-b border-navy-light">
            <div className="flex items-center gap-2">
              <FileText className="text-pink" size={18} />
              <span className="font-heading font-bold text-sm">
                Official Administrative Directive Generator
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 text-xs bg-navy-card hover:bg-navy-light px-2.5 py-1.5 rounded border border-gray-700 text-gray-200 transition-colors"
              >
                <Printer size={13} />
                <span>Print Order</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-navy-light transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Document Body (Government Letterhead Style) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 font-serif text-xs leading-relaxed space-y-4 text-gray-800 bg-amber-50/30">
            {/* Government Crest & Header */}
            <div className="text-center border-b-2 border-gray-800 pb-3 space-y-1">
              <div className="font-sans font-bold text-xs uppercase tracking-widest text-gray-600">
                Government of {districtStats.state}
              </div>
              <h2 className="font-sans font-black text-base text-gray-900 tracking-tight">
                OFFICE OF THE DISTRICT MAGISTRATE & COLLECTOR, {districtStats.district.toUpperCase()}
              </h2>
              <div className="text-[11px] font-sans text-gray-600">
                District Disaster Management Authority (DDMA), Collectorate Compound, {districtStats.district}
              </div>
              <div className="font-mono text-[10px] text-gray-500 pt-1">
                ORDER NO: DDMA/{districtStats.district.slice(0, 4).toUpperCase()}/CLIMATE-EMG/2026/084-B • DATE: {orderDate}
              </div>
            </div>

            {/* Statutory Reference Banner */}
            <div className="bg-red-50 border-l-4 border-red-600 p-2.5 text-[11px] font-sans text-red-950 font-medium">
              ORDER UNDER SECTION 30(2)(iii) AND SECTION 34 OF THE DISASTER MANAGEMENT ACT, 2005 FOR MITIGATION OF ACUTE CLIMATE HAZARD (HEATWAVE / SEVERE DEHYDRATION STRESS)
            </div>

            {/* Background Preamble */}
            <div>
              <p>
                <strong>WHEREAS</strong>, real-time climate telemetry and meteorological risk indicators processed through the <em>Sanjeevani Early Warning System</em> indicate that <strong>{v.name}</strong> ({v.block} Tehsil) has reached a critical composite risk index of <strong>{Math.round(selectedAssessment.overall_score * 100)}/100 (HIGH SEVERITY)</strong>, with apparent heat indices exceeding <strong>{apparentTemp}°C</strong> and severe groundwater drawdown;
              </p>
              <p className="mt-1.5">
                <strong>AND WHEREAS</strong>, urgent intervention is essential to safeguard the lives of informal laborers, elderly populations, and children against fatal heatstroke and acute water deficit;
              </p>
            </div>

            {/* Operative Executive Directives */}
            <div className="space-y-2 bg-white p-3.5 rounded border border-gray-300 font-sans text-[11px]">
              <div className="font-bold text-gray-900 uppercase tracking-wide border-b pb-1 text-xs">
                NOW, THEREFORE, THE FOLLOWING DIRECTIVES ARE HEREBY PROMULGATED WITH IMMEDIATE EFFECT:
              </div>

              <ol className="list-decimal pl-4 space-y-1.5 text-gray-800">
                <li>
                  <strong>Mandatory Suspension of Outdoor Labor:</strong> All Mahatma Gandhi NREGA works, open-cast coal handling, brick kilns, and unshaded agricultural labor in <em>{v.name}</em> shall remain strictly suspended between <strong>11:30 AM and 3:30 PM</strong> daily until further notice.
                </li>
                <li>
                  <strong>Emergency Potable Water Dispatch:</strong> The Executive Engineer (MJP / Rural Water Supply) shall immediately deploy <strong>three (3) dedicated water tankers</strong> to {v.name} wards facing groundwater depletion below 18 mbgl.
                </li>
                <li>
                  <strong>Relief Shelter Pre-Activation:</strong> <em>{selectedAssessment.nearest_shelter.name}</em> shall function round-the-clock as the designated cooling center, equipped with operational air coolers, emergency ORS sachets, and paramedic staff.
                </li>
                <li>
                  <strong>Health Surveillance:</strong> ASHA workers and Taluka Health Officers shall conduct twice-daily door-to-door checkups for vulnerable elderly citizens and report any heatstroke admissions immediately to the control room helpline (1077).
                </li>
              </ol>
            </div>

            {/* Penalty Warning */}
            <p className="text-[10px] text-gray-500 italic">
              Any failure to comply with these emergency orders shall invite prosecution under Sections 51 to 60 of the Disaster Management Act, 2005, and Section 188 of the Indian Penal Code.
            </p>

            {/* Official Seal & Signature */}
            <div className="pt-4 flex items-end justify-between border-t border-gray-300 font-sans">
              {/* Official Stamp Simulation */}
              <div className="w-28 h-28 border-2 border-red-700 rounded-full flex flex-col items-center justify-center text-center p-1 text-red-700 rotate-[-8deg] opacity-85 select-none">
                <Stamp size={18} className="text-red-700" />
                <span className="text-[8px] font-black uppercase tracking-wider">DISTRICT MAGISTRATE</span>
                <span className="text-[7px] font-bold">{districtStats.district.toUpperCase()}</span>
                <span className="text-[7px] font-mono">SEAL & APPROVED</span>
              </div>

              {/* Collector's Signature */}
              <div className="text-right space-y-1">
                <div className="font-cursive text-base text-navy font-bold tracking-wider">
                  V. S. Deshpande
                </div>
                <div className="font-bold text-xs text-gray-900">
                  (Dr. V. S. Deshpande, IAS)
                </div>
                <div className="text-[10px] text-gray-600">
                  District Magistrate & Chairman,<br />
                  District Disaster Management Authority, {districtStats.district}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
