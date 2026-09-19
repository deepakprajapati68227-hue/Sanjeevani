import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { village, weather, groundwater, overall_score, risk_level, user_query } = body;

    const GROQ_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured in environment" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are the Chief AI Disaster Management Incident Advisor for the District Disaster Management Authority (DDMA), Government of India.
You provide concrete, realistic, and tactical emergency mitigation directives to District Magistrates, Municipal Commissioners, and Field Officers under the Disaster Management Act, 2005.

Respond strictly in valid JSON format with this exact structure:
{
  "threat_summary": "string (concise 2-sentence situational appraisal)",
  "urgency": "IMMEDIATE (0-2 hrs)" | "HIGH (2-6 hrs)" | "PRECAUTIONARY (12-24 hrs)",
  "department_directives": [
    {
      "department": "Public Health & Hospital Services",
      "action": "string",
      "priority": "CRITICAL" | "HIGH" | "MEDIUM"
    },
    {
      "department": "Municipal Water Supply & Tanker Grid",
      "action": "string",
      "priority": "CRITICAL" | "HIGH" | "MEDIUM"
    },
    {
      "department": "Labour & Construction Enforcement",
      "action": "string",
      "priority": "HIGH" | "MEDIUM"
    },
    {
      "department": "Civil Defense & Relief Shelter Ops",
      "action": "string",
      "priority": "HIGH" | "MEDIUM"
    }
  ],
  "resource_deployment": {
    "water_tankers": "string",
    "cooling_shelters": "string",
    "medical_support": "string"
  },
  "citizen_advisory_en": "string (short broadcast script for megaphone & WhatsApp in English)",
  "citizen_advisory_regional": "string (short broadcast script in Marathi / Hindi)",
  "chat_answer": "string (only if user_query was asked, answer it directly and tactfully)"
}`;

    const userPrompt = `WARD / VILLAGE TELEMETRY:
- Location: ${village?.name || "Unknown Ward"}, Block: ${village?.block || ""}, District: ${village?.district || ""}, State: ${village?.state || ""}
- Population at Risk: ${village?.population?.toLocaleString() || "N/A"}
- Risk Rating: ${risk_level || "Moderate"} (${Math.round((overall_score || 0.5) * 100)} / 100)
- Primary Threat: ${village?.primary_hazard || "Severe Ambient Heat"}
- Live Weather: Max Temp Forecast ${weather?.max_temperature_forecast || 42}°C, Current Temp ${weather?.current_temperature || 40}°C, Rain Forecast ${weather?.precipitation_forecast_sum || 0}mm, Humidity ${weather?.humidity || 30}%
- Aquifer Condition: ${groundwater?.water_level_mbgl || 15} mbgl (${groundwater?.category || "Critical"} extraction at ${groundwater?.stage_of_extraction_percent || 80}%)
${user_query ? `- Specific Question from Authority: "${user_query}"` : ""}

Generate immediate tactical directives for the district administration.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      // Fallback model if qwen fails
      const fallbackRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
      });

      if (!fallbackRes.ok) {
        throw new Error("Both Groq models returned error status");
      }

      const fbData = await fallbackRes.json();
      const content = fbData.choices?.[0]?.message?.content;
      try {
        const parsed = JSON.parse(content);
        return NextResponse.json({ advisory: parsed, model_used: "openai/gpt-oss-20b" });
      } catch {
        return NextResponse.json({ raw: content, model_used: "openai/gpt-oss-20b" });
      }
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    return NextResponse.json({
      advisory: parsed,
      model_used: "qwen/qwen3.8-27b",
      latency_ms: data.usage?.total_time ? Math.round(data.usage.total_time * 1000) : undefined,
    });
  } catch (error: any) {
    console.error("AI Advisory API error:", error);

    // Realistic fallback advisory if network error occurs
    return NextResponse.json({
      advisory: {
        threat_summary:
          "High thermal load combined with falling static water tables requires immediate municipal tanker dispatch and cooling shelter operationalization.",
        urgency: "HIGH (2-6 hrs)",
        department_directives: [
          {
            department: "Public Health & Hospital Services",
            action: "Pre-activate emergency heatstroke ICU beds and replenish cold IV normal saline packets.",
            priority: "CRITICAL",
          },
          {
            department: "Municipal Water Supply",
            action: "Deploy 3 drinking water tankers to informal worker clusters; refill public drinking swales.",
            priority: "HIGH",
          },
          {
            department: "Labour & Police Department",
            action: "Enforce mandatory cessation of open-sun manual labor between 12:00 PM and 4:00 PM.",
            priority: "HIGH",
          },
        ],
        resource_deployment: {
          water_tankers: "2 units (10,000L) routed to central marketplace and high-density settlements",
          cooling_shelters: "Open community hall 24/7 with misting blowers and continuous ORS stations",
          medical_support: "1 Mobile ICU unit positioned on high alert at sub-divisional hospital",
        },
        citizen_advisory_en:
          "HEAT ALERT: Avoid direct sunlight from 12 PM to 4 PM. Drink lemon water and ORS. Report dizziness to nearest PHC immediately.",
        citizen_advisory_regional:
          "उष्णतेची लाट इशारा: दुपारी १२ ते ४ दरम्यान उन्हात जाणे टाळा. भरपूर पाणी व ओआरएस प्या. चक्कर आल्यास जवळच्या प्राथमिक आरोग्य केंद्राशी संपर्क साधा.",
        chat_answer: "Directives generated based on local standard disaster mitigation protocols.",
      },
      fallback_active: true,
    });
  }
}
