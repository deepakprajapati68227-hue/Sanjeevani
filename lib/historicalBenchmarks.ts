export interface HistoricalDisasterPreset {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  startDate: string;
  endDate: string;
  peakDate: string;
  disasterType: "Extreme Heatwave" | "Monsoon Flood Surge";
  historicalRecord: string;
}

export const HISTORICAL_BENCHMARKS: HistoricalDisasterPreset[] = [
  {
    id: "chandrapur_heatwave_2024",
    name: "Chandrapur Record 46.8°C Heatwave",
    district: "Chandrapur",
    state: "Maharashtra",
    lat: 19.9545,
    lon: 79.2961,
    startDate: "2024-05-22",
    endDate: "2024-05-30",
    peakDate: "2024-05-28",
    disasterType: "Extreme Heatwave",
    historicalRecord: "IMD recorded peak temperature of 46.8°C with prolonged thermal radiance from industrial coal belts. 14 heatstroke hospitalizations.",
  },
  {
    id: "vidarbha_flood_2023",
    name: "Vidarbha Monsoon Cloudburst & River Overflow",
    district: "Chandrapur / Wardha Basin",
    state: "Maharashtra",
    lat: 19.9545,
    lon: 79.2961,
    startDate: "2023-07-14",
    endDate: "2023-07-22",
    peakDate: "2023-07-19",
    disasterType: "Monsoon Flood Surge",
    historicalRecord: "Excess monsoon depression dumped 182mm rain in 48 hours, causing low-lying village inundation and Irai river backwater flooding.",
  },
  {
    id: "barmer_heat_dome_2024",
    name: "Barmer Thar Desert 48.2°C Heat Dome",
    district: "Barmer",
    state: "Rajasthan",
    lat: 25.7521,
    lon: 71.3967,
    startDate: "2024-05-20",
    endDate: "2024-05-27",
    peakDate: "2024-05-25",
    disasterType: "Extreme Heatwave",
    historicalRecord: "Severe heat dome settled over western Rajasthan; Barmer recorded 48.2°C with acute water table drying.",
  },
];
