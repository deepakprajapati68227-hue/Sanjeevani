import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query.trim()
    )}&countrycodes=in&format=json&addressdetails=1&limit=6`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SanjeevaniClimateDisasterSystem/1.0 (contact: admin@sanjeevani.org)",
        Accept: "application/json",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();

    const formatted = data.map((item: any, index: number) => {
      const addr = item.address || {};
      const villageOrTown =
        addr.village ||
        addr.hamlet ||
        addr.suburb ||
        addr.town ||
        addr.city ||
        addr.municipality ||
        item.name;

      const district =
        addr.state_district ||
        addr.county ||
        addr.district ||
        addr.city_district ||
        addr.state ||
        "India";

      const state = addr.state || "India";

      return {
        id: `custom-loc-${index}-${Date.now()}`,
        name: villageOrTown,
        displayName: item.display_name,
        district,
        state,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type || "place",
        category: item.category || "place",
      };
    });

    return NextResponse.json({ results: formatted });
  } catch (error) {
    console.error("Geocode error:", error);
    return NextResponse.json({ results: [] });
  }
}
