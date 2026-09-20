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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F4F7F8] font-body text-[#17212B] select-none">
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
            <section className="flex-1 lg:w-[60%] h-[48vh] lg:h-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E7EDF0]">
              <MapWrapper />
            </section>

            {/* Right Workstation: Ward Detail OR Priority Queue */}
            <section className="lg:w-[40%] h-[52vh] lg:h-full bg-[#F4F7F8] overflow-hidden flex flex-col">
              {/* Workstation View Toggle Switch */}
              <div className="px-3 py-1.5 bg-white border-b border-[#E7EDF0] flex items-center justify-between text-xs shadow-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRightView("detail")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      rightView === "detail"
                        ? "bg-[#203447] text-white font-semibold"
                        : "text-[#526575] hover:text-[#17212B] hover:bg-[#F4F7F8]"
                    }`}
                  >
                    <ShieldAlert size={12} className={rightView === "detail" ? "text-[#147D78]" : "text-[#526575]"} />
                    <span>Ward Decision Workstation</span>
                  </button>
                  <button
                    onClick={() => setRightView("queue")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      rightView === "queue"
                        ? "bg-[#203447] text-white font-semibold"
                        : "text-[#526575] hover:text-[#17212B] hover:bg-[#F4F7F8]"
                    }`}
                  >
                    <ListOrdered size={12} className={rightView === "queue" ? "text-[#C43D3D]" : "text-[#526575]"} />
                    <span>Priority Queue</span>
                  </button>
                </div>

                <span className="text-[11px] text-[#526575] font-mono font-medium">
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
            <div className="border-b border-[#E7EDF0] pb-3">
              <h2 className="text-base font-bold text-[#17212B] flex items-center gap-2">
                <Truck className="text-[#147D78]" size={18} />
                <span>Response Deployment &amp; Officer Accountability Log</span>
              </h2>
              <p className="text-xs text-[#526575] mt-0.5">
                Timestamped emergency orders, field tanker dispatches, and ground verification outcomes in {districtStats.district}.
              </p>
            </div>

            {/* Active Fleet Dispatches */}
            <div className="bg-white border border-[#E7EDF0] rounded-md p-4 space-y-3 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#203447]">
                Active Relief Logistics Units
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F4F7F8] p-3 rounded border border-[#E7EDF0] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#17212B]">Water Tanker Tanker-01</strong>
                    <span className="text-[#147D78] bg-[#EAF5F0] border border-[#BCE1D1] px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">En Route</span>
                  </div>
                  <div className="text-[#526575] text-[11px]">
                    Sector: Ballarpur High-Exposure Ward • Capacity: 10,000 L
                  </div>
                  <div className="text-[10px] text-[#526575]">Speed: 34 km/h • ETA: 12 minutes</div>
                </div>

                <div className="bg-[#F4F7F8] p-3 rounded border border-[#E7EDF0] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#17212B]">Mobile Disaster ICU Unit 04</strong>
                    <span className="text-[#B7791F] bg-[#FBF3E8] border border-[#F3D8B0] px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">Standby</span>
                  </div>
                  <div className="text-[#526575] text-[11px]">
                    Station: Sub-District Hospital Ballarpur
                  </div>
                  <div className="text-[10px] text-[#526575]">ORS resuscitation beds &amp; IV saline active</div>
                </div>
              </div>
            </div>

            {/* Logged Field Outcomes */}
            <div className="bg-white border border-[#E7EDF0] rounded-md p-4 space-y-3 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#203447]">
                Recorded Field Outcomes ({recentOutcomes.length} Entries)
              </h3>
              {recentOutcomes.length > 0 ? (
                <div className="divide-y divide-[#E7EDF0]">
                  {recentOutcomes.map((item) => (
                    <div key={item.id} className="py-2.5 text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#17212B]">{item.village_name}</strong>
                          <span className="text-[10px] bg-[#EAF5F0] text-[#147D78] border border-[#BCE1D1] px-1.5 py-0.5 rounded font-medium">
                            {item.event_type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#526575] mt-1">{item.notes}</p>
                        <div className="text-[10px] text-[#7D8C98] mt-1">
                          Logged by: <strong className="text-[#17212B]">{item.logged_by}</strong> • {item.timestamp}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[#147D78] bg-[#EAF5F0] border border-[#BCE1D1] px-2 py-0.5 rounded font-bold font-mono text-xs">
                          +{item.residents_protected_estimate} Protected
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#526575]">
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
