"use client";

import React from "react";
import { useRisk } from "@/context/RiskContext";
import { CheckCircle2, Users, Clock, Building, ShieldCheck } from "lucide-react";

export default function RecentOutcomesList() {
  const { recentOutcomes } = useRisk();

  if (!recentOutcomes || recentOutcomes.length === 0) {
    return (
      <div className="text-gray-500 text-[11px] p-3 text-center">
        No field outcomes logged yet in this session.
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold border-b border-gray-700/60 pb-1">
        <span>Verified Field Outcomes ({recentOutcomes.length})</span>
        <span className="text-[10px] text-emerald-400 font-mono">Feedback Loop Active</span>
      </div>

      <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
        {recentOutcomes.map((item) => (
          <div
            key={item.id}
            className="p-2 rounded bg-navy-card/60 border border-gray-800 text-[11px] space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200">
                {item.village_name}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} />
                <span>{item.outcome_status}</span>
              </span>
            </div>

            <p className="text-[10px] text-gray-400 line-clamp-1">
              {item.notes}
            </p>

            <div className="flex items-center justify-between text-[9px] text-gray-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Users size={10} className="text-[#147D78]" />
                <span>~{item.residents_protected_estimate} protected</span>
              </span>
              <span>{item.logged_by}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
