import { NextResponse } from "next/server";
import { FireHotspot } from "@/lib/types";
import fallbackHotspots from "@/data/fire-hotspots-fallback.json";

export async function GET() {
  const mapKey = process.env.NASA_FIRMS_KEY;

  if (!mapKey) {
    // Return curated fallback data
    return NextResponse.json({
      source: "fallback",
      message: "Seeded realistic satellite thermal anomalies (No NASA_FIRMS_KEY set in env)",
      hotspots: fallbackHotspots as FireHotspot[],
    });
  }

  try {
    // Area coordinates for Chandrapur bounding box: minLon, minLat, maxLon, maxLat
    // Chandrapur approx: 78.8, 19.5, 80.0, 20.8
    const area = "78.8,19.5,80.0,20.8";
    const apiUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/VIIRS_SNPP_NRT/${area}/1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`NASA FIRMS API returned status ${res.status}`);
    }

    const csvText = await res.text();
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) {
      // Empty results from satellite scan
      return NextResponse.json({
        source: "live_empty_fallback",
        message: "Satellite detected no active thermal anomalies today; using verified seasonal reference points",
        hotspots: fallbackHotspots as FireHotspot[],
      });
    }

    const headers = lines[0].split(",");
    const hotspots: FireHotspot[] = [];

    for (let i = 1; i < lines.length && i <= 15; i++) {
      const cols = lines[i].split(",");
      if (cols.length >= 8) {
        hotspots.push({
          id: `firms-${i}`,
          lat: parseFloat(cols[headers.indexOf("latitude")]),
          lon: parseFloat(cols[headers.indexOf("longitude")]),
          brightness: parseFloat(cols[headers.indexOf("bright_ti4")]),
          scan: parseFloat(cols[headers.indexOf("scan")]),
          track: parseFloat(cols[headers.indexOf("track")]),
          acq_date: cols[headers.indexOf("acq_date")],
          acq_time: cols[headers.indexOf("acq_time")],
          satellite: "VIIRS-SNPP",
          confidence: cols[headers.indexOf("confidence")] || "nominal",
          frp: parseFloat(cols[headers.indexOf("frp")] || "15.0"),
          is_fallback: false,
        });
      }
    }

    return NextResponse.json({
      source: "live_nasa_firms",
      message: "Live thermal anomalies from NASA FIRMS VIIRS instrument",
      hotspots,
    });
  } catch (error) {
    console.warn("[NASA FIRMS] Live query failed, utilizing fallback:", error);
    return NextResponse.json({
      source: "error_fallback",
      message: "NASA FIRMS API unreachable; displaying fallback reference points",
      hotspots: fallbackHotspots as FireHotspot[],
    });
  }
}
