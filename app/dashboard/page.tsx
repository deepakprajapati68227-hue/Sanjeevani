"use client";

import React, { useState } from "react";
import Header, { OfficerTab } from "@/components/Common/Header";
import MetricRibbon from "@/components/DistrictSummary/MetricRibbon";
import MapWrapper from "@/components/Map/MapWrapper";
import VillageDetail from "@/components/RiskPanel/VillageDetail";
import PriorityQueue from "@/components/RiskPanel/PriorityQueue";
import PhoneMockup from "@/components/AlertPreview/PhoneMockup";
import OutcomeModal from "@/components/OutcomeLogger/OutcomeModal";
import WhatIfSimulator from "@/components/ScenarioSlider/WhatIfSimulator";
import { useRisk } from "@/context/RiskContext";
import { ListOrdered, ShieldAlert, Truck, CheckCircle2, Clock, Users } from "lucide-react";

export default function DashboardPage() {
  const { selectedAssessment, recentOutcomes, districtStats } = useRisk();
  const [activeTab, setActiveTab] = useState<OfficerTab>("overview");
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [rightView, setRightView] = useState<"detail" | "queue">("detail");

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B1220] font-body text-[#F5F7FA] select-none">
      {/* Top Header with 2-Row Navigation & Tools */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        isWhatIfActive={isWhatIfOpen}
      />

      {/* District KPI Summary Ribbon (4 Cards Max + Status Banner) */}
      <MetricRibbon />

      {/* Main Workstation Layout Based on Active Tab */}
      <main className="flex-1 overflow-hidden relative">
        {/* Tab 1: Overview (60% Map / 40% Workstation Panel) */}
        {activeTab === "overview" && (
          <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">
            {/* Left Cartography Section */}
            <section className="flex-1 lg:w-[60%] h-[48vh] lg:h-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1E344D]">
              <MapWrapper />
            </section>

            {/* Right Workstation: Ward Detail OR Priority Queue */}
            <section className="lg:w-[40%] h-[52vh] lg:h-full bg-[#0B1220] overflow-hidden flex flex-col">
              {/* Workstation View Toggle Switch */}
              <div className="px-3 py-1.5 bg-[#0E1726] border-b border-[#1E344D] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRightView("detail")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      rightView === "detail"
                        ? "bg-[#1E344D] text-white font-semibold"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <ShieldAlert size={12} className="text-[#4CC9F0]" />
                    <span>Ward Decision Workstation</span>
                  </button>
                  <button
                    onClick={() => setRightView("queue")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      rightView === "queue"
                        ? "bg-[#1E344D] text-white font-semibold"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <ListOrdered size={12} className="text-[#E5484D]" />
                    <span>Priority Queue</span>
                  </button>
                </div>

                <span className="text-[10px] text-[#94A3B8] font-mono">
                  {selectedAssessment ? selectedAssessment.village.name : "Select Ward"}
                </span>
              </div>

              {/* View Content */}
              <div className="flex-1 overflow-hidden">
                {rightView === "detail" ? (
                  <VillageDetail />
                ) : (
                  <PriorityQueue
                    onSelectWard={() => setRightView("detail")}
                  />
                )}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Full Map View */}
        {activeTab === "map" && (
          <div className="h-full w-full relative">
            <MapWrapper />
          </div>
        )}

        {/* Tab 3: Priority Zones Full Queue */}
        {activeTab === "priority" && (
          <div className="h-full w-full max-w-5xl mx-auto p-4 sm:p-6 overflow-hidden flex flex-col">
            <PriorityQueue
              onSelectWard={() => {
                setActiveTab("overview");
                setRightView("detail");
              }}
            />
          </div>
        )}

        {/* Tab 4: Response Fleet & Audit Actions Timeline */}
        {activeTab === "actions" && (
          <div className="h-full w-full max-w-4xl mx-auto p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4">
            <div className="border-b border-[#1E344D] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="text-[#16B8A6]" size={18} />
                <span>Response Deployment & Officer Accountability Log</span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Timestamped emergency orders, field tanker dispatches, and ground verification outcomes in {districtStats.district}.
              </p>
            </div>

            {/* Active Fleet Dispatches */}
            <div className="bg-[#12233A] border border-[#2C4663] rounded-md p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#4CC9F0]">
                Active Relief Logistics Units
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0E1726] p-3 rounded border border-[#1E344D] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-white">Water Tanker Tanker-01</strong>
                    <span className="text-[#16B8A6] font-mono text-[10px] font-bold">En Route</span>
                  </div>
                  <div className="text-[#94A3B8] text-[11px]">
                    Sector: Ballarpur High-Exposure Ward • Capacity: 10,000 L
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Speed: 34 km/h • ETA: 12 minutes</div>
                </div>

                <div className="bg-[#0E1726] p-3 rounded border border-[#1E344D] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-white">Mobile Disaster ICU Unit 04</strong>
                    <span className="text-[#F5B942] font-mono text-[10px] font-bold">Standby</span>
                  </div>
                  <div className="text-[#94A3B8] text-[11px]">
                    Station: Sub-District Hospital Ballarpur
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">ORS resuscitation beds & IV saline active</div>
                </div>
              </div>
            </div>

            {/* Logged Field Outcomes */}
            <div className="bg-[#12233A] border border-[#2C4663] rounded-md p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#16B8A6]">
                Recorded Field Outcomes ({recentOutcomes.length} Entries)
              </h3>
              {recentOutcomes.length > 0 ? (
                <div className="divide-y divide-[#1E344D]">
                  {recentOutcomes.map((item) => (
                    <div key={item.id} className="py-2.5 text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{item.village_name}</strong>
                          <span className="text-[10px] bg-[#16B8A6]/20 text-[#16B8A6] px-1.5 py-0.2 rounded">
                            {item.event_type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-1">{item.notes}</p>
                        <div className="text-[10px] text-[#94A3B8] mt-1">
                          Logged by: <strong className="text-gray-200">{item.logged_by}</strong> • {item.timestamp}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[#16B8A6] font-bold font-mono">
                          +{item.residents_protected_estimate} Protected
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8]">
                  No field outcomes logged yet in active session. Click &quot;Log Field Outcome&quot; from any ward to record actions.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Floating What-If Drawer */}
        <WhatIfSimulator
          isOpen={isWhatIfOpen}
          onClose={() => setIsWhatIfOpen(false)}
        />
      </main>

      {/* Global Modals */}
      <PhoneMockup />
      <OutcomeModal />
    </div>
  );
}
