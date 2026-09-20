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
      colorClass: "text-[#E5484D]",
      badgeClass: "bg-[#E5484D]/20 text-[#E5484D] border-[#E5484D]/40",
      bgLightClass: "bg-[#E5484D]/10",
      borderClass: "border-[#E5484D]",
      dotColor: "#E5484D",
      scoreDisplay,
    };
  }

  if (score >= RISK_THRESHOLDS.MODERATE_MIN) {
    return {
      label: "Watch",
      colorClass: "text-[#F5B942]",
      badgeClass: "bg-[#F5B942]/20 text-[#F5B942] border-[#F5B942]/40",
      bgLightClass: "bg-[#F5B942]/10",
      borderClass: "border-[#F5B942]",
      dotColor: "#F5B942",
      scoreDisplay,
    };
  }

  return {
    label: "Stable",
    colorClass: "text-[#16B8A6]",
    badgeClass: "bg-[#16B8A6]/20 text-[#16B8A6] border-[#16B8A6]/40",
    bgLightClass: "bg-[#16B8A6]/10",
    borderClass: "border-[#16B8A6]",
    dotColor: "#16B8A6",
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
