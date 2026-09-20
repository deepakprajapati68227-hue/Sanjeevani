"use client";

import React, { useState } from "react";
import Header from "@/components/Common/Header";
import MetricRibbon from "@/components/DistrictSummary/MetricRibbon";
import MapWrapper from "@/components/Map/MapWrapper";
import VillageDetail from "@/components/RiskPanel/VillageDetail";
import PhoneMockup from "@/components/AlertPreview/PhoneMockup";
import OutcomeModal from "@/components/OutcomeLogger/OutcomeModal";
import WhatIfSimulator from "@/components/ScenarioSlider/WhatIfSimulator";
import ResidentAlertView from "@/components/ResidentView/ResidentAlertView";
import { useRisk } from "@/context/RiskContext";
import { Smartphone, Activity, Volume2 } from "lucide-react";

export default function DashboardPage() {
  const { activeRole, setActiveRole, selectedAssessment, setIsAlertOpen } = useRisk();
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-navy font-body text-white select-none">
      {/* Top Header */}
      <Header
        onToggleWhatIf={() => setIsWhatIfOpen((prev) => !prev)}
        isWhatIfOpen={isWhatIfOpen}
      />

      {/* District KPI Summary Ribbon */}
      <MetricRibbon />

      {/* Main Asymmetric Workstation (65% Map / 35% Detail Panel) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left 65% Interactive Cartography Section */}
        <section className="flex-1 lg:w-[65%] h-[50vh] lg:h-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-navy-light/80">
          <MapWrapper />

          {/* Floating What-If Drawer */}
          <WhatIfSimulator
            isOpen={isWhatIfOpen}
            onClose={() => setIsWhatIfOpen(false)}
          />
        </section>

        {/* Right 35% Village Risk & Action Detail Panel */}
        <section className="lg:w-[35%] h-[50vh] lg:h-full bg-navy overflow-hidden flex flex-col">
          {activeRole === "resident" ? (
            /* Direct Resident Mode View */
            <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-[#0B141A] text-white">
              <div className="w-14 h-14 rounded-full bg-[#00A884]/20 border border-[#00A884] flex items-center justify-center text-[#00A884] mb-4">
                <Smartphone size={28} />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1">
                Resident Simulation Mode Active
              </h3>
              <p className="text-xs text-gray-400 max-w-[280px] mb-4 leading-relaxed">
                Currently displaying what an alert recipient in{" "}
                <strong className="text-pink">
                  {selectedAssessment?.village.name || "selected ward"}
                </strong>{" "}
                receives via simulated WhatsApp broadcast or icon-first audio warning.
              </p>
              <div className="flex flex-col gap-2 w-full max-w-[280px]">
                <button
                  onClick={() => setIsResidentModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-btn shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Volume2 size={15} />
                  <span>Icon-First Audio Alert & SMS</span>
                </button>
                <button
                  onClick={() => setIsAlertOpen(true)}
                  className="bg-[#00A884] hover:bg-[#029070] text-white text-xs font-semibold px-4 py-2.5 rounded-btn shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Smartphone size={15} />
                  <span>Open WhatsApp Broadcast</span>
                </button>
              </div>
              <button
                onClick={() => setActiveRole("supervisor")}
                className="mt-4 text-[11px] text-gray-400 hover:text-gray-200 underline"
              >
                Return to Supervisor Dashboard
              </button>
            </div>
          ) : (
            /* Analytical Supervisor Dashboard Panel */
            <VillageDetail />
          )}
        </section>
      </main>

      {/* Global Modals */}
      <PhoneMockup />
      <OutcomeModal />
      <ResidentAlertView
        isOpen={isResidentModalOpen}
        onClose={() => setIsResidentModalOpen(false)}
      />
    </div>
  );
}
