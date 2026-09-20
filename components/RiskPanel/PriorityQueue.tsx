"use client";

import React, { useState } from "react";
import { useRisk } from "@/context/RiskContext";
import { RiskAssessment } from "@/lib/types";
import { getRiskState, formatPopulation, formatTimeToCritical } from "@/lib/formatters";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Filter,
  Users,
  Clock,
  ThumbsUp,
  Flame,
} from "lucide-react";

interface PriorityQueueProps {
  onSelectWard?: (assessment: RiskAssessment) => void;
}

export default function PriorityQueue({ onSelectWard }: PriorityQueueProps) {
  const { assessments, selectedAssessment, selectVillage } = useRisk();
  const [filter, setFilter] = useState<"all" | "critical" | "watch" | "stable">("all");

  const sortedAssessments = [...assessments].sort((a, b) => b.overall_score - a.overall_score);

  const filteredAssessments = sortedAssessments.filter((a) => {
    if (filter === "critical") return a.overall_score >= 0.70;
    if (filter === "watch") return a.overall_score >= 0.45 && a.overall_score < 0.70;
    if (filter === "stable") return a.overall_score < 0.45;
    return true;
  });

  const handleSelect = (assessment: RiskAssessment) => {
    selectVillage(assessment.village.id);
    onSelectWard?.(assessment);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-[#E7EDF0] text-[#17212B]">
      {/* Header & Filter Bar */}
      <div className="p-3 border-b border-[#E7EDF0] bg-[#F4F7F8] flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#17212B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C43D3D]"></span>
            <span>Priority Queue ({assessments.length} Monitored Wards)</span>
          </h3>
          <p className="text-[10px] text-[#526575]">
            Ranked by composite vulnerability & climate velocity
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#E7EDF0] text-[10px]">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filter === "all" ? "bg-[#203447] text-white" : "text-[#526575] hover:text-[#17212B]"
            }`}
          >
            All ({assessments.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filter === "critical" ? "bg-[#C43D3D] text-white font-bold" : "text-[#C43D3D] hover:bg-[#FCEBEB]"
            }`}
          >
            Critical ({assessments.filter((a) => a.overall_score >= 0.70).length})
          </button>
          <button
            onClick={() => setFilter("watch")}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filter === "watch" ? "bg-[#B7791F] text-white font-bold" : "text-[#B7791F] hover:bg-[#FBF3E8]"
            }`}
          >
            Watch ({assessments.filter((a) => a.overall_score >= 0.45 && a.overall_score < 0.70).length})
          </button>
          <button
            onClick={() => setFilter("stable")}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filter === "stable" ? "bg-[#2E8B68] text-white font-bold" : "text-[#2E8B68] hover:bg-[#EAF5F0]"
            }`}
          >
            Stable ({assessments.filter((a) => a.overall_score < 0.45).length})
          </button>
        </div>
      </div>

      {/* Priority Queue Rows List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#E7EDF0]">
        {filteredAssessments.map((item, idx) => {
          const isSelected = selectedAssessment?.village.id === item.village.id;
          const riskState = getRiskState(item.overall_score);
          const timeVelocity = formatTimeToCritical(
            item.time_to_critical_days,
            item.time_to_critical_hours,
            item.time_to_critical_driver
          );

          return (
            <div
              key={item.village.id}
              onClick={() => handleSelect(item)}
              className={`p-3 cursor-pointer transition-all hover:bg-[#F4F7F8] flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-[#EAF5F0]/60 border-l-4 border-l-[#147D78]"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              {/* Left Info: Rank + Name + Driver */}
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="font-mono text-xs text-[#7D8C98] font-bold w-4 text-center mt-0.5">
                  #{idx + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#17212B] tracking-tight truncate">
                      {item.village.name}
                    </h4>
                    <span className="text-[10px] text-[#526575]">
                      ({item.village.block} Block)
                    </span>
                  </div>

                  {/* Primary Hazard Driver */}
                  <div className="text-[11px] text-[#526575] flex items-center gap-1.5 mt-0.5">
                    <span>Threat: <strong className="text-[#17212B]">{item.primary_risk_driver}</strong></span>
                    {item.is_compound_risk && (
                      <span className="bg-[#635B8F]/15 text-[#635B8F] border border-[#635B8F]/30 text-[9px] px-1 rounded font-bold uppercase">
                        Compound
                      </span>
                    )}
                  </div>

                  {/* Decision Context Bar */}
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#526575]">
                    <span className="flex items-center gap-1">
                      <Users size={11} className="text-[#2F6F9F]" />
                      <span>{formatPopulation(item.village.population)} pop</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className={timeVelocity.urgency === "critical" ? "text-[#C43D3D]" : "text-[#B7791F]"} />
                      <span className={timeVelocity.urgency === "critical" ? "text-[#C43D3D] font-semibold" : ""}>
                        {timeVelocity.display}
                      </span>
                    </span>
                    {item.community_verification && (
                      <span className="hidden sm:flex items-center gap-1 text-[#2E8B68]">
                        <ThumbsUp size={10} />
                        <span>{item.community_verification.verified_percentage}% Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Score & Badge */}
              <div className="flex flex-col items-end flex-shrink-0">
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${riskState.badgeClass}`}
                >
                  {riskState.label}
                </div>
                <div className="font-mono text-xs font-bold text-[#17212B] mt-1">
                  {riskState.scoreDisplay} / 100
                </div>
                <button
                  className="mt-1 text-[10px] text-[#147D78] hover:text-[#0E625E] font-medium flex items-center gap-0.5"
                >
                  <span>Inspect</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredAssessments.length === 0 && (
          <div className="p-8 text-center text-xs text-[#526575]">
            No wards match the selected &quot;{filter}&quot; filter in this district.
          </div>
        )}
      </div>
    </div>
  );
}
