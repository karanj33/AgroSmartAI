import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ResultCard } from './components/ResultCard';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import { CameraCapture } from './components/CameraCapture';
import { 
  Leaf, Search, History, Settings, Loader2, Droplets, 
  Info, Cloud, Globe, Volume2, TrendingDown, Mic, 
  MicOff, LayoutDashboard, MessageSquare, Sprout, 
  ShieldCheck, Bug, Thermometer, Wind, AlertTriangle,
  Bot, User, Send, X, Camera, Plus, Trash2
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [weatherAdvice, setWeatherAdvice] = useState(null);
  
  // New State for Smart Decision System
  const [view, setView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Farming Assistant. How can I help you today?', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [soilImage, setSoilImage] = useState(null);
  const [leafImage, setLeafImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState('leaf');

  // New State for Profit-Optimized Recommendation System
  const [soilType, setSoilType] = useState("Loamy");
  const [nutrientLevels, setNutrientLevels] = useState({ N: 60, P: 40, K: 50 });
  const [currentSeason, setCurrentSeason] = useState("Summer");

  const onDashboardAction = (action) => {
    let msg = "";
    switch(action) {
      case 'report_animal': msg = "I detected an animal intrusion. What immediate actions should I take to protect my crops?"; break;
      case 'fertilizer': msg = `Based on my soil (N:${nutrientLevels.N}, P:${nutrientLevels.P}, K:${nutrientLevels.K}), what are the best fertilizers for this season?`; break;
      case 'pest': msg = "What are the most effective and safe pest control methods for my region?"; break;
      case 'sustainable': msg = "How can I transition to more sustainable and organic farming practices?"; break;
      case 'rotation': msg = "Suggest a 3-year crop rotation plan to maintain soil health."; break;
      case 'soil_test': msg = "Where can I get my soil tested professionally and what parameters should I check?"; break;
      default: msg = "Tell me more about my farm health.";
    }
    
    setShowChat(true);
    setChatMessages(prev => [...prev, { role: 'user', content: msg, timestamp: Date.now() }]);
    handleChatResponse(msg);
  };

  const handleChatResponse = async (message) => {
    setIsTyping(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const context = result ? `Current Diagnosis: ${result.disease_name} (${result.severity}).` : "No specific disease detected yet.";
      const weatherContext = weather ? `Weather: ${weather.temperature}°C, ${weather.windspeed}km/h.` : "";
      
      const chatPrompt = `
        You are AgroDetect AI, a world-class agricultural expert.
        Context: ${context} ${weatherContext}
        Location: ${dashboardData?.weather?.location_name || 'Unknown'}
        Language: ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}.
        
        Farmer's Question: "${message}"
        
        Provide a helpful, practical, and grounded response. Use Google Search if needed for latest info.
        Keep it concise (max 4 sentences).
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: chatPrompt }] }],
        config: { tools: [{ googleSearch: {} }] }
      });
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that.", timestamp: Date.now() }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI assistant.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const translations = {
    en: {
      scan: "Scan",
      history: "History",
      getStarted: "Get Started",
      weather: "Local Weather",
      weatherWarning: "Weather Warning",
      mandi: "Top Market Prices",
      news: "Agri News (Yesterday)",
      heroTitle: "Heal your plants with",
      heroSubtitle: "Precision AI",
      heroDesc: "Upload a photo or speak your problem to identify diseases instantly. Get expert treatment recommendations powered by deep learning.",
      analyzing: "Analyzing Leaf Patterns...",
      diagnosing: "Diagnosing Spoken Problem...",
      comparing: "Comparing against 10,000+ disease signatures",
      speakProblem: "Speak Your Problem",
      stopRecording: "Stop Recording",
      listening: "Listening...",
      features: [
        { title: "Instant Detection", desc: "Identify 50+ common plant diseases in seconds with high precision." },
        { title: "Voice Assistant", desc: "Describe your crop problem using voice and get instant AI guidance." },
        { title: "Scan History", desc: "Keep track of your plant health over time with our integrated history tool." }
      ],
      recentScans: "Recent Scans",
      healthy: "Healthy",
      alert: "Alert",
      settings: "Settings",
      close: "Close",
      language: "Language",
      theme: "Theme",
      notifications: "Notifications",
      historyTitle: "Your Scan History",
      clearHistory: "Clear All",
      noHistory: "No scans yet. Start by uploading a leaf image!",
      youSaid: "You said:",
      dashboard: "Dashboard",
      analysis: "Analysis",
      chat: "AI Chat",
      cropHealth: "Crop Health",
      diseaseRisk: "Disease Risk",
      irrigation: "Irrigation",
      pestRisk: "Pest Risk",
      soilNutrients: "Soil Nutrients",
      nutrientStatus: "Nutrient Status",
      weatherTitle: "Weather Forecast",
      temp: "Temperature",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      rainfall: "Rainfall %",
      condition: "Condition",
      searchCity: "Search City",
      smartAdvice: "Smart Advice",
      adviceText: "Based on current conditions, we recommend monitoring for fungal growth and adjusting irrigation.",
      viewDetails: "View Details",
      aiAssistant: "AI Assistant",
      online: "Online",
      askAnything: "Ask anything about farming...",
      listen: "Listen",
      uploadLeaf: "Upload Leaf Image",
      uploadSoil: "Upload Soil Image (Optional)",
      startAnalysis: "Start Smart Analysis",
      growthStage: "Growth Stage",
      yieldPrediction: "Yield Prediction",
      chemical: "Chemical Spray",
      organic: "Organic Treatment",
      fertilizer: "Fertilizer Support",
      treatment: "Recommended Treatment",
      immediateActions: "Immediate Actions",
      prevention: "Prevention Tips",
      impact: "Yield Impact",
      cost: "Estimated Cost",
      animalDetected: "Animal Intrusion Detected",
      takeAction: "Take Action",
      security: "Farm Security",
      reportAnimal: "Report Animal Intrusion",
      farmingKnowledge: "Smart Farming Knowledge",
      bestFertilizer: "Best Fertilizers",
      pestControl: "Pest Control Tips",
      sustainableAg: "Sustainable Agriculture",
      profitPotential: "Profit Potential",
      expectedYield: "Expected Yield",
      marketPrice: "Market Price",
      suitability: "Suitability",
      soilType: "Soil Type",
      season: "Season",
      nutrients: "Nutrients",
      cropRecs: "Profit-Optimized Recommendations",
      whySuitable: "Why it's suitable",
      fertilizerAdvice: "Fertilizer Advice",
      irrigationAdvice: "Irrigation Advice",
      preventionMeasures: "Prevention Measures",
    },
    hi: {
      scan: "स्कैन करें",
      history: "इतिहास",
      getStarted: "शुरू करें",
      weather: "स्थानीय मौसम",
      weatherWarning: "मौसम की चेतावनी",
      mandi: "शीर्ष बाजार भाव",
      news: "कृषि समाचार (कल)",
      heroTitle: "अपने पौधों को ठीक करें",
      heroSubtitle: "सटीक AI के साथ",
      heroDesc: "बीमारियों की तुरंत पहचान करने के लिए फोटो अपलोड करें या अपनी समस्या बोलें। विशेषज्ञ उपचार सिफारिशें प्राप्त करें।",
      analyzing: "पत्ती के पैटर्न का विश्लेषण...",
      diagnosing: "बोली गई समस्या का निदान...",
      comparing: "10,000+ बीमारी हस्ताक्षरों के साथ तुलना",
      speakProblem: "अपनी समस्या बोलें",
      stopRecording: "रिकॉर्डिंग बंद करें",
      listening: "सुन रहे हैं...",
      features: [
        { title: "त्वरित पहचान", desc: "उच्च सटीकता के साथ सेकंड में 50+ सामान्य पौधों की बीमारियों की पहचान करें।" },
        { title: "आवाज सहायक", desc: "आवाज का उपयोग करके अपनी फसल की समस्या का वर्णन करें और तुरंत मार्गदर्शन प्राप्त करें।" },
        { title: "स्कैन इतिहास", desc: "हमारे एकीकृत इतिहास टूल के साथ समय के साथ अपने पौधों के स्वास्थ्य पर नज़र रखें।" }
      ],
      recentScans: "हाल के स्कैन",
      healthy: "स्वस्थ",
      alert: "अलर्ट",
      settings: "सेटिंग्स",
      close: "बंद करें",
      language: "भाषा",
      theme: "थीम",
      notifications: "सूचनाएं",
      historyTitle: "आपका स्कैन इतिहास",
      clearHistory: "सभी साफ करें",
      noHistory: "अभी तक कोई स्कैन नहीं। पत्ती की छवि अपलोड करके शुरू करें!",
      youSaid: "आपने कहा:",
      dashboard: "डैशबोर्ड",
      analysis: "विश्लेषण",
      chat: "AI चैट",
      cropHealth: "फसल स्वास्थ्य",
      diseaseRisk: "बीमारी का जोखिम",
      irrigation: "सिंचाई",
      pestRisk: "कीट जोखिम",
      soilNutrients: "मिट्टी के पोषक तत्व",
      nutrientStatus: "पोषक तत्व स्थिति",
      weatherTitle: "मौसम पूर्वानुमान",
      temp: "तापमान",
      humidity: "नमी",
      windSpeed: "हवा की गति",
      rainfall: "बारिश %",
      condition: "स्थिति",
      searchCity: "शहर खोजें",
      smartAdvice: "स्मार्ट सलाह",
      adviceText: "वर्तमान स्थितियों के आधार पर, हम कवक वृद्धि की निगरानी करने और सिंचाई को समायोजित करने की सलाह देते हैं।",
      viewDetails: "विवरण देखें",
      aiAssistant: "AI सहायक",
      online: "ऑनलाइन",
      askAnything: "खेती के बारे में कुछ भी पूछें...",
      listen: "सुनें",
      uploadLeaf: "पत्ती की छवि अपलोड करें",
      uploadSoil: "मिट्टी की छवि अपलोड करें (वैकल्पिक)",
      startAnalysis: "स्मार्ट विश्लेषण शुरू करें",
      growthStage: "विकास चरण",
      yieldPrediction: "उपज भविष्यवाणी",
      chemical: "रासायनिक स्प्रे",
      organic: "जैविक उपचार",
      fertilizer: "उर्वरक सहायता",
      treatment: "अनुशंसित उपचार",
      immediateActions: "त्वरित कार्रवाई",
      prevention: "निवारण युक्तियाँ",
      impact: "उपज प्रभाव",
      cost: "अनुमानित लागत",
      animalDetected: "जानवरों की घुसपैठ का पता चला",
      takeAction: "कार्रवाई करें",
      security: "खेत की सुरक्षा",
      reportAnimal: "जानवरों की घुसपैठ की रिपोर्ट करें",
      farmingKnowledge: "स्मार्ट खेती का ज्ञान",
      bestFertilizer: "सर्वोत्तम उर्वरक",
      pestControl: "कीट नियंत्रण युक्तियाँ",
      sustainableAg: "सतत कृषि",
      profitPotential: "लाभ की संभावना",
      expectedYield: "अपेक्षित उपज",
      marketPrice: "बाजार मूल्य",
      suitability: "उपयुक्तता",
      soilType: "मिट्टी का प्रकार",
      season: "सीजन",
      nutrients: "पोषक तत्व",
      cropRecs: "लाभ-अनुकूलित सिफारिशें",
      whySuitable: "यह क्यों उपयुक्त है",
      fertilizerAdvice: "उर्वरक सलाह",
      irrigationAdvice: "सिंचाई सलाह",
      preventionMeasures: "निवारण उपाय",
    },
    te: {
      scan: "స్కాన్ చేయండి",
      history: "చరిత్ర",
      getStarted: "ప్రారంభించండి",
      weather: "స్థానిక వాతావరణం",
      weatherWarning: "వాతావరణ హెచ్చరిక",
      mandi: "మార్కెట్ ధరలు",
      news: "వ్యవసాయ వార్తలు (నిన్న)",
      heroTitle: "మీ మొక్కలను నయం చేయండి",
      heroSubtitle: "ఖచ్చితమైన AI తో",
      heroDesc: "వ్యాధులను తక్షణమే గుర్తించడానికి ఫోటోను అప్‌లోడ్ చేయండి లేదా మీ సమస్యను మాట్లాడండి. నిపుణుల చికిత్స సిఫార్సులను పొందండి.",
      analyzing: "ఆకు నమూనాల విశ్లేషణ...",
      diagnosing: "మాట్లాడిన సమస్య నిర్ధారణ...",
      comparing: "10,000+ వ్యాధి సంతకాలతో పోలిక",
      speakProblem: "మీ సమస్యను చెప్పండి",
      stopRecording: "రికార్డింగ్ ఆపు",
      listening: "వింటున్నాము...",
      features: [
        { title: "తక్షణ గుర్తింపు", desc: "సెకన్లలో 50+ సాధారణ మొక్కల వ్యాధులను ఖచ్చితత్వంతో గుర్తించండి." },
        { title: "వాయిస్ అసిస్టెంట్", desc: "వాయిస్ ఉపయోగించి మీ పంట సమస్యను వివరించండి మరియు తక్షణ మార్గదర్శకత్వం పొందండి." },
        { title: "స్కాన్ చరిత్ర", desc: "మా ఇంటిగ్రేటెడ్ హిస్టరీ టూల్‌తో మీ మొక్కల ఆరోగ్యాన్ని ట్రాక్ చేయండి." }
      ],
      recentScans: "ఇటీవలి స్కాన్‌లు",
      healthy: "ఆరోగ్యకరమైనది",
      alert: "అలర్ట్",
      settings: "సెట్టింగులు",
      close: "మూసివేయి",
      language: "భాష",
      theme: "థీమ్",
      notifications: "నోటిఫికేషన్లు",
      historyTitle: "మీ స్కాన్ చరిత్ర",
      clearHistory: "అన్నీ తొలగించు",
      noHistory: "ఇంకా స్కాన్‌లు లేవు. ఆకు చిత్రాన్ని అప్‌లోడ్ చేయడం ద్వారా ప్రారంభించండి!",
      youSaid: "మీరు చెప్పింది:",
      dashboard: "డ్యాష్‌బోర్డ్",
      analysis: "విశ్లేషణ",
      chat: "AI చాట్",
      cropHealth: "పంట ఆరోగ్యం",
      diseaseRisk: "వ్యాధి ప్రమాదం",
      irrigation: "నీటి పారుదల",
      pestRisk: "కీటకాల ప్రమాదం",
      soilNutrients: "నేల పోషకాలు",
      nutrientStatus: "పోషకాల స్థితి",
      weatherTitle: "వాతావరణ సూచన",
      temp: "ఉష్ణోగ్రత",
      humidity: "తేమ",
      windSpeed: "గాలి వేగం",
      rainfall: "వర్షం %",
      condition: "పరిస్థితి",
      searchCity: "నగరాన్ని వెతకండి",
      smartAdvice: "స్మార్ట్ సలహా",
      adviceText: "ప్రస్తుత పరిస్థితుల ఆధారంగా, శిలీంధ్రాల పెరుగుదలను పర్యవేక్షించాలని మరియు నీటి పారుదలను సర్దుబాటు చేయాలని మేము సిఫార్సు చేస్తున్నాము.",
      viewDetails: "వివరాలను చూడండి",
      aiAssistant: "AI అసిస్టెంట్",
      online: "ఆన్‌లైన్",
      askAnything: "వ్యవసాయం గురించి ఏదైనా అడగండి...",
      listen: "వినండి",
      uploadLeaf: "ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి",
      uploadSoil: "నేల చిత్రాన్ని అప్‌లోడ్ చేయండి (ఐచ్ఛికం)",
      startAnalysis: "స్మార్ట్ విశ్లేషణ ప్రారంభించండి",
      growthStage: "పెరుగుదల దశ",
      yieldPrediction: "దిగుబడి అంచనా",
      chemical: "రసాయన స్ప్రే",
      organic: "సేంద్రీయ చికిత్స",
      fertilizer: "ఎరువుల మద్దతు",
      treatment: "సిఫార్సు చేసిన చికిత్స",
      immediateActions: "తక్షణ చర్యలు",
      prevention: "నివారణ చిట్కాలు",
      impact: "దిగుబడి ప్రభావం",
      cost: "అంచనా వ్యయం",
      animalDetected: "జంతువుల చొరబాటు గుర్తించబడింది",
      takeAction: "చర్య తీసుకోండి",
      security: "ఫామ్ సెక్యూరిటీ",
      reportAnimal: "జంతువుల చొరబాటును నివేదించండి",
      farmingKnowledge: "స్మార్ట్ ఫార్మింగ్ నాలెడ్జ్",
      bestFertilizer: "ఉత్తమ ఎరువులు",
      pestControl: "కీటక నియంత్రణ చిట్కాలు",
      sustainableAg: "సుస్థిర వ్యవసాయం",
      profitPotential: "లాభదాయకత",
      expectedYield: "అంచనా దిగుబడి",
      marketPrice: "మార్కెట్ ధర",
      suitability: "అనుకూలత",
      soilType: "నేల రకం",
      season: "సీజన్",
      nutrients: "పోషకాలు",
      cropRecs: "లాభదాయకమైన పంట సిఫార్సులు",
      whySuitable: "ఎందుకు అనుకూలం",
      fertilizerAdvice: "ఎరువుల సలహా",
      irrigationAdvice: "నీటి పారుదల సలహా",
      preventionMeasures: "నివారణ చర్యలు",
    }
  };

  const t = translations[lang];

  const fetchDashboardData = useCallback(async (manualLat, manualLon, manualName) => {
    const generateData = async (lat, lon, name) => {
      try {
        let temp = 25;
        let humidity = 60;
        let rainChance = 0;
        let windSpeed = 10;
        let condition = "Clear";
        let locationName = name || "Unknown Location";

        if (lat && lon) {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability`),
            name ? Promise.resolve({ json: () => ({ address: { city: name } }) }) : fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          ]);
          
          const weatherData = await weatherRes.json();
          let geoData = {};
          if (!name) {
            geoData = await geoRes.json();
            locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.suburb || geoData.address?.neighbourhood || geoData.address?.state || "Your Farm";
          }
          
          setWeather(weatherData.current_weather);
          temp = weatherData.current_weather.temperature;
          windSpeed = weatherData.current_weather.windspeed;
          humidity = weatherData.hourly?.relative_humidity_2m?.[0] || 60;
          rainChance = weatherData.hourly?.precipitation_probability?.[24] || 0;
          
          const code = weatherData.current_weather.weathercode;
          if (code === 0) condition = "Clear";
          else if (code <= 3) condition = "Partly Cloudy";
          else if (code <= 48) condition = "Foggy";
          else if (code <= 67) condition = "Rainy";
          else if (code <= 77) condition = "Snowy";
          else condition = "Thunderstorm";
        }
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const cacheKey = `agro_dash_${locationName}_${temp}_${lang}`;
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            setDashboardData(parsed.data);
            setWeatherAdvice(parsed.advice);
            return;
          }

          try {
            const ai = new GoogleGenAI({ apiKey });
            
            const combinedPrompt = `
              As a world-class agricultural AI expert, generate a highly realistic, dynamic smart farming dashboard for a farm in ${locationName}.
              Current Environment: Temp: ${temp}°C, Humidity: ${humidity}%, Wind: ${windSpeed}km/h, Condition: ${condition}.
              Farmer's Soil Profile: Type: ${soilType}, Nutrients: N:${nutrientLevels.N}, P:${nutrientLevels.P}, K:${nutrientLevels.K}.
              Current Season: ${currentSeason}.
              
              Task 1: Predict the top 5 crops with the HIGHEST EXPECTED PROFIT for this field.
              Task 2: Find the LATEST active government agriculture schemes for farmers in ${locationName} or India.
              
              Return JSON matching this structure:
              {
                "dashboard": {
                  "crop_health": { "status": "Healthy|Warning|Critical", "score": number, "trend": "improving|stable|declining" },
                  "soil_nutrients": { "nitrogen": ${nutrientLevels.N}, "phosphorus": ${nutrientLevels.P}, "potassium": ${nutrientLevels.K}, "status": "Optimal|Deficient|Excessive" },
                  "disease_risk": { "level": "Low|Medium|High", "likely_diseases": ["string"] },
                  "weather": { "temp": number, "humidity": number, "rainfall": number, "alerts": ["string"], "location_name": "${locationName}", "wind_speed": ${windSpeed}, "condition": "${condition}" },
                  "irrigation": { "needed": boolean, "frequency": "string", "next_session": "string" },
                  "pest_risk": { "level": "Low|Medium|High", "active_pests": ["string"] },
                  "animal_intrusion": { "detected": boolean, "animal_type": "string", "recommendation": "string" },
                  "recommended_crops": [
                    { 
                      "name": "string", 
                      "suitability": number (0-100), 
                      "profit_potential": "High|Medium|Low",
                      "expected_yield": "string",
                      "market_price": "string",
                      "reason": "explanation in ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}",
                      "fertilizer_advice": "string",
                      "irrigation_advice": "string",
                      "prevention_measures": "string"
                    }
                  ],
                  "govt_schemes": [
                    {
                      "name": "string",
                      "description": "string",
                      "last_date": "string (YYYY-MM-DD)",
                      "eligibility": "string",
                      "apply_link": "string"
                    }
                  ],
                  "agri_news": ["string"],
                  "growth_history": [
                    { "day": "Mon", "height": number, "health": number },
                    { "day": "Tue", "height": number, "health": number },
                    { "day": "Wed", "height": number, "health": number },
                    { "day": "Thu", "height": number, "health": number },
                    { "day": "Fri", "height": number, "health": number },
                    { "day": "Sat", "height": number, "health": number },
                    { "day": "Sun", "height": number, "health": number }
                  ]
                },
                "advice": "A short advice in ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}."
              }
              
              CRITICAL: Only include govt_schemes that have NOT expired (current date is ${new Date().toISOString().split('T')[0]}).
            `;
            const res = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [{ parts: [{ text: combinedPrompt }] }],
              config: { 
                responseMimeType: "application/json",
                tools: [{ googleSearch: {} }]
              }
            });
            
            const result = JSON.parse(res.text || '{}');
            const parsedDash = result.dashboard || {};
            
            parsedDash.weather = {
              ...parsedDash.weather,
              temp: temp,
              humidity: humidity,
              location_name: locationName,
              rain_chance_tomorrow: rainChance,
              wind_speed: windSpeed,
              condition: condition
            };
            
            setDashboardData(parsedDash);
            setWeatherAdvice(result.advice || null);
            
            sessionStorage.setItem(cacheKey, JSON.stringify({
              data: parsedDash,
              advice: result.advice,
              timestamp: Date.now()
            }));
          } catch (apiError) {
            console.warn("AI Dashboard generation failed", apiError);
            const fallbackData = {
              crop_health: { status: "Healthy", score: 85, trend: "stable" },
              soil_nutrients: { nitrogen: 65, phosphorus: 45, potassium: 55, status: "Optimal" },
              disease_risk: { level: "Low", likely_diseases: ["None detected"] },
              weather: { temp, humidity, rainfall: 0, alerts: ["No immediate weather alerts"], location_name: locationName, rain_chance_tomorrow: rainChance, wind_speed: windSpeed, condition },
              irrigation: { needed: false, frequency: "Every 2 days", next_session: "Tomorrow 6:00 AM" },
              pest_risk: { level: "Low", active_pests: ["None"] },
              animal_intrusion: { detected: false, animal_type: "None", recommendation: "Secure perimeter" },
              recommended_crops: [{ 
                name: "Wheat", 
                suitability: 90, 
                profit_potential: "High",
                expected_yield: "18-22 quintals/acre",
                market_price: "₹2200-2400/quintal",
                reason: "Ideal for current soil and weather",
                fertilizer_advice: "Apply NPK 12:32:16",
                irrigation_advice: "Water every 10 days",
                prevention_measures: "Monitor for rust disease"
              }],
              govt_schemes: [
                {
                  name: "PM-KISAN",
                  description: "Direct income support of ₹6000 per year to all landholding farmer families.",
                  last_date: "Ongoing",
                  eligibility: "All landholding farmers",
                  apply_link: "https://pmkisan.gov.in/"
                }
              ],
              agri_news: [
                "Government announces new subsidy for organic fertilizers.",
                "Monsoon expected to be normal this year, says IMD."
              ],
              growth_history: [
                { day: "Mon", height: 10, health: 80 }, { day: "Tue", height: 12, health: 82 }, { day: "Wed", height: 15, health: 85 },
                { day: "Thu", height: 18, health: 84 }, { day: "Fri", height: 20, health: 86 }, { day: "Sat", height: 22, health: 88 }, { day: "Sun", height: 25, health: 90 }
              ]
            };
            setDashboardData(fallbackData);
            setWeatherAdvice(lang === 'hi' ? "मौसम अनुकूल है।" : lang === 'te' ? "వాతావరణం అనుకూలంగా ఉంది." : "Weather is favorable.");
          }
        }
      } catch (e) {
        console.error("Dashboard/Weather fetch failed", e);
      }
    };

    if (manualLat && manualLon) {
      generateData(manualLat, manualLon, manualName);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => generateData(pos.coords.latitude, pos.coords.longitude),
        () => generateData() // Fallback if permission denied
      );
    } else {
      generateData(); // Fallback if geolocation not supported
    }
  }, [lang, soilType, nutrientLevels, currentSeason]);

  // Get Weather and Generate Dashboard on Load
  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('agro_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSendMessage = async (content) => {
    const newUserMsg = { role: 'user', content, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const weatherContext = dashboardData ? 
        `Current Weather in ${dashboardData.weather.location_name}: ${dashboardData.weather.temp}°C, ${dashboardData.weather.humidity}% humidity, ${dashboardData.weather.wind_speed}km/h wind, ${dashboardData.weather.condition}.` : 
        "Weather data currently unavailable.";

      const cropContext = dashboardData?.recommended_crops ? 
        `Top Recommended Crops for Profit: ${dashboardData.recommended_crops.map(c => `${c.name} (${c.profit_potential} Profit, Yield: ${c.expected_yield})`).join(', ')}.` : 
        "Crop recommendations currently unavailable.";

      const chatPrompt = `
        You are a helpful AI Farming Assistant. Answer the user's question simply and clearly.
        Weather Context: ${weatherContext}
        Crop Context: ${cropContext}
        Soil Context: Type: ${soilType}, Nutrients: N:${nutrientLevels.N}, P:${nutrientLevels.P}, K:${nutrientLevels.K}.
        Season: ${currentSeason}.
        
        User Question: "${content}"
        Language: ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}.
        
        If the user asks about what to grow for profit, use the Crop Context to provide the top 5 recommendations with details on yield and market price.
        If the question is about irrigation, use the current weather to decide if watering is needed.
        If the question is about diseases, pests, or soil, provide actionable advice based on current conditions.
        Always support Text-to-Speech by keeping responses concise and clear.
      `;

      const res = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [{ parts: [{ text: chatPrompt }] }],
      });

      const aiMsg = { 
        role: 'assistant', 
        content: res.text || "I'm sorry, I couldn't process that.", 
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error("Chat failed", e);
    } finally {
      setIsTyping(false);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const clearHistory = () => {
    if (window.confirm(t.clearHistory + "?")) {
      setHistory([]);
      localStorage.removeItem('agro_history');
    }
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    
    setIsSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationInput)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data[0]) {
        const { lat, lon, display_name } = data[0];
        fetchDashboardData(parseFloat(lat), parseFloat(lon), display_name.split(',')[0]);
        setLocationInput("");
      } else {
        setError("Location not found. Please try another city.");
      }
    } catch (e) {
      setError("Failed to search location.");
    } finally {
      setIsSearchingLocation(false);
    }
  };
  const handleSmartAnalysis = async () => {
    if (!leafImage && !transcription) {
      setError("Please upload a leaf image or describe the problem via voice.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      const prompt = `
        You are AgroSmart AI, a world-class agricultural expert. 
        Analyze the provided inputs (Leaf Image, Soil Image, and/or Voice Description) to provide a comprehensive Smart Agriculture Decision Report.
        
        Inputs Provided:
        - Leaf Image: ${leafImage ? 'Yes' : 'No'}
        - Soil Image: ${soilImage ? 'Yes' : 'No'}
        - Voice/Text Description: "${transcription || 'None'}"
        - Current Weather: ${weather?.temperature || 'Unknown'}°C, ${weather?.windspeed || 'Unknown'}km/h
        
        Language: ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}.
        
        Provide a detailed report in strictly valid JSON format:
        {
          "disease_name": "string (Simple name)",
          "confidence": number (0-100),
          "severity": "Low | Medium | High",
          "risk_percentage": number (0-100),
          "expected_damage": "string (e.g. 15% yield loss if untreated)",
          "cure_time": "string (e.g. 7-10 days)",
          "what_happened": "string (Detailed explanation)",
          "immediate_actions": ["string"],
          "treatment": {
            "chemical": { 
              "name": "string", 
              "how_to_spray": "string", 
              "dosage": "string", 
              "image_url": "string" 
            },
            "organic": { 
              "name": "string", 
              "image_url": "string" 
            },
            "fertilizer": { 
              "name": "string", 
              "image_url": "string" 
            }
          },
          "prevention_tips": ["string"],
          "yield_impact": "string",
          "cost_estimate": "string",
          "govt_schemes": ["string"],
          "ai_advice": "string",
          "growth_stage": "string",
          "yield_prediction": "string"
        }
        
        CRITICAL: Calculate "cure_time" and "risk_percentage" dynamically based on the disease severity and current weather conditions.
      `;

      const parts = [{ text: prompt }];
      if (leafImage) parts.push({ inlineData: { mimeType: "image/jpeg", data: leafImage.split(",")[1] || leafImage } });
      if (soilImage) parts.push({ inlineData: { mimeType: "image/jpeg", data: soilImage.split(",")[1] || soilImage } });

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts }],
        config: { 
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
      
      const newHistory = [{ ...data, date: new Date().toISOString(), image: leafImage || soilImage }, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('agro_history', JSON.stringify(newHistory));

    } catch (err) {
      setError(err.message || "Failed to perform smart analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceDiagnosis = async (text) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-flash-latest";

      const prompt = `
        You are AgroDetect AI. A farmer described their crop problem: "${text}".
        Identify the possible disease and provide a simple report.
        Language: ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}.
        Use VERY simple language.
        
        Return JSON:
        {
          "disease_name": "string",
          "confidence": number (0-100),
          "severity": "Low | Medium | High",
          "what_happened": "string",
          "immediate_actions": ["string"],
          "treatment": {
            "chemical": { 
              "name": "string", 
              "how_to_spray": "string", 
              "dosage": "string",
              "image_url": "string (A high quality image URL of the chemical product. Use https://source.unsplash.com/featured/?pesticide,{name})"
            },
            "organic": {
              "name": "string",
              "image_url": "string (A high quality image URL of the organic product. Use https://source.unsplash.com/featured/?organic,farming,{name})"
            },
            "fertilizer": {
              "name": "string",
              "image_url": "string (A high quality image URL of the fertilizer. Use https://source.unsplash.com/featured/?fertilizer,{name})"
            }
          },
          "prevention_tips": ["string"],
          "yield_impact": "string",
          "cost_estimate": "string (in Indian Rupees ₹)",
          "govt_schemes": ["string"],
          "ai_advice": "string",
          "crop_price_trends": {
            "crop_name": "string",
            "past_price": "string (in ₹)",
            "present_price": "string (in ₹)",
            "future_price": "string (in ₹)",
            "prediction_reason": "string"
          }
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
      
      const newHistory = [{ ...data, date: new Date().toISOString(), isVoice: true }, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('agro_history', JSON.stringify(newHistory));

    } catch (err) {
      setError(err.message || "Failed to analyze voice input");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => {
      setError("Voice recognition error: " + event.error);
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscription(text);
      handleVoiceDiagnosis(text);
    };

    recognition.start();
  };

  const handleImageSelect = async (base64) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      const prompt = `
        You are AgroDetect AI, a friendly agricultural expert. 
        Analyze this plant leaf image and provide a simple, practical report for a farmer.
        Language: ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}.
        
        CRITICAL: If the image is NOT a plant, NOT a leaf, or NO disease is found, set:
        - "disease_name": "No Disease Detected"
        - "severity": "Low Risk"
        - "risk_percentage": 0
        - "what_happened": "The plant looks healthy or the image is not clear."
        
        Return the response in strictly valid JSON format with these exact keys:
        {
          "disease_name": "string",
          "confidence": number,
          "severity": "Low | Medium | High",
          "risk_percentage": number,
          "expected_damage": "string",
          "cure_time": "string",
          "what_happened": "string",
          "immediate_actions": ["string"],
          "treatment": {
            "chemical": { "name": "string", "how_to_spray": "string", "dosage": "string" },
            "organic": { "name": "string" },
            "fertilizer": { "name": "string" }
          },
          "prevention_tips": ["string"],
          "yield_impact": "string",
          "cost_estimate": "string",
          "govt_schemes": ["string"],
          "ai_advice": "string",
          "cure_time": "string",
          "risk_percentage": number,
          "crop_price_trends": {
            "crop_name": "string",
            "past_price": "string",
            "present_price": "string",
            "future_price": "string",
            "prediction_reason": "string"
          }
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64.split(",")[1] || base64 } }
          ]
        }],
        config: { 
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
      
      const newHistory = [{ ...data, date: new Date().toISOString(), image: base64 }, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('agro_history', JSON.stringify(newHistory));

    } catch (err) {
      setError(err.message || "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async (message, currentDiagnosis, imageBase64) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return "API Key missing";
      const ai = new GoogleGenAI({ apiKey });
      const chatPrompt = `
        Expert: AgroDetect AI. 
        Context: ${currentDiagnosis?.disease_name || 'General Query'} (${currentDiagnosis?.severity || 'N/A'}).
        Language: ${lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'English'}.
        Farmer: "${message}"
        Respond in VERY simple language. Max 3 sentences. Use latest grounded info.
      `;
      
      const contents = [{ parts: [{ text: chatPrompt }] }];
      if (imageBase64) {
        contents[0].parts.push({
          inlineData: { mimeType: "image/jpeg", data: imageBase64.split(",")[1] || imageBase64 }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: { tools: [{ googleSearch: {} }] }
      });
      return response.text || "Error";
    } catch (err) { return "Error"; }
  };

  const handleSpeak = async (text) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this report for a farmer: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audio.play();
      }
    } catch (e) { console.error("TTS failed", e); }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-xl font-serif font-semibold tracking-tight">AgroSmart AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 p-1 bg-stone-100 rounded-2xl">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'dashboard' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard size={16} />
              {t.dashboard}
            </button>
            <button 
              onClick={() => setView('analysis')}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'analysis' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Search size={16} />
              {t.analysis}
            </button>
            <button 
              onClick={() => setShowChat(true)}
              className="px-6 py-2 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-900 transition-all flex items-center gap-2"
            >
              <MessageSquare size={16} />
              {t.chat}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const langs = ['en', 'hi', 'te'];
                const nextIdx = (langs.indexOf(lang) + 1) % langs.length;
                setLang(langs[nextIdx]);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition-colors"
            >
              <Globe size={14} />
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <History size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {dashboardData ? (
                <Dashboard 
                  data={dashboardData} 
                  t={t} 
                  onUploadLeaf={() => { setView('analysis'); }}
                  onUploadSoil={() => { setView('analysis'); }}
                  onOpenCamera={() => { setCameraTarget('leaf'); setIsCameraOpen(true); }}
                  onRefresh={() => fetchDashboardData()}
                  result={result}
                  onViewAnalysis={() => setView('analysis')}
                  locationInput={locationInput}
                  setLocationInput={setLocationInput}
                  onSearchLocation={handleSearchLocation}
                  isSearchingLocation={isSearchingLocation}
                  soilType={soilType}
                  setSoilType={setSoilType}
                  nutrientLevels={nutrientLevels}
                  setNutrientLevels={setNutrientLevels}
                  currentSeason={currentSeason}
                  setCurrentSeason={setCurrentSeason}
                  onDashboardAction={onDashboardAction}
                />
              ) : (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                  <Loader2 className="text-emerald-600 animate-spin" size={48} />
                  <p className="text-stone-500 font-medium">Loading Farm Intelligence...</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <header className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 tracking-tight">
                  {t.heroTitle} <br />
                  <span className="italic text-emerald-600">{t.heroSubtitle}</span>
                </h1>
                <p className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed">
                  {t.heroDesc}
                </p>
              </header>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.uploadLeaf}</label>
                      <div className="flex flex-col gap-3">
                        <ImageUpload onImageSelect={setLeafImage} label={t.uploadLeaf} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.uploadSoil}</label>
                      <div className="flex flex-col gap-3">
                        <ImageUpload onImageSelect={setSoilImage} label={t.uploadSoil} />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Mic className="text-emerald-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-medium">{t.speakProblem}</h3>
                        <p className="text-xs text-stone-400">{t.listening}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleVoiceInput}
                      className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 transition-all ${
                        isRecording 
                          ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-emerald-300'
                      }`}
                    >
                      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                      <span className="font-medium">{isRecording ? t.stopRecording : t.speakProblem}</span>
                    </button>

                    {transcription && (
                      <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest mb-1">{t.youSaid}</p>
                        <p className="text-sm text-stone-700 italic">"{transcription}"</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSmartAnalysis}
                    disabled={isAnalyzing || (!leafImage && !transcription)}
                    className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                    {t.startAnalysis}
                  </button>
                </div>

                <div className="space-y-8">
                  {isAnalyzing && (
                    <div className="h-full flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-[40px] border border-stone-100 border-dashed">
                      <Loader2 className="text-emerald-600 animate-spin" size={48} />
                      <div className="text-center">
                        <p className="text-lg font-medium text-stone-800">{t.analyzing}</p>
                        <p className="text-sm text-stone-400">{t.comparing}</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] text-red-600 text-center">
                      <AlertTriangle className="mx-auto mb-2" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <ResultCard result={result} onChat={handleChat} onSpeak={handleSpeak} lang={lang} />
                    </motion.div>
                  )}

                  {!result && !isAnalyzing && (
                    <div className="h-full flex flex-col items-center justify-center py-20 gap-6 bg-stone-50 rounded-[40px] border border-stone-100 border-dashed text-stone-400">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Camera size={32} />
                      </div>
                      <p className="text-sm font-medium max-w-[200px] text-center">
                        Upload images or speak to see your smart analysis here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Chat Assistant Overlay */}
      <AnimatePresence>
        {showChat && (
          <ChatAssistant 
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            onClose={() => setShowChat(false)}
            onSpeak={speakText}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isCameraOpen && (
          <CameraCapture 
            onCapture={(base64) => {
              if (cameraTarget === 'leaf') setLeafImage(base64);
              else setSoilImage(base64);
              setView('analysis');
            }}
            onClose={() => setIsCameraOpen(false)}
          />
        )}
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-serif font-medium">{t.historyTitle}</h3>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      {t.clearHistory}
                    </button>
                  )}
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <Settings size={20} className="rotate-45" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
                {history.length === 0 ? (
                  <p className="text-center text-stone-400 py-12">{t.noHistory}</p>
                ) : (
                  history.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setResult(item); setShowHistory(false); }}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 cursor-pointer transition-all"
                    >
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt="Scan" />
                      <div>
                        <p className="font-medium text-stone-800">{item.disease_name}</p>
                        <p className="text-xs text-stone-400">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-2xl font-serif font-medium">{t.settings}</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <Settings size={20} className="rotate-45" />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.language}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['en', 'hi', 'te'].map((l) => (
                      <button 
                        key={l}
                        onClick={() => setLang(l)}
                        className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
                          lang === l ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-100 hover:border-stone-200'
                        }`}
                      >
                        {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'తెలుగు'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.theme}</label>
                  <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="text-sm text-stone-600">Light Mode</span>
                    <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-32 border-t border-stone-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-600" size={20} />
            <span className="font-serif font-semibold">AgroDetect AI</span>
          </div>
          <p className="text-stone-400 text-sm">© 2026 AgroDetect AI. Empowering farmers with intelligence.</p>
          <div className="flex gap-6 text-stone-400">
            <Settings 
              size={20} 
              className="hover:text-stone-900 cursor-pointer transition-colors" 
              onClick={() => setShowSettings(true)}
            />
            <Info size={20} className="hover:text-stone-900 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
