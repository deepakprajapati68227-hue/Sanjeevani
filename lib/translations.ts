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
  hi: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "संजीवनी आपदा प्रबंधन प्रकोष्ठ",
      senderBadge: "आधिकारिक जिला चेतावनी",
      header: isHigh
        ? `🚨 लाल चेतावनी: भीषण लू व आपदा अलर्ट (${vName})`
        : `⚠️ मौसम चेतावनी व सावधानी अलर्ट (${vName})`,
      hazardBanner: `अनुमानित अधिकतम तापमान: ${temp}°C | जोखिम स्कोर: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} क्षेत्र में गंभीर जलवायु संकट व भीषण गर्मी का प्रकोप है। सभी नागरिकों, श्रमिकों व पशुपालकों को तत्काल एहतियात बरतने की सलाह दी जाती है।`
        : `${vName} में अगले 24 घंटों में तापमान में वृद्धि दर्ज की गई है। पर्याप्त जल पिएं और सतर्क रहें।`,
      criticalAdvisory: isHigh
        ? "• सुबह 11:30 से शाम 4:00 बजे तक खुले में कठिन परिश्रम न करें।\n• ओआरएस (ORS) घोल, मट्ठा और नींबू पानी का निरंतर सेवन करें।\n• पशुओं को छायादार स्थानों पर रखें और स्वच्छ जल उपलब्ध कराएं।"
        : "• दोपहर की तेज धूप में अनावश्यक बाहर निकलने से बचें।\n• यात्रा के समय पीने का पानी अवश्य साथ रखें।\n• चक्कर या कमजोरी महसूस होने पर तुरंत आशा कार्यकर्ता से संपर्क करें।",
      shelterHeading: "नामित राहत एवं शीतलन केंद्र:",
      shelterDirections: `📍 ${shelterName} (${dist} किमी दूर)\nसुविधाएं: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nस्थिति: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 जिला आपदा नियंत्रण कक्ष: 1077 अथवा ${assessment.nearest_shelter.contact}`,
      timestamp: "आज, 10:45 AM • संजीवनी ब्रॉडकास्ट द्वारा प्रेषित",
    };
  },
  te: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "సంజీవని విపత్తు నిర్వహణ విభాగం",
      senderBadge: "అధికారిక జిల్లా హెచ్చరిక",
      header: isHigh
        ? `🚨 తీవ్ర వడగాల్పుల రెడ్ అలర్ట్: ${vName}`
        : `⚠️ వాతావరణ జాగ్రత్త హెచ్చరిక: ${vName}`,
      hazardBanner: `గరిష్ట ఉష్ణోగ్రత అంచనా: ${temp}°C | ముప్పు తీవ్రత: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} ప్రాంతంలో తీవ్రమైన వాతావరణ పరిస్థితులు నమోదయ్యాయి. కార్మికులు, వృద్ధులు మరియు పిల్లలు తక్షణ జాగ్రత్తలు తీసుకోవాలి.`
        : `${vName} లో రాబోయే 24 గంటల్లో ఉష్ణోగ్రత పెరిగే అవకాశం ఉంది. క్రమం తప్పకుండా మంచినీరు తాగండి.`,
      criticalAdvisory: isHigh
        ? "• ఉదయం 11:30 నుండి సాయంత్రం 4:00 వరకు ఎండలో పనులు ఆపండి.\n• ఓఆర్ఎస్ (ORS), మజ్జిగ పుష్కలంగా తీసుకోండి.\n• పశువులను నీడలో కట్టి, తగినంత తాగునీరు అందించండి."
        : "• మధ్యాహ్నం వేళల్లో ఎండలో తిరగడం తగ్గించండి.\n• ప్రయాణాల్లో తాగునీరు వెంట ఉంచుకోండి.\n• అసౌకర్యంగా ఉంటే వెంటనే ఆశా కార్యకర్తను సంప్రదించండి.",
      shelterHeading: "సమీప పునరావాస మరియు శీతలీకరణ కేంద్రం:",
      shelterDirections: `📍 ${shelterName} (${dist} కి.మీ దూరం)\nసౌకర్యాలు: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nస్థితి: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 జిల్లా కంట్రోల్ రూమ్ హెల్ప్‌లైన్: 1077 లేదా ${assessment.nearest_shelter.contact}`,
      timestamp: "ఈరోజు, 10:45 AM • సంజీవని అలర్ట్ ద్వారా పంపబడింది",
    };
  },
  ta: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "சஞ்சீவனி பேரிடர் மேலாண்மை பிரிவு",
      senderBadge: "அதிகாரப்பூர்வ மாவட்ட எச்சரிக்கை",
      header: isHigh
        ? `🚨 தீவிர வெப்ப அலை ரெட் அலர்ட்: ${vName}`
        : `⚠️ வானிலை முன்னெச்சரிக்கை அறிவிப்பு: ${vName}`,
      hazardBanner: `எதிர்பார்க்கப்படும் வெப்பநிலை: ${temp}°C | ஆபத்து அளவு: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} பகுதியில் கடுமையான வெப்பம் பதிவாகியுள்ளது. தொழிலாளர்கள் மற்றும் முதியவர்கள் உடனடியாக பாதுகாப்பு நடவடிக்கைகளை எடுக்கவும்.`
        : `${vName} பகுதியில் அடுத்த 24 மணி நேரத்தில் வெப்பநிலை அதிகரிக்கும் வாய்ப்புள்ளது. போதுமான அளவு தண்ணீர் குடிக்கவும்.`,
      criticalAdvisory: isHigh
        ? "• முற்பகல் 11:30 முதல் மாலை 4:00 வரை வெயிலில் வேலை செய்வதைத் தவிர்க்கவும்.\n• ஓ.ஆர்.எஸ் (ORS), மோர் மற்றும் எலுமிச்சை சாறு அதிகம் பருகவும்.\n• கால்நடைகளை நிழலில் கட்டி வைத்து தண்ணீர் கொடுக்கவும்."
        : "• நண்பகல் வேளையில் வெயிலில் செல்வதைத் தவிர்க்கவும்.\n• பயணங்களின் போது குடிநீர் எடுத்துச் செல்லவும்.\n• உடல்நலக்குறைவு ஏற்பட்டால் உடனே சுகாதார பணியாளரை அணுகவும்.",
      shelterHeading: "அங்கீகரிக்கப்பட்ட நிவாரண மையம்:",
      shelterDirections: `📍 ${shelterName} (${dist} கி.மீ தொலைவில்)\nவசதிகள்: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nநிலை: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 மாவட்ட பேரிடர் கட்டுப்பாட்டு அறை: 1077 அல்லது ${assessment.nearest_shelter.contact}`,
      timestamp: "இன்று, 10:45 AM • சஞ்சீவனி மூலம் அனுப்பப்பட்டது",
    };
  },
  bn: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "সঞ্জীবনী দুর্যোগ ব্যবস্থাপনা সেল",
      senderBadge: "সরকারি জেলা সতর্কবার্তা",
      header: isHigh
        ? `🚨 চরম তাপপ্রবাহ লাল সতর্কতা: ${vName}`
        : `⚠️ আবহাওয়া সতর্কতা ও পরামর্শ: ${vName}`,
      hazardBanner: `সর্বোচ্চ তাপমাত্রা পূর্বাভাস: ${temp}°C | ঝুঁকি মাত্রা: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} অঞ্চলে চরম তাপপ্রবাহের সম্ভাবনা রয়েছে। শ্রমিক, প্রবীণ নাগরিক ও শিশুদের দ্রুত সতর্কতামূলক পদক্ষেপ গ্রহণ করতে বলা হচ্ছে।`
        : `${vName} অঞ্চলে আগামী ২৪ ঘণ্টায় তাপমাত্রা বৃদ্ধির সম্ভাবনা। পর্যাপ্ত জল পান করুন ও সতর্ক থাকুন।`,
      criticalAdvisory: isHigh
        ? "• সকাল ১১:৩০ থেকে বিকেল ৪:০০ পর্যন্ত রোদে ভারী কাজ এড়িয়ে চলুন।\n• ওআরএস (ORS) ও তরল পানীয় গ্রহণ করুন।\n• গবাদি পশুকে ছায়াযুক্ত স্থানে পর্যাপ্ত জল দিয়ে রাখুন।"
        : "• দুপুরের রোদে সরাসরি বের হওয়া সীমিত করুন।\n• বাইরে যাওয়ার সময় সঙ্গে জল রাখুন।\n• অসুস্থ বোধ করলে অবিলম্বে আশা কর্মীর সাথে যোগাযোগ করুন।",
      shelterHeading: "নিকটবর্তী সরকারি ত্রাণ ও শীতলীকরণ কেন্দ্র:",
      shelterDirections: `📍 ${shelterName} (${dist} কিমি দূরে)\nসুবিধাসমূহ: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nঅবস্থা: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 জেলা দুর্যোগ নিয়ন্ত্রণ হেল্পলাইন: ১০৭৭ অথবা ${assessment.nearest_shelter.contact}`,
      timestamp: "আজ, সকাল ১০:৪৫ • সঞ্জীবনী ব্রডকাস্টের মাধ্যমে প্রেরিত",
    };
  },
  gu: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "સંજીવની આપત્તિ વ્યવસ્થાપન સેલ",
      senderBadge: "સત્તાવાર જિલ્લા ચેતવણી",
      header: isHigh
        ? `🚨 ગંભીર હીટવેવ રેડ એલર્ટ: ${vName}`
        : `⚠️ હવામાન સલાહકાર ચેતવણી: ${vName}`,
      hazardBanner: `અનુમાનિત મહત્તમ તાપમાન: ${temp}°C | જોખમ સ્તર: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} વિસ્તારમાં તીવ્ર લૂ અને ગરમીની સંભાવના છે. શ્રમિકો, વડીલો અને બાળકોએ તાત્કાલિક સાવચેતી રાખવી જરૂરી છે.`
        : `${vName} વિસ્તારમાં આગામી 24 કલાકમાં ગરમી વધી શકે છે. પૂરતું પાણી પીવો અને સુરક્ષિત રહો.`,
      criticalAdvisory: isHigh
        ? "• સવારે 11:30 થી બપોરે 4:00 વાગ્યા સુધી તડકામાં કામ કરવાનું ટાળો.\n• લીંબુ પાણી, છાશ અને ઓઆરએસ (ORS) નું સેવન વધારો.\n• પશુઓને છાંયડામાં રાખો અને સ્વચ્છ પાણી આપો."
        : "• બપોરના સમયે સીધા સૂર્યપ્રકાશથી બચો.\n• મુસાફરી કરતી વખતે પાણી સાથે રાખો.\n• ચક્કર આવે તો તરત આશા વર્કરનો સંપર્ક કરો.",
      shelterHeading: "નજીકનું સરકારી રાહત કેન્દ્ર:",
      shelterDirections: `📍 ${shelterName} (${dist} કિમી દૂર)\nસુવિધાઓ: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nસ્થિતિ: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 જિલ્લા આપત્તિ હેલ્પલાઇન: 1077 અથવા ${assessment.nearest_shelter.contact}`,
      timestamp: "આજે, સવારે 10:45 • સંજીવની પ્રસારણ દ્વારા",
    };
  },
  kn: (assessment: RiskAssessment) => {
    const isHigh = assessment.risk_level === "High";
    const temp = Math.round(assessment.weather.max_temperature_forecast);
    const vName = assessment.village.name;
    const shelterName = assessment.nearest_shelter.name;
    const dist = assessment.nearest_shelter.distanceKm ?? 1.5;

    return {
      senderTitle: "ಸಂಜೀವಿನಿ ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಕೋಶ",
      senderBadge: "ಅಧಿಕೃತ ಜಿಲ್ಲಾ ಮುನ್ಸೂಚನೆ",
      header: isHigh
        ? `🚨 ತೀವ್ರ ಶಾಖ ಅಲೆಯ ಕೆಂಪು ಎಚ್ಚರಿಕೆ: ${vName}`
        : `⚠️ ಹವಾಮಾನ ಜಾಗೃತಿ ಮುನ್ನೆಚ್ಚರಿಕೆ: ${vName}`,
      hazardBanner: `ನಿರೀಕ್ಷಿತ ಗರಿಷ್ಠ ತಾಪಮಾನ: ${temp}°C | ಅಪಾಯದ ಮಟ್ಟ: ${Math.round(assessment.overall_score * 100)}/100`,
      bodyParagraph: isHigh
        ? `${vName} ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ತೀವ್ರ ಉಷ್ಣತೆಯ ಪ್ರಮಾಣ ಕಂಡುಬಂದಿದೆ. ಕೂಲಿ ಕಾರ್ಮಿಕರು, ಹಿರಿಯರು ಮತ್ತು ಮಕ್ಕಳು ತಕ್ಷಣ ಮುನ್ನೆಚ್ಚರಿಕೆ ವಹಿಸಬೇಕು.`
        : `${vName} ಭಾಗದಲ್ಲಿ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ತಾಪಮಾನ ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಹೆಚ್ಚು ನೀರು ಕುಡಿಯಿರಿ.`,
      criticalAdvisory: isHigh
        ? "• ಬೆಳಿಗ್ಗೆ 11:30 ರಿಂದ ಮಧ್ಯಾಹ್ನ 4:00 ರವರೆಗೆ ಬಿಸಿಲಿನಲ್ಲಿ ಕೆಲಸ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ.\n• ಓಆರ್ಎಸ್ (ORS), ಮಜ್ಜಿಗೆ ಹೆಚ್ಚಾಗಿ ಸೇವಿಸಿ.\n• ಜಾನುವಾರುಗಳನ್ನು ನೆರಳಿನಲ್ಲಿ ಕಟ್ಟಿ ಕುಡಿಯುವ ನೀರು ಒದಗಿಸಿ."
        : "• ಮಧ್ಯಾಹ್ನದ ಸಮಯದಲ್ಲಿ ನೇರ ಬಿಸಿಲಿಗೆ ಹೋಗಬೇಡಿ.\n• ಪ್ರಯಾಣದ ವೇಳೆ ಕುಡಿಯುವ ನೀರು ತೆಗೆದುಕೊಂಡು ಹೋಗಿ.\n• ಅಸ್ವಸ್ಥತೆ ಎನಿಸಿದರೆ ತಕ್ಷಣ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      shelterHeading: "ನಿಯೋಜಿತ ಪರಿಹಾರ ಮತ್ತು ಶೀತಲೀಕರಣ ಕೇಂದ್ರ:",
      shelterDirections: `📍 ${shelterName} (${dist} ಕಿ.ಮೀ ದೂರ)\nಸೌಲಭ್ಯಗಳು: ${assessment.nearest_shelter.facilities.slice(0, 3).join(", ")}.\nಸ್ಥಿತಿ: ${assessment.nearest_shelter.open_status}`,
      helplineNotice: `📞 ಜಿಲ್ಲಾ ವಿಪತ್ತು ನಿಯಂತ್ರಣ ಕೊಠಡಿ: 1077 ಅಥವಾ ${assessment.nearest_shelter.contact}`,
      timestamp: "ಇಂದು, 10:45 AM • ಸಂಜೀವಿನಿ ಬ್ರಾಡ್‌ಕಾಸ್ಟ್ ಮೂಲಕ",
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
  hi: {
    appTitle: "संजीवनी",
    tagline: "पूर्वानುमान. चेतावनी. त्वरित कार्रवाई.",
    supervisorView: "पर्यवेक्षक डैशबोर्ड",
    residentView: "नागरिक अलर्ट पूर्वावलोकन",
    liveDataBadge: "लाइव मौसम डेटा",
    fallbackBadge: "बैकअप डेटा",
    villagesMonitored: "निगरानी अधीन ग्राम",
    highRiskAlerts: "उच्च जोखिम अलर्ट",
    avgScore: "औसत जिला जोखिम",
    activeReliefShelters: "सक्रिय राहत केंद्र",
    riskDetails: "जोखिम विश्लेषण",
    generateAlert: "व्हाट्सएप अलर्ट अनुकरण",
    logOutcome: "फील्ड परिणाम दर्ज करें",
    whatIfSimulation: "परिदृश्य सिमुलेशन",
    resetSimulation: "रीसेट करें",
    recentOutcomes: "हालिया सत्यापन",
  },
  te: {
    appTitle: "సంజీవని",
    tagline: "ముందస్తు అంచనా. హెచ్చరిక. ప్రతిస్పందన.",
    supervisorView: "అధికారుల డ్యాష్‌బోర్డ్",
    residentView: "పౌరుల హెచ్చరిక ప్రివ్యూ",
    liveDataBadge: "ప్రత్యక్ష వాతావరణం",
    fallbackBadge: "బ్యాకప్ డేటా",
    villagesMonitored: "పర్యవేక్షించబడుతున్న గ్రామాలు",
    highRiskAlerts: "తీవ్ర హెచ్చరికలు",
    avgScore: "సగటు జిల్లా ముప్పు",
    activeReliefShelters: "సహాయక కేంద్రాలు",
    riskDetails: "ముప్పు విశ్లేషణ",
    generateAlert: "వాట్సాప్ అలర్ట్ పంపండి",
    logOutcome: "క్షేత్రస్థాయి నివేదిక",
    whatIfSimulation: "సిమ్యులేషన్",
    resetSimulation: "రీసెట్",
    recentOutcomes: "తాజా ఫలితాలు",
  },
  ta: {
    appTitle: "சஞ்சீவனி",
    tagline: "கணிப்பு. எச்சரிக்கை. விரைவு நடவடிக்கை.",
    supervisorView: "அதிகாரிகள் கட்டுப்பாட்டு அறை",
    residentView: "பொதுமக்கள் எச்சரிக்கை பார்வை",
    liveDataBadge: "நேரலை வானிலை",
    fallbackBadge: "காப்புத் தரவு",
    villagesMonitored: "கண்காணிக்கப்படும் கிராமங்கள்",
    highRiskAlerts: "உயர் எச்சரிக்கைகள்",
    avgScore: "சராசரி மாவட்ட ஆபத்து",
    activeReliefShelters: "நிவாரண மையங்கள்",
    riskDetails: "ஆபத்து விவரம்",
    generateAlert: "வாட்ஸ்அப் எச்சரிக்கை",
    logOutcome: "கள அறிக்கை பதிவு",
    whatIfSimulation: "மாதிரி சோதனை",
    resetSimulation: "மீட்டமை",
    recentOutcomes: "சமீபத்திய முடிவுகள்",
  },
  bn: {
    appTitle: "সঞ্জীবনী",
    tagline: "পূর্বাভাস। সতর্কতা। প্রতিক্রিয়া।",
    supervisorView: "সুপারভাইজার ড্যাশবোর্ড",
    residentView: "নাগরিক সতর্কবার্তা প্রিভিউ",
    liveDataBadge: "লাইভ আবহাওয়া ডেটা",
    fallbackBadge: "ব্যাকআপ ডেটা",
    villagesMonitored: "নজরদারিতে থাকা গ্রাম",
    highRiskAlerts: "উচ্চ ঝুঁকি সতর্কতা",
    avgScore: "গড় জেলা ঝুঁকি",
    activeReliefShelters: "সক্রিয় ত্রাণ কেন্দ্র",
    riskDetails: "ঝুঁকি বিশ্লেষণ",
    generateAlert: "হোয়াটসঅ্যাপ সতর্কতা",
    logOutcome: "মাঠপর্যায়ের তথ্য সংরক্ষণ",
    whatIfSimulation: "দৃশ্যকল্প পরীক্ষা",
    resetSimulation: "রিসেট",
    recentOutcomes: "সাম্প্রতিক ফলাফল",
  },
  gu: {
    appTitle: "સંજીવની",
    tagline: "અનુમાન. ચેતવણી. ઝડપી પ્રતિસાદ.",
    supervisorView: "અધિકારી ડેશબોર્ડ",
    residentView: "નાગરિક ચેતવણી પૂર્વાવલોકન",
    liveDataBadge: "લાઇવ હવામાન ડેટા",
    fallbackBadge: "બેકઅપ ડેટા",
    villagesMonitored: "મોનિટર હેઠળના ગામો",
    highRiskAlerts: "હાઇ રિસ્ક એલર્ટ",
    avgScore: "સરેરાશ જિલ્લા જોખમ",
    activeReliefShelters: "સક્રિય રાહત કેન્દ્રો",
    riskDetails: "જોખમ વિશ્લેષણ",
    generateAlert: "વોટ્સએપ એલર્ટ",
    logOutcome: "ફીલ્ડ રિપોર્ટ નોંધો",
    whatIfSimulation: "સ્થિતિ પરીક્ષણ",
    resetSimulation: "રીસેટ",
    recentOutcomes: "તાજેતરના પરિણામો",
  },
  kn: {
    appTitle: "ಸಂಜೀವಿನಿ",
    tagline: "ಮುನ್ಸೂಚನೆ. ಎಚ್ಚರಿಕೆ. ತಕ್ಷಣದ ಸ್ಪಂದನೆ.",
    supervisorView: "ಅಧಿಕಾರಿಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    residentView: "ಸಾರ್ವಜನಿಕ ಎಚ್ಚರಿಕೆ ಮುನ್ನೋಟ",
    liveDataBadge: "ಲೈವ್ ಹವಾಮಾನ ಮಾಹಿತಿ",
    fallbackBadge: "ಬ್ಯಾಕಪ್ ಮಾಹಿತಿ",
    villagesMonitored: "ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಹಳ್ಳಿಗಳು",
    highRiskAlerts: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ಎಚ್ಚರಿಕೆಗಳು",
    avgScore: "ಸರಾಸರಿ ಜಿಲ್ಲಾ ಅಪಾಯ",
    activeReliefShelters: "ಸಕ್ರಿಯ ಪರಿಹಾರ ಕೇಂದ್ರಗಳು",
    riskDetails: "ಅಪಾಯದ ವಿವರಣೆ",
    generateAlert: "ವಾಟ್ಸಾಪ್ ಎಚ್ಚರಿಕೆ",
    logOutcome: "ಕ್ಷೇತ್ರ ಸಮೀಕ್ಷೆ ದಾಖಲಿಸಿ",
    whatIfSimulation: "ಪರಿಸ್ಥಿತಿ ಪರೀಕ್ಷೆ",
    resetSimulation: "ಮರುಹೊಂದಿಸಿ",
    recentOutcomes: "ಇತ್ತೀಚಿನ ಫಲಿತಾಂಶಗಳು",
  },
};
