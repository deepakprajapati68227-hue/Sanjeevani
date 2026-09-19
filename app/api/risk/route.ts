import { NextRequest, NextResponse } from "next/server";
import villagesData from "@/data/villages.json";
import groundwaterData from "@/data/groundwater.json";
import sheltersData from "@/data/shelters.json";
import fallbackHotspots from "@/data/fire-hotspots-fallback.json";
import { calculateVillageRisk, calculateDistanceKm } from "@/lib/riskCalculator";
import { Village, Shelter, GroundwaterRecord, WeatherData, RiskAssessment, FireHotspot } from "@/lib/types";

// In-memory weather cache to keep API fast
const weatherStore = new Map<string, WeatherData>();

async function getOrFetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const key = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  if (weatherStore.has(key)) {
    return weatherStore.get(key)!;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&current=temperature_2m,relative_humidity_2m&timezone=auto`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const maxTemp = json.daily?.temperature_2m_max?.[0] ?? 42.0;
      const precip = json.daily?.precipitation_sum?.[0] ?? 0.0;
      const currentTemp = json.current?.temperature_2m ?? (maxTemp - 1.8);

      const wData: WeatherData = {
        latitude: lat,
        longitude: lon,
        current_temperature: Math.round(currentTemp * 10) / 10,
        max_temperature_forecast: Math.round(maxTemp * 10) / 10,
        precipitation_forecast_sum: Math.round(precip * 10) / 10,
        humidity: json.current?.relative_humidity_2m ?? 30,
        forecast_dates: json.daily?.time ?? [],
        forecast_max_temps: json.daily?.temperature_2m_max ?? [maxTemp],
        forecast_precip: json.daily?.precipitation_sum ?? [precip],
        is_live: true,
        cached_at: new Date().toISOString(),
      };
      weatherStore.set(key, wData);
      return wData;
    }
  } catch {
    // Ignore and proceed to realistic fallback
  }

  // Realistic fallback
  const baseT = 42.0 + Math.sin(lat * 5) * 2.2;
  const fallbackW: WeatherData = {
    latitude: lat,
    longitude: lon,
    current_temperature: Math.round((baseT - 1.5) * 10) / 10,
    max_temperature_forecast: Math.round(baseT * 10) / 10,
    precipitation_forecast_sum: 0.0,
    humidity: 28,
    forecast_dates: ["Today", "Tomorrow", "+2d", "+3d", "+4d", "+5d", "+6d"],
    forecast_max_temps: [baseT, baseT + 0.5, baseT + 1.2, baseT - 0.4, baseT + 0.2, baseT + 1.5, baseT],
    forecast_precip: [0, 0, 0, 0, 0, 0, 0],
    is_live: false,
    cached_at: new Date().toISOString(),
  };
  weatherStore.set(key, fallbackW);
  return fallbackW;
}

import districtsData from "@/data/districts.json";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tempDelta = parseFloat(searchParams.get("tempDelta") || "0");
  const precipDelta = parseFloat(searchParams.get("precipDelta") || "0");
  const districtId = (searchParams.get("district") || "chandrapur").toLowerCase();

  const districts = districtsData;
  const currentDistrict = districts.find((d) => d.id === districtId) || districts[0];

  const allVillages = villagesData as Village[];
  const villages = allVillages.filter((v) => (v.district_id || "chandrapur") === currentDistrict.id);
  const targetVillages = villages.length > 0 ? villages : allVillages.slice(0, 12);

  const shelters = sheltersData as Shelter[];
  const gwBlocks = groundwaterData.blocks as Record<string, GroundwaterRecord>;
  const hotspots = fallbackHotspots as FireHotspot[];

  // Fetch or retrieve outcomes count
  let outcomesCountMap: Record<string, number> = {
    "v-warora": 1,
    "v-bhadravati": 1,
    "v-bm-balotra": 1,
    "v-wy-meppadi": 2,
    "v-sb-gosaba": 1,
    "v-so-sangole": 1,
  };

  const assessments: RiskAssessment[] = [];

  for (const v of targetVillages) {
    const weather = await getOrFetchWeather(v.lat, v.lon);
    const gw = gwBlocks[v.id] || {
      block_name: v.block,
      stage_of_extraction_percent: 70,
      water_level_mbgl: 12.0,
      pre_monsoon_trend: "declining",
      category: "Semi-Critical",
      severity_score: 0.6,
      notes: "Default block assessment.",
    };

    // Find nearby hotspots within ~18 km
    const nearbyHotspots = hotspots.filter(
      (h) => calculateDistanceKm(v.lat, v.lon, h.lat, h.lon) <= 18
    ).length;

    const outcomeCount = outcomesCountMap[v.id] || 0;

    const assessment = calculateVillageRisk(
      v,
      weather,
      gw,
      shelters,
      nearbyHotspots,
      { tempDeltaCelsius: tempDelta, precipDeltaPercent: precipDelta },
      outcomeCount
    );

    assessments.push(assessment);
  }

  // Compute District Roll-up Stats
  const highRiskCount = assessments.filter((a) => a.risk_level === "High").length;
  const modRiskCount = assessments.filter((a) => a.risk_level === "Moderate").length;
  const lowRiskCount = assessments.filter((a) => a.risk_level === "Low").length;
  const avgScore =
    assessments.length > 0
      ? Math.round(
          (assessments.reduce((acc, curr) => acc + curr.overall_score, 0) / assessments.length) * 100
        ) / 100
      : 0;
  const totalPopAtHighRisk = assessments
    .filter((a) => a.risk_level === "High")
    .reduce((acc, curr) => acc + curr.village.population, 0);

  const isLive = assessments.some((a) => a.weather.is_live);

  return NextResponse.json({
    district_id: currentDistrict.id,
    district: currentDistrict.name,
    state: currentDistrict.state,
    region: currentDistrict.region,
    hazard_profile: currentDistrict.hazard_profile,
    centerLat: currentDistrict.centerLat,
    centerLon: currentDistrict.centerLon,
    zoom: currentDistrict.zoom,
    assessed_count: assessments.length,
    high_risk_count: highRiskCount,
    moderate_risk_count: modRiskCount,
    low_risk_count: lowRiskCount,
    average_risk_score: avgScore,
    total_population_at_high_risk: totalPopAtHighRisk,
    data_source_live: isLive,
    what_if_active: tempDelta !== 0 || precipDelta !== 0,
    temp_delta_applied: tempDelta,
    precip_delta_applied: precipDelta,
    assessments,
  });
}
