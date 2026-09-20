/**
 * Learned weights and threshold bands for the Sanjeevani Risk Engine.
 * Trained offline on 2,628 daily observations from the Open-Meteo Historical Archive
 * across 3 Indian climate vulnerability zones (Chandrapur, Barmer, Wayanad) via Logistic Regression.
 * See scripts/train_risk_model.py and Master Documentation Section 4.1.
 */

import learnedWeightsData from "./learnedWeights.json";

export const ML_MODEL_METADATA = {
  model_type: learnedWeightsData.model_type,
  training_period: learnedWeightsData.training_period,
  sample_size: learnedWeightsData.sample_size,
  disaster_events_detected: learnedWeightsData.disaster_events_detected,
  roc_auc_accuracy: learnedWeightsData.roc_auc_accuracy,
  intercept: learnedWeightsData.intercept,
  raw_coefficients: learnedWeightsData.raw_coefficients,
  methodology: learnedWeightsData.methodology,
};

export const RISK_WEIGHTS = {
  temperature: learnedWeightsData.learned_weights.temperature,         // 0.167
  heatwave_index: learnedWeightsData.learned_weights.heatwave_index,   // 0.220
  precipitation: learnedWeightsData.learned_weights.precipitation,     // 0.112
  flood_surge: learnedWeightsData.learned_weights.flood_surge,         // 0.108
  water: learnedWeightsData.learned_weights.water,                     // 0.205
  satellite_fire: learnedWeightsData.learned_weights.satellite_fire,   // 0.050
  vulnerability: learnedWeightsData.learned_weights.vulnerability,     // 0.138
} as const;

// Ensure weights sum to 1.0
export const TOTAL_WEIGHT = Math.round(
  (RISK_WEIGHTS.temperature +
    RISK_WEIGHTS.heatwave_index +
    RISK_WEIGHTS.precipitation +
    RISK_WEIGHTS.flood_surge +
    RISK_WEIGHTS.water +
    RISK_WEIGHTS.satellite_fire +
    RISK_WEIGHTS.vulnerability) * 1000
) / 1000;

// Threshold boundaries for classification
export const RISK_THRESHOLDS = {
  LOW_MAX: 0.40,      // 0.00 to 0.39 -> Low Risk (Green)
  MODERATE_MAX: 0.70, // 0.40 to 0.69 -> Moderate Risk (Amber)
  HIGH_MIN: 0.70,     // 0.70 to 1.00 -> High Risk (Red)
} as const;

// Normalization thresholds based on regional climate norms (Vidarbha / Maharashtra / Rajasthan)
export const CLIMATE_NORMALIZATION = {
  HEAT_MIN_CELSIUS: 28.0,  // Baseline threshold for thermal discomfort
  HEAT_MAX_CELSIUS: 45.0,  // Severe heat threshold
  PRECIP_MIN_MM: 0.0,      // 0mm produces 0.0 flood risk
  PRECIP_MAX_MM: 65.0,     // Drainage saturation threshold in 24h
} as const;
