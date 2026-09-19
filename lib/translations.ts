import { RiskAssessment, SupportedLanguage } from "./types";

export interface AlertMessageContent {
  senderTitle: string;
  senderBadge: string;
  header: string;
  hazardBanner: string;
  bodyParagraph: string;
  criticalAdvisory: string;
  shelterHeading: string;
  shelterDirections: string;
  helplineNotice: string;
  timestamp: string;
}

export const ALERT_TRANSLATIONS: Record<SupportedLanguage, (assessment: RiskAssessment) => AlertMessageContent> = {
  en: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "Sanjeevani Climate Resilience Cell",
      senderBadge: "Official District Advisory",
      header: isHigh
        ? `🚨 RED HEAT & CLIMATE ALERT: ${vName.toUpperCase()}`
        : `⚠️ MODERATE CLIMATE ADVISORY: ${vName.toUpperCase()}`,
      hazardBanner: `Forecast Peak: ${temp}°C | Risk Severity: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `Extreme thermal conditions detected in ${vName}. Immediate precautionary measures are required for all outdoor workers, elderly citizens, and children.`
        : `Elevated weather conditions expected over the next 24 hours across ${vName}. Maintain hydration and monitor official updates.`,
      criticalAdvisory: isHigh
        ? "• Suspend heavy field labor between 11:30 AM – 4:00 PM.\n• Consume salted buttermilk / ORS fluids frequently.\n• Keep livestock under shaded shelters with constant water."
        : "• Limit direct sun exposure during peak noon hours.\n• Carry bottled water when traveling.\n• Report any heat exhaustion signs to ASHA workers.",
      shelterHeading: "Designated Relief & Cooling Center:",
      shelterDirections: `📍 ${shelterName} (${dist} km away)\nFacilities: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nStatus: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 District Disaster Control Helpline: 1077 or ${assessment.nearest_shelter.contact}`,
      timestamp: "Today, 10:45 AM • Delivered via Sanjeevani Broadcast",
    };
  },
  mr: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "संजीवनी हवामान दक्षता कक्ष",
      senderBadge: "अधिकृत जिल्हा इशारा",
      header: isHigh
        ? `🚨 तीव्र उष्णता लाट सतर्कता: ${vName}`
        : `⚠️ हवामान दक्षता इशारा: ${vName}`,
      hazardBanner: `अपेक्षित कमाल तापमान: ${temp}°C | जोखीम तीव्रता: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} परिसरात तीव्र उष्णतेची लाट जाणवण्याची दाट शक्यता आहे. शेतमजूर, ज्येष्ठ नागरिक व लहान मुलांनी तातडीने सावधगिरी बाळगावी.`
        : `${vName} परिसरात पुढील २४ तासांत हवामानात बदल अपेक्षित आहेत. पुरेसे पाणी प्या आणि दक्षता बाळगा.`,
      criticalAdvisory: isHigh
        ? "• सकाळी ११:३० ते दुपारी ४:०० या वेळेत उन्हात काम करणे टाळा.\n• लिंबू पाणी, ताक किंवा ओआरएस (ORS) चा वापर करा.\n• जनावरांना सावलीत बांधा व मुबलक पिण्याचे पाणी उपलब्ध करा."
        : "• दुपारच्या वेळेस थेट उन्हात जाणे टाळा.\n• सोबत नेहमी पिण्याचे पाणी ठेवा.\n• त्रास जाणवल्यास त्वरित आशा सेविकेशी संपर्क साधा.",
      shelterHeading: "जवळचे शासकीय शीतकरण व मदत केंद्र:",
      shelterDirections: `📍 ${shelterName} (अंतर: ${dist} किमी)\nसुविधा: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nस्थिती: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 जिल्हा आपत्ती नियंत्रण कक्ष: १०७७ किंवा ${assessment.nearest_shelter.contact}`,
      timestamp: "आज, सकाळी १०:४५ • संजीवनी अलर्ट द्वारे प्रसारित",
    };
  },
};

export const UI_STRINGS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appTitle: "Sanjeevani",
    tagline: "Predict. Alert. Respond.",
    supervisorView: "Supervisor Dashboard",
    residentView: "Resident Alert Preview",
    liveDataBadge: "Live Open-Meteo Weather Feed",
    fallbackBadge: "Seeded Fallback Feed",
    villagesMonitored: "Villages Monitored",
    highRiskAlerts: "High Risk Alerts",
    avgScore: "Avg District Risk",
    activeReliefShelters: "Active Shelters",
    riskDetails: "Risk & Explainability Breakdown",
    generateAlert: "Simulate WhatsApp Alert",
    logOutcome: "Log Field Outcome",
    whatIfSimulation: "What-If Scenario Simulation",
    resetSimulation: "Reset Scenario",
    recentOutcomes: "Recent Field Validations",
  },
  mr: {
    appTitle: "संजीवनी",
    tagline: "अंदाज. इशारा. प्रतिसाद.",
    supervisorView: "पर्यवेक्षक डॅशबोर्ड",
    residentView: "नागरिक इशारा पूर्वावलोकन",
    liveDataBadge: "थेट ओपन-मेटिओ हवामान डेटा",
    fallbackBadge: "सुरक्षित बॅकअप डेटा",
    villagesMonitored: "निरीक्षण खालील गावे",
    highRiskAlerts: "तीव्र इशारा गावे",
    avgScore: "सरासरी जिल्हा जोखीम",
    activeReliefShelters: "सक्रिय मदत केंद्रे",
    riskDetails: "जोखीम विश्लेषण व कारणे",
    generateAlert: "व्हॉट्सॲप अलर्ट तयार करा",
    logOutcome: "क्षेत्रीय प्रतिसाद नोंदवा",
    whatIfSimulation: "परिस्थिती चाचणी (What-If)",
    resetSimulation: "पूर्ववत करा",
    recentOutcomes: "अलिकडील क्षेत्रीय नोंदी",
  },
};
