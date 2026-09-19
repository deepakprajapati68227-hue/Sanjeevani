export type RiskLevel = "Low" | "Moderate" | "High";

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  region: string;
  hazard_profile: string;
  climate_zone: string;
  centerLat: number;
  centerLon: number;
  zoom: number;
  default_language: SupportedLanguage;
  recommended_focus: string;
  color_accent: string;
}

export interface Village {
  id: string;
  district_id?: string;
  name: string;
  block: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  population: number;
  vulnerability_weight: number;
  primary_hazard: string;
  description: string;
}

export interface GroundwaterRecord {
  block_name: string;
  stage_of_extraction_percent: number;
  water_level_mbgl: number;
  pre_monsoon_trend: "declining" | "stable" | "rising";
  category: "Critical" | "Semi-Critical" | "Safe";
  severity_score: number;
  notes: string;
}

export interface Shelter {
  id: string;
  name: string;
  block: string;
  lat: number;
  lon: number;
  capacity: number;
  type: string;
  facilities: string[];
  contact: string;
  open_status: string;
  recommended_for: string[];
  distanceKm?: number;
}

export interface FireHotspot {
  id: string;
  lat: number;
  lon: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: string;
  frp: number;
  location_name?: string;
  is_fallback?: boolean;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  current_temperature: number;
  max_temperature_forecast: number;
  precipitation_forecast_sum: number;
  humidity?: number;
  wind_speed?: number;
  forecast_dates: string[];
  forecast_max_temps: number[];
  forecast_precip: number[];
  is_live: boolean;
  cached_at: string;
}

export interface RiskFactorDetail {
  name: string;
  raw_value: string;
  normalized_score: number; // 0 to 1
  weight: number;
  weighted_contribution: number;
  status: "Normal" | "Elevated" | "Severe";
  description: string;
}

export interface ComponentBreakdown {
  temperature: RiskFactorDetail;
  heatwave_index: RiskFactorDetail;
  precipitation: RiskFactorDetail;
  flood_surge: RiskFactorDetail;
  water: RiskFactorDetail;
  satellite_fire: RiskFactorDetail;
  vulnerability: RiskFactorDetail;
}

export interface HistoricalDataPoint {
  day: string;
  score: number;
  maxTemp: number;
  precipitation: number;
}

export interface RiskAssessment {
  village: Village;
  overall_score: number; // 0 to 1
  risk_level: RiskLevel;
  primary_risk_driver: string;
  breakdown: ComponentBreakdown;
  weather: WeatherData;
  groundwater: GroundwaterRecord;
  nearest_shelter: Shelter;
  active_hotspots_nearby: number;
  historical_trend: HistoricalDataPoint[];
  calculated_at: string;
  outcomes_count: number;
  is_recalibrated?: boolean;
}

export interface OutcomeRecord {
  id: string;
  village_id: string;
  village_name: string;
  timestamp: string;
  event_type: "Heat Advisory Dispatched" | "Relief Shelter Activated" | "Water Tanker Deployed" | "Flood Evacuation Warning";
  outcome_status: "Alert acted on successfully" | "Partial false alarm / Condition normalized" | "Escalated to medical emergency";
  residents_protected_estimate: number;
  notes: string;
  logged_by: string;
}

export type SupportedLanguage = "en" | "mr";
