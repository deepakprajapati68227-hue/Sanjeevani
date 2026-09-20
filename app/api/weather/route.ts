import { NextRequest, NextResponse } from "next/server";
import { WeatherData } from "@/lib/types";

// In-memory cache: key = `${lat.toFixed(2)}_${lon.toFixed(2)}`, value = { data, timestamp }
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getRealisticFallbackWeather(lat: number, lon: number): WeatherData {
  // Chandrapur baseline: hot pre-monsoon dry heat
  const baseTemp = 42.5 + Math.sin(lat * 10) * 2.5;
  const now = new Date();
  const dates: string[] = [];
  const temps: number[] = [];
  const precips: number[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
    temps.push(Math.round((baseTemp + Math.sin(i * 1.5) * 2.0) * 10) / 10);
    precips.push(i === 3 ? 4.2 : 0.0);
  }

  return {
    latitude: lat,
    longitude: lon,
    current_temperature: Math.round((baseTemp - 1.5) * 10) / 10,
    max_temperature_forecast: Math.round(baseTemp * 10) / 10,
    precipitation_forecast_sum: precips[0],
    humidity: 28,
    wind_speed: 12.4,
    forecast_dates: dates,
    forecast_max_temps: temps,
    forecast_precip: precips,
    is_live: false,
    cached_at: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  const lat = latStr ? parseFloat(latStr) : 19.9545;
  const lon = lonStr ? parseFloat(lonStr) : 79.2961;

  const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast response

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&current=temperature_2m,relative_humidity_2m,wind_speed_10m&past_days=7&timezone=auto`;

    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "SanjeevaniClimateApp/1.0" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const json = await res.json();

    const allTimes: string[] = json.daily?.time ?? [];
    const allTemps: number[] = json.daily?.temperature_2m_max ?? [];
    const allPrecips: number[] = json.daily?.precipitation_sum ?? [];

    // When past_days=7, index 7 is today
    const todayIndex = allTimes.length > 7 ? 7 : 0;
    const maxTempForecast = allTemps[todayIndex] ?? 41.5;
    const precipSum = allPrecips[todayIndex] ?? 0.0;
    const currentTemp = json.current?.temperature_2m ?? (maxTempForecast - 2.0);

    const pastDates = allTimes.slice(0, todayIndex);
    const pastTemps = allTemps.slice(0, todayIndex);
    const pastPrecips = allPrecips.slice(0, todayIndex);

    const forecastDates = allTimes.slice(todayIndex);
    const forecastTemps = allTemps.slice(todayIndex);
    const forecastPrecips = allPrecips.slice(todayIndex);

    const weatherData: WeatherData = {
      latitude: lat,
      longitude: lon,
      current_temperature: Math.round(currentTemp * 10) / 10,
      max_temperature_forecast: Math.round(maxTempForecast * 10) / 10,
      precipitation_forecast_sum: Math.round(precipSum * 10) / 10,
      humidity: json.current?.relative_humidity_2m ?? 32,
      wind_speed: json.current?.wind_speed_10m ?? 11.5,
      forecast_dates: forecastDates,
      forecast_max_temps: forecastTemps,
      forecast_precip: forecastPrecips,
      past_dates: pastDates,
      past_max_temps: pastTemps,
      past_precip: pastPrecips,
      is_live: true,
      cached_at: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
    return NextResponse.json(weatherData);
  } catch (error) {
    console.warn(`[Open-Meteo] Live fetch failed for (${lat}, ${lon}), using resilient fallback:`, error);
    const fallback = getRealisticFallbackWeather(lat, lon);
    weatherCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return NextResponse.json(fallback);
  }
}
