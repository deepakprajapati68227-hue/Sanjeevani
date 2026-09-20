import { NextRequest, NextResponse } from "next/server";

// In-memory verification store: villageId -> { confirmed: number, normalized: number, lastReported: string }
const verificationStore = new Map<
  string,
  { confirmed: number; normalized: number; lastReported: string }
>();

// Initialize with realistic baseline community verifications for demo villages
verificationStore.set("v-ballarpur", { confirmed: 84, normalized: 6, lastReported: new Date().toISOString() });
verificationStore.set("v-chandrapur-east", { confirmed: 62, normalized: 8, lastReported: new Date().toISOString() });
verificationStore.set("v-warora", { confirmed: 51, normalized: 4, lastReported: new Date().toISOString() });
verificationStore.set("v-bhadravati", { confirmed: 38, normalized: 5, lastReported: new Date().toISOString() });
verificationStore.set("v-mul", { confirmed: 12, normalized: 14, lastReported: new Date().toISOString() });
verificationStore.set("v-rajura", { confirmed: 45, normalized: 7, lastReported: new Date().toISOString() });

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const villageId = searchParams.get("villageId");

  if (!villageId) {
    const allRecords: Record<string, any> = {};
    verificationStore.forEach((val, key) => {
      const total = val.confirmed + val.normalized;
      const pct = total > 0 ? Math.round((val.confirmed / total) * 100) : 100;
      allRecords[key] = {
        ...val,
        verified_percentage: pct,
        total_responses: total,
        status: pct >= 80 ? "Verified by Community" : pct >= 50 ? "Under Review" : "Low Activity",
      };
    });
    return NextResponse.json({ verifications: allRecords });
  }

  const record = verificationStore.get(villageId) || {
    confirmed: 24,
    normalized: 3,
    lastReported: new Date().toISOString(),
  };

  const total = record.confirmed + record.normalized;
  const pct = total > 0 ? Math.round((record.confirmed / total) * 100) : 100;

  return NextResponse.json({
    village_id: villageId,
    confirmed: record.confirmed,
    normalized: record.normalized,
    total_responses: total,
    verified_percentage: pct,
    status: pct >= 80 ? "Verified by Community" : pct >= 50 ? "Under Review" : "Low Activity",
    last_reported: record.lastReported,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { villageId, feedbackType } = body; // feedbackType: "confirmed" | "normalized"

    if (!villageId || !feedbackType) {
      return NextResponse.json({ error: "villageId and feedbackType required" }, { status: 400 });
    }

    const current = verificationStore.get(villageId) || {
      confirmed: 20,
      normalized: 2,
      lastReported: new Date().toISOString(),
    };

    if (feedbackType === "confirmed") {
      current.confirmed += 1;
    } else {
      current.normalized += 1;
    }
    current.lastReported = new Date().toISOString();

    verificationStore.set(villageId, current);

    const total = current.confirmed + current.normalized;
    const pct = Math.round((current.confirmed / total) * 100);

    return NextResponse.json({
      success: true,
      village_id: villageId,
      confirmed: current.confirmed,
      normalized: current.normalized,
      total_responses: total,
      verified_percentage: pct,
      status: pct >= 80 ? "Verified by Community" : pct >= 50 ? "Under Review" : "Low Activity",
      last_reported: current.lastReported,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to record community verification" }, { status: 500 });
  }
}
