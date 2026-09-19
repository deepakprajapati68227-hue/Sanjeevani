import { NextRequest, NextResponse } from "next/server";
import { OutcomeRecord } from "@/lib/types";

// In-memory array of logged outcomes for current demo session
const loggedOutcomes: OutcomeRecord[] = [
  {
    id: "out-seed-01",
    village_id: "v-warora",
    village_name: "Warora",
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    event_type: "Heat Advisory Dispatched",
    outcome_status: "Alert acted on successfully",
    residents_protected_estimate: 240,
    notes: "Gram Panchayat altered agricultural shift to 06:00-11:00 AM. Zero heatstroke admissions reported.",
    logged_by: "Dr. A. Deshmukh (Taluka Health Officer)",
  },
  {
    id: "out-seed-02",
    village_id: "v-bhadravati",
    village_name: "Bhadravati",
    timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    event_type: "Relief Shelter Activated",
    outcome_status: "Alert acted on successfully",
    residents_protected_estimate: 310,
    notes: "Sports complex opened with misting fans; mining shift workers rested between 12:00-15:30.",
    logged_by: "K. Rathod (Nagar Parishad Coordinator)",
  },
];

export async function GET() {
  return NextResponse.json({
    total_outcomes: loggedOutcomes.length,
    outcomes: loggedOutcomes,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      village_id,
      village_name,
      event_type,
      outcome_status,
      residents_protected_estimate,
      notes,
      logged_by,
    } = body;

    if (!village_id || !village_name || !event_type || !outcome_status) {
      return NextResponse.json(
        { error: "Missing required fields: village_id, village_name, event_type, outcome_status" },
        { status: 400 }
      );
    }

    const newRecord: OutcomeRecord = {
      id: `out-${Date.now()}`,
      village_id,
      village_name,
      timestamp: new Date().toISOString(),
      event_type,
      outcome_status,
      residents_protected_estimate: Number(residents_protected_estimate) || 50,
      notes: notes || "Logged via Sanjeevani field supervisor terminal.",
      logged_by: logged_by || "Field Supervisor",
    };

    // Prepend so newest appears first
    loggedOutcomes.unshift(newRecord);

    return NextResponse.json({
      success: true,
      message: "Outcome logged successfully. Model recalibration updated for village.",
      record: newRecord,
      total_outcomes: loggedOutcomes.length,
      outcomes: loggedOutcomes,
    });
  } catch (error) {
    console.error("[Outcomes API] Error parsing POST:", error);
    return NextResponse.json({ error: "Failed to record outcome" }, { status: 500 });
  }
}
