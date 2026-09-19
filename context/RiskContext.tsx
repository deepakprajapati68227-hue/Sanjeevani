"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  RiskAssessment,
  OutcomeRecord,
  FireHotspot,
  SupportedLanguage,
  DistrictInfo,
} from "@/lib/types";

import districtsData from "@/data/districts.json";

interface WhatIfState {
  tempDelta: number;
  precipDelta: number;
}

interface RiskContextType {
  assessments: RiskAssessment[];
  selectedVillageId: string | null;
  selectedAssessment: RiskAssessment | null;
  selectedDistrict: string;
  availableDistricts: DistrictInfo[];
  currentDistrictInfo: DistrictInfo;
  isLoading: boolean;
  error: string | null;
  activeRole: "supervisor" | "resident";
  language: SupportedLanguage;
  isAlertOpen: boolean;
  isOutcomeOpen: boolean;
  whatIf: WhatIfState;
  fireHotspots: FireHotspot[];
  showHotspotsLayer: boolean;
  recentOutcomes: OutcomeRecord[];
  districtStats: {
    district: string;
    state: string;
    region: string;
    hazard_profile: string;
    centerLat: number;
    centerLon: number;
    zoom: number;
    assessed_count: number;
    high_risk_count: number;
    moderate_risk_count: number;
    low_risk_count: number;
    average_risk_score: number;
    total_population_at_high_risk: number;
    data_source_live: boolean;
  };

  // Actions
  setSelectedDistrict: (districtId: string) => void;
  selectVillage: (id: string) => void;
  setActiveRole: (role: "supervisor" | "resident") => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setIsAlertOpen: (open: boolean) => void;
  setIsOutcomeOpen: (open: boolean) => void;
  updateWhatIf: (tempDelta: number, precipDelta: number) => void;
  resetWhatIf: () => void;
  toggleHotspotsLayer: () => void;
  logNewOutcome: (data: {
    event_type: OutcomeRecord["event_type"];
    outcome_status: OutcomeRecord["outcome_status"];
    residents_protected_estimate: number;
    notes: string;
    logged_by?: string;
  }) => Promise<boolean>;
  refreshRiskData: () => Promise<void>;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

const typedDistricts = districtsData as DistrictInfo[];

export function RiskProvider({ children }: { children: ReactNode }) {
  const [selectedDistrict, setSelectedDistrictState] = useState<string>("chandrapur");
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>("v-ballarpur");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"supervisor" | "resident">("supervisor");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isOutcomeOpen, setIsOutcomeOpen] = useState<boolean>(false);
  const [whatIf, setWhatIf] = useState<WhatIfState>({ tempDelta: 0, precipDelta: 0 });
  const [fireHotspots, setFireHotspots] = useState<FireHotspot[]>([]);
  const [showHotspotsLayer, setShowHotspotsLayer] = useState<boolean>(true);
  const [recentOutcomes, setRecentOutcomes] = useState<OutcomeRecord[]>([]);
  
  const currentDistrictInfo =
    typedDistricts.find((d) => d.id === selectedDistrict) || typedDistricts[0];

  const [districtStats, setDistrictStats] = useState({
    district: currentDistrictInfo.name,
    state: currentDistrictInfo.state,
    region: currentDistrictInfo.region,
    hazard_profile: currentDistrictInfo.hazard_profile,
    centerLat: currentDistrictInfo.centerLat,
    centerLon: currentDistrictInfo.centerLon,
    zoom: currentDistrictInfo.zoom,
    assessed_count: 12,
    high_risk_count: 2,
    moderate_risk_count: 5,
    low_risk_count: 5,
    average_risk_score: 0.54,
    total_population_at_high_risk: 153650,
    data_source_live: true,
  });

  const fetchRiskData = useCallback(
    async (
      district = selectedDistrict,
      tempD = whatIf.tempDelta,
      precipD = whatIf.precipDelta
    ) => {
      try {
        setIsLoading(true);
        const url = `/api/risk?district=${district}&tempDelta=${tempD}&precipDelta=${precipD}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load risk calculations");
        const data = await res.json();
        setAssessments(data.assessments);
        
        // Auto-select first village of new district if current selection is not in district
        if (data.assessments && data.assessments.length > 0) {
          const currentInNew = data.assessments.find((a: RiskAssessment) => a.village.id === selectedVillageId);
          if (!currentInNew) {
            setSelectedVillageId(data.assessments[0].village.id);
          }
        }

        setDistrictStats({
          district: data.district || currentDistrictInfo.name,
          state: data.state || currentDistrictInfo.state,
          region: data.region || currentDistrictInfo.region,
          hazard_profile: data.hazard_profile || currentDistrictInfo.hazard_profile,
          centerLat: data.centerLat || currentDistrictInfo.centerLat,
          centerLon: data.centerLon || currentDistrictInfo.centerLon,
          zoom: data.zoom || currentDistrictInfo.zoom,
          assessed_count: data.assessed_count,
          high_risk_count: data.high_risk_count,
          moderate_risk_count: data.moderate_risk_count,
          low_risk_count: data.low_risk_count,
          average_risk_score: data.average_risk_score,
          total_population_at_high_risk: data.total_population_at_high_risk,
          data_source_live: data.data_source_live,
        });
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        setError("Unable to compute risk scores. Network fallback active.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDistrict, whatIf.tempDelta, whatIf.precipDelta, selectedVillageId, currentDistrictInfo]
  );

  const setSelectedDistrict = (distId: string) => {
    const target = typedDistricts.find((d) => d.id === distId);
    if (!target) return;
    setSelectedDistrictState(distId);
    if (target.default_language) {
      setLanguage(target.default_language);
    }
    fetchRiskData(distId, whatIf.tempDelta, whatIf.precipDelta);
  };

  // Initial load
  useEffect(() => {
    fetchRiskData();

    // Fetch fire hotspots
    fetch("/api/fire-hotspots")
      .then((r) => r.json())
      .then((data) => {
        if (data.hotspots) setFireHotspots(data.hotspots);
      })
      .catch((e) => console.warn("Hotspots load fallback:", e));

    // Fetch outcomes
    fetch("/api/outcomes")
      .then((r) => r.json())
      .then((data) => {
        if (data.outcomes) setRecentOutcomes(data.outcomes);
      })
      .catch((e) => console.warn("Outcomes load fallback:", e));
  }, [fetchRiskData]);

  const selectVillage = (id: string) => {
    setSelectedVillageId(id);
  };

  const updateWhatIf = (tempDelta: number, precipDelta: number) => {
    setWhatIf({ tempDelta, precipDelta });
    fetchRiskData(selectedDistrict, tempDelta, precipDelta);
  };

  const resetWhatIf = () => {
    setWhatIf({ tempDelta: 0, precipDelta: 0 });
    fetchRiskData(selectedDistrict, 0, 0);
  };

  const toggleHotspotsLayer = () => {
    setShowHotspotsLayer((prev) => !prev);
  };

  const logNewOutcome = async (data: {
    event_type: OutcomeRecord["event_type"];
    outcome_status: OutcomeRecord["outcome_status"];
    residents_protected_estimate: number;
    notes: string;
    logged_by?: string;
  }): Promise<boolean> => {
    const selected = assessments.find((a) => a.village.id === selectedVillageId);
    if (!selected) return false;

    try {
      const res = await fetch("/api/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          village_id: selected.village.id,
          village_name: selected.village.name,
          ...data,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setRecentOutcomes(json.outcomes);
        // Refresh risk data to show empirical recalibration badge
        await fetchRiskData(selectedDistrict, whatIf.tempDelta, whatIf.precipDelta);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to log outcome:", err);
      return false;
    }
  };

  const selectedAssessment =
    assessments.find((a) => a.village.id === selectedVillageId) ||
    assessments[0] ||
    null;

  return (
    <RiskContext.Provider
      value={{
        assessments,
        selectedVillageId,
        selectedAssessment,
        isLoading,
        error,
        activeRole,
        language,
        isAlertOpen,
        isOutcomeOpen,
        whatIf,
        fireHotspots,
        showHotspotsLayer,
        recentOutcomes,
        districtStats,
        selectedDistrict,
        availableDistricts: typedDistricts,
        currentDistrictInfo,
        setSelectedDistrict,
        selectVillage,
        setActiveRole,
        setLanguage,
        setIsAlertOpen,
        setIsOutcomeOpen,
        updateWhatIf,
        resetWhatIf,
        toggleHotspotsLayer,
        logNewOutcome,
        refreshRiskData: fetchRiskData,
      }}
    >
      {children}
    </RiskContext.Provider>
  );
}

export function useRisk() {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error("useRisk must be used within a RiskProvider");
  }
  return context;
}
