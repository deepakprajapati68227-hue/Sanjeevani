import { RiskAssessment } from "./types";
import { RISK_THRESHOLDS } from "./riskWeights";

/**
 * Format time-to-critical velocity string safely without undefined, NaN, or unit errors.
 * Addresses Audit finding 2.2 / Bug report on "5.1d (undefinedh) until Red".
 */
export function formatTimeToCritical(
  days?: number,
  hours?: number,
  driver?: string
): { display: string; detail?: string; urgency: "critical" | "warning" | "stable" } {
  if (days === undefined && hours === undefined) {
    return {
      display: "Risk trajectory stable",
      detail: "No critical threshold breach projected within 7 days",
      urgency: "stable",
    };
  }

  // If days is 0 or less than 1, or hours < 24
  if (days === 0 || (hours !== undefined && hours <= 24 && (days === undefined || days < 1))) {
    const hrs = hours && !isNaN(hours) ? `${hours}h` : "< 24h";
    return {
      display: `Critical threshold imminent (${hrs})`,
      detail: driver || "Rapid climate escalation window expected today",
      urgency: "critical",
    };
  }

  // Multi-day projection
  if (days !== undefined && !isNaN(days)) {
    const formattedDays = Number.isInteger(days) ? `${days} days` : `${days.toFixed(1)} days`;
    const hoursPart = hours !== undefined && !isNaN(hours) && hours > 0 ? ` (${Math.round(hours)}h)` : "";
    return {
      display: `~${formattedDays}${hoursPart} to critical threshold`,
      detail: driver || "Aquifer reserve extraction trajectory",
      urgency: days <= 3 ? "critical" : "warning",
    };
  }

  // Hours only
  if (hours !== undefined && !isNaN(hours)) {
    return {
      display: `~${Math.round(hours)} hours to peak window`,
      detail: driver || "Diurnal thermal radiance escalation",
      urgency: hours <= 12 ? "critical" : "warning",
    };
  }

  return {
    display: "Trajectory monitored",
    detail: driver || "Continuous automated telemetry tracking",
    urgency: "stable",
  };
}

/**
 * Canonical risk state helper ensuring strict 0.45 and 0.70 thresholds across all views.
 * Adheres to Section 7.1 flat non-gradient semantic color system.
 */
export function getRiskState(score: number): {
  label: "Critical" | "Watch" | "Stable";
  colorClass: string;
  badgeClass: string;
  bgLightClass: string;
  borderClass: string;
  dotColor: string;
  scoreDisplay: number;
} {
  const scoreDisplay = Math.round(score * 100);

  if (score >= RISK_THRESHOLDS.HIGH_MIN) {
    return {
      label: "Critical",
      colorClass: "text-[#C43D3D]",
      badgeClass: "bg-[#FCEBEB] text-[#C43D3D] border-[#F4BEBE]",
      bgLightClass: "bg-[#FCEBEB]",
      borderClass: "border-[#C43D3D]",
      dotColor: "#C43D3D",
      scoreDisplay,
    };
  }

  if (score >= RISK_THRESHOLDS.MODERATE_MIN) {
    return {
      label: "Watch",
      colorClass: "text-[#B7791F]",
      badgeClass: "bg-[#FBF3E8] text-[#B7791F] border-[#F3D8B0]",
      bgLightClass: "bg-[#FBF3E8]",
      borderClass: "border-[#B7791F]",
      dotColor: "#B7791F",
      scoreDisplay,
    };
  }

  return {
    label: "Stable",
    colorClass: "text-[#2E8B68]",
    badgeClass: "bg-[#EAF5F0] text-[#2E8B68] border-[#BCE1D1]",
    bgLightClass: "bg-[#EAF5F0]",
    borderClass: "border-[#2E8B68]",
    dotColor: "#2E8B68",
    scoreDisplay,
  };
}

/**
 * Format population safely.
 */
export function formatPopulation(pop?: number): string {
  if (!pop || isNaN(pop)) return "0";
  return pop.toLocaleString("en-IN");
}

/**
 * Format temperature safely with Celsius symbol.
 */
export function formatTemp(temp?: number): string {
  if (temp === undefined || isNaN(temp)) return "--°C";
  return `${Math.round(temp)}°C`;
}

/**
 * Format distance safely with km.
 */
export function formatDistance(km?: number): string {
  if (km === undefined || isNaN(km)) return "-- km";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
