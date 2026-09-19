/**
 * Configurable weights and threshold bands for the Sanjeevani Risk Engine.
 * Stored as explicit named constants to ensure explainability and transparency.
 */

export const RISK_WEIGHTS = {
  // Multi-parameter climate hazard weights (sum = 1.0)
  temperature: 0.15,     // Raw ambient daytime maximum temperature
  heatwave_index: 0.20,  // Apparent temperature / Heat Index (temp + humidity heat stress)
  precipitation: 0.10,   // Immediate 24-hour rainfall forecast
  flood_surge: 0.10,     // 7-day cumulative rainfall & drainage saturation risk
  water: 0.20,           // CGWB groundwater aquifer decline and extraction severity
  satellite_fire: 0.05,  // NASA FIRMS satellite thermal radiance & hotspot proximity
  vulnerability: 0.20,   // Socioeconomic exposure, age demographics, canopy cover
} as const;

// Ensure weights sum to 1.0
export const TOTAL_WEIGHT = 
  RISK_WEIGHTS.temperature + 
  RISK_WEIGHTS.heatwave_index + 
  RISK_WEIGHTS.precipitation + 
  RISK_WEIGHTS.flood_surge + 
  RISK_WEIGHTS.water + 
  RISK_WEIGHTS.satellite_fire + 
  RISK_WEIGHTS.vulnerability;

// Threshold boundaries for classification
export const RISK_THRESHOLDS = {
  LOW_MAX: 0.40,      // 0.00 to 0.39 -> Low Risk (Green)
  MODERATE_MAX: 0.70, // 0.40 to 0.69 -> Moderate Risk (Amber)
  HIGH_MIN: 0.70,     // 0.70 to 1.00 -> High Risk (Red)
} as const;

// Normalization thresholds based on regional climate norms (Vidarbha / Maharashtra)
export const CLIMATE_NORMALIZATION = {
  HEAT_MIN_CELSIUS: 28.0,  // Baseline threshold for thermal discomfort in high-humidity zones
  HEAT_MAX_CELSIUS: 45.0,  // Severe heat threshold
  PRECIP_MIN_MM: 0.0,      // 0mm produces 0.0 flood risk
  PRECIP_MAX_MM: 65.0,     // Drainage saturation threshold in 24h
} as const;

