"use client";

import React, { useState } from "react";
import { useRisk } from "@/context/RiskContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardCheck, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { OutcomeRecord } from "@/lib/types";

export default function OutcomeModal() {
  const { isOutcomeOpen, setIsOutcomeOpen, selectedAssessment, logNewOutcome } =
    useRisk();

  const [eventType, setEventType] =
    useState<OutcomeRecord["event_type"]>("Heat Advisory Dispatched");
  const [outcomeStatus, setOutcomeStatus] =
    useState<OutcomeRecord["outcome_status"]>("Alert acted on successfully");
  const [protectedEstimate, setProtectedEstimate] = useState<number>(180);
  const [notes, setNotes] = useState<string>(
    "Gram Panchayat shifted agricultural shifts to early morning hours; drinking water kiosks operational."
  );
  const [supervisorName, setSupervisorName] = useState<string>("S. Patil (Field Officer)");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOutcomeOpen || !selectedAssessment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ok = await logNewOutcome({
      event_type: eventType,
      outcome_status: outcomeStatus,
      residents_protected_estimate: protectedEstimate,
      notes,
      logged_by: supervisorName,
    });

    setIsSubmitting(false);
    if (ok) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOutcomeOpen(false);
      }, 1200);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={() => !isSubmitting && setIsOutcomeOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-lg bg-navy-card border border-gray-700 rounded-card shadow-2xl p-5 text-white"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOutcomeOpen(false)}
            disabled={isSubmitting}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg"
              >
                <CheckCircle2 size={36} />
              </motion.div>
              <h3 className="font-heading font-bold text-lg text-white">
                Field Outcome Recorded
              </h3>
              <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                Ground truth recorded for <strong className="text-white">{selectedAssessment.village.name}</strong>. The system has calibrated the local vulnerability profile.
              </p>
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="flex items-center gap-2.5 mb-3 border-b border-gray-700/60 pb-3">
                <div className="p-2 rounded bg-navy border border-pink/40 text-pink">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Log Field Response Outcome
                  </h3>
                  <p className="text-xs text-gray-400">
                    Target: <strong className="text-pink">{selectedAssessment.village.name}</strong> ({selectedAssessment.village.block} Block)
                  </p>
                </div>
              </div>

              {/* Outcome Feedback Explanation */}
              <div className="bg-navy/80 border border-emerald-700/40 p-2.5 rounded text-[11px] text-emerald-300 mb-4 flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Closing the Loop:</strong> Logging field outcomes validates predictive alerts and empirically refines the risk model for subsequent forecasting cycles.
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Event / Advisory Dispatched
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full bg-navy border border-gray-700 rounded-btn p-2 text-white focus:outline-none focus:border-pink text-xs"
                  >
                    <option value="Heat Advisory Dispatched">Heat Advisory Dispatched</option>
                    <option value="Relief Shelter Activated">Relief Shelter Activated</option>
                    <option value="Water Tanker Deployed">Water Tanker Deployed</option>
                    <option value="Flood Evacuation Warning">Flood Evacuation Warning</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Action Result
                    </label>
                    <select
                      value={outcomeStatus}
                      onChange={(e) => setOutcomeStatus(e.target.value as any)}
                      className="w-full bg-navy border border-gray-700 rounded-btn p-2 text-white focus:outline-none focus:border-pink text-xs"
                    >
                      <option value="Alert acted on successfully">Alert acted on successfully</option>
                      <option value="Partial false alarm / Condition normalized">Partial false alarm / Condition normalized</option>
                      <option value="Escalated to medical emergency">Escalated to medical emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Citizens Protected (Est.)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={protectedEstimate}
                      onChange={(e) => setProtectedEstimate(Number(e.target.value))}
                      className="w-full bg-navy border border-gray-700 rounded-btn p-2 text-white focus:outline-none focus:border-pink text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Field Notes & Observations
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-btn p-2 text-white focus:outline-none focus:border-pink text-xs"
                    placeholder="Enter observations on shelter occupancy, water distribution, or symptoms..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Reporting Official
                  </label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="w-full bg-navy border border-gray-700 rounded-btn p-2 text-white focus:outline-none focus:border-pink text-xs"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOutcomeOpen(false)}
                    disabled={isSubmitting}
                    className="px-3 py-2 rounded-btn border border-gray-700 text-gray-300 hover:text-white text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pink hover:bg-pink-hover text-white font-semibold px-4 py-2 rounded-btn text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Submitting to Engine...</span>
                      </>
                    ) : (
                      <>
                        <ClipboardCheck size={14} />
                        <span>Confirm & Recalibrate Model</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
