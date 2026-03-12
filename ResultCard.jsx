import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, AlertCircle, Droplets, Sprout, Info, 
  TrendingDown, TrendingUp, DollarSign, Landmark, 
  UserCheck, Send, MessageCircle, Volume2, Camera, X, Newspaper,
  BarChart as BarChartIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Cell, PieChart, Pie
} from 'recharts';

export const ResultCard = ({ result, onChat, onSpeak, onStop, lang, isPlaying }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const translations = {
    en: {
      listen: "Listen to Advisor",
      stop: "Stop",
      voice: "AgroDetect AI Voice",
      whatHappened: "What Happened To My Plant?",
      immediateActions: "What Should I Do Now?",
      treatment: "Recommended Treatment",
      chemical: "Chemical Spray",
      organic: "Organic Solution",
      fertilizer: "Fertilizer Support",
      prevention: "Future Prevention",
      impact: "Yield Impact",
      cost: "Treatment Cost",
      schemes: "Govt. Schemes (India)",
      advice: "Final Advice",
      ask: "Ask AgroDetect AI",
      anything: "Anything about your crop",
      placeholder: "Type your question here...",
      chatEmpty: "Ask me about spraying, organic options, or recovery time.",
      priceTrends: "Crop Price Trends",
      current: "Current",
      past: "Past",
      future: "Future Prediction",
      reason: "Reason",
      listenResponse: "Listen to Response",
      chatNews: "Latest Agri News",
      uploadPhoto: "Upload Photo",
      news1: "Govt announces new subsidy for organic fertilizers.",
      news2: "Monsoon expected to be normal this year, says IMD.",
      growthStage: "Crop Growth Stage",
      yieldPrediction: "Yield Prediction",
    },
    hi: {
      listen: "सलाहकार को सुनें",
      stop: "बंद करें",
      voice: "AgroDetect AI आवाज़",
      whatHappened: "मेरे पौधे को क्या हुआ?",
      immediateActions: "अब मुझे क्या करना चाहिए?",
      treatment: "अनुशंसित उपचार",
      chemical: "रासायनिक स्प्रे",
      organic: "जैविक समाधान",
      fertilizer: "उर्वरक सहायता",
      prevention: "भविष्य की रोकथाम",
      impact: "उपज पर प्रभाव",
      cost: "उपचार लागत",
      schemes: "सरकारी योजनाएं (भारत)",
      advice: "अंतिम सलाह",
      ask: "AgroDetect AI से पूछें",
      anything: "अपनी फसल के बारे में कुछ भी",
      placeholder: "अपना प्रश्न यहाँ लिखें...",
      chatEmpty: "मुझसे छिड़काव, जैविक विकल्पों या ठीक होने के समय के बारे में पूछें।",
      priceTrends: "फसल मूल्य रुझान",
      current: "वर्तमान",
      past: "पिछला",
      future: "भविष्य की भविष्यवाणी",
      reason: "कारण",
      listenResponse: "जवाब सुनें",
      chatNews: "नवीनतम कृषि समाचार",
      uploadPhoto: "फोटो अपलोड करें",
      news1: "सरकार ने जैविक उर्वरकों के लिए नई सब्सिडी की घोषणा की।",
      news2: "आईएमडी का कहना है कि इस साल मानसून सामान्य रहने की उम्मीद है।",
      growthStage: "फसल वृद्धि चरण",
      yieldPrediction: "उपज भविष्यवाणी",
    },
    te: {
      listen: "సలహాదారుని వినండి",
      stop: "ఆపు",
      voice: "AgroDetect AI వాయిస్",
      whatHappened: "నా మొక్కకు ఏమైంది?",
      immediateActions: "నేను ఇప్పుడు ఏమి చేయాలి?",
      treatment: "సిఫార్సు చేసిన చికిత్స",
      chemical: "రసాయన స్ప్రే",
      organic: "సేంద్రీయ పరిష్కారం",
      fertilizer: "ఎరువుల మద్దతు",
      prevention: "భవిష్యత్తు నివారణ",
      impact: "దిగుబడి ప్రభావం",
      cost: "చికిత్స ఖర్చు",
      schemes: "ప్రభుత్వ పథకాలు (భారతదేశం)",
      advice: "తుది సలహా",
      ask: "AgroDetect AI ని అడగండి",
      anything: "మీ పంట గురించి ఏదైనా",
      placeholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
      chatEmpty: "స్ప్రే చేయడం, సేంద్రీయ ఎంపికలు లేదా కోలుకునే సమయం గురించి నన్ను అడగండి.",
      priceTrends: "పంట ధరల ధోరణులు",
      current: "ప్రస్తుత",
      past: "గత",
      future: "భవిష్యత్తు అంచనా",
      reason: "కారణం",
      listenResponse: "సమాధానం వినండి",
      chatNews: "తాజా వ్యవసాయ వార్తలు",
      uploadPhoto: "ఫోటో అప్‌లోడ్ చేయండి",
      news1: "సేంద్రీయ ఎరువుల కోసం ప్రభుత్వం కొత్త సబ్సిడీని ప్రకటించింది.",
      news2: "ఈ ఏడాది రుతుపవనాలు సాధారణంగా ఉంటాయని ఐఎండీ తెలిపింది.",
      growthStage: "పెరుగుదల దశ",
      yieldPrediction: "దిగుబడి అంచనా",
    }
  };

  const t = translations[lang];

  const handleSpeakReport = () => {
    if (isPlaying) {
      onStop();
    } else {
      const text = `
        Disease Name: ${result.disease_name}. 
        Severity: ${result.severity}. 
        What happened: ${result.what_happened}. 
        Advice: ${result.ai_advice}.
        ${result.soil_analysis ? `Soil Analysis: ${result.soil_analysis.status}. Best crops: ${result.soil_analysis.best_crops.join(', ')}.` : ''}
      `;
      onSpeak(text);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedImage) || isTyping) return;

    const userMsg = inputValue.trim();
    const userImg = selectedImage;
    
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, image: userImg || undefined }]);
    setInputValue('');
    setSelectedImage(null);
    setIsTyping(true);

    const aiResponse = await onChat(userMsg, result, userImg || undefined);
    setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const severityColors = {
    'Low': 'bg-emerald-100 text-emerald-700 border-emerald-100',
    'Medium': 'bg-amber-100 text-amber-700 border-amber-100',
    'High': 'bg-red-100 text-red-700 border-red-100',
    'Low Risk': 'bg-emerald-100 text-emerald-700 border-emerald-100',
    'Medium Risk': 'bg-amber-100 text-amber-700 border-amber-100',
    'High Risk': 'bg-red-100 text-red-700 border-red-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      {/* Farmer Friendly Report */}
      <div className="bg-white rounded-[40px] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 md:p-10 bg-emerald-50 border-b border-stone-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl md:text-4xl font-serif font-medium text-stone-900">
                  {result.disease_name}
                </h2>
                {result.confidence && (
                  <span className="px-2 py-1 bg-white/50 backdrop-blur-sm border border-stone-200 text-stone-500 text-[10px] font-bold rounded-lg">
                    {Math.round(result.confidence)}% Confidence
                  </span>
                )}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${severityColors[result.severity]}`}>
                <AlertCircle size={16} />
                {result.severity}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <button 
                onClick={handleSpeakReport}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isPlaying ? 'bg-red-100 hover:bg-red-200' : 'bg-emerald-100 hover:bg-emerald-200'
                }`}
                title={isPlaying ? t.stop : t.listen}
              >
                {isPlaying ? <X className="text-red-600" size={20} /> : <Volume2 className="text-emerald-600" size={20} />}
              </button>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">{isPlaying ? t.stop : t.listen}</p>
                <p className="text-sm font-medium text-stone-700">{t.voice}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-10">
          {/* Section 1: What Happened */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-medium flex items-center gap-2 text-stone-800">
              <Info className="text-emerald-600" size={20} />
              {t.whatHappened}
            </h3>
            <p className="text-stone-600 leading-relaxed text-lg italic">
              "{result.what_happened}"
            </p>
          </div>

          {/* Section 2: Immediate Actions */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
            <h3 className="text-lg font-serif font-medium mb-4 text-stone-800">{t.immediateActions}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {(result.immediate_actions || []).map((action, i) => (
                <div key={i} className="flex gap-3 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-stone-700 font-medium">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recommended Treatment */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-medium flex items-center gap-2 text-stone-800">
              <Droplets className="text-blue-500" size={20} />
              {t.treatment}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl border border-stone-100 bg-white shadow-sm flex flex-col">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">{t.chemical}</h4>
                <p className="text-sm font-bold text-stone-900 mb-1">{result.treatment?.chemical?.name || 'N/A'}</p>
                <p className="text-xs text-stone-500 mb-3">{result.treatment?.chemical?.dosage || ''}</p>
                <p className="text-xs text-stone-600 leading-relaxed">{result.treatment?.chemical?.how_to_spray || ''}</p>
              </div>
              <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 flex flex-col">
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">{t.organic}</h4>
                <p className="text-sm font-medium text-stone-800 leading-relaxed">{result.treatment?.organic?.name || 'N/A'}</p>
              </div>
              <div className="p-6 rounded-3xl border border-stone-100 bg-white shadow-sm flex flex-col">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">{t.fertilizer}</h4>
                <p className="text-sm font-medium text-stone-800 leading-relaxed">{result.treatment?.fertilizer?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Prevention & Impact */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-medium flex items-center gap-2 text-stone-800">
                <ShieldCheck className="text-emerald-600" size={20} />
                {t.prevention}
              </h3>
              <ul className="space-y-3">
                {(result.prevention_tips || []).map((tip, i) => (
                  <li key={i} className="text-sm text-stone-600 flex gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                  <PieChartIcon className="text-stone-400" size={18} />
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Risk & Recovery Analysis</h4>
                </div>
                
                <div className="flex justify-around items-center">
                  {/* Risk Circle */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="54"
                          stroke="#f5f5f4"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="54"
                          stroke={result.severity === 'High' ? '#ef4444' : result.severity === 'Medium' ? '#f59e0b' : '#10b981'}
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 54}
                          strokeDashoffset={(2 * Math.PI * 54) * (1 - (result.risk_percentage || 0) / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ShieldCheck size={16} className="text-stone-300 mb-1" />
                        <span className="text-2xl font-bold text-stone-800">{result.risk_percentage || 0}%</span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Risk</span>
                      </div>
                    </div>
                  </div>

                  {/* Cure Time Circle */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="54"
                          stroke="#f5f5f4"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="54"
                          stroke="#3b82f6"
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 54}
                          strokeDashoffset={(2 * Math.PI * 54) * (1 - Math.min((isNaN(parseInt(result.cure_time)) ? 0 : parseInt(result.cure_time)) / 30, 1))}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <TrendingUp size={16} className="text-stone-300 mb-1" />
                        <span className="text-2xl font-bold text-stone-800">
                          {isNaN(parseInt(result.cure_time)) ? '0' : parseInt(result.cure_time)}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-stone-900 text-white rounded-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="text-red-400" size={18} />
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-70">{t.impact}</h4>
                </div>
                <p className="text-lg font-medium">{result.yield_impact || 'Under Process'}</p>
              </div>

              {result.soil_analysis && (
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="text-amber-600" size={18} />
                    <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Soil Health Report</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-stone-800 mb-1">{result.soil_analysis.type_detected} ({result.soil_analysis.color})</p>
                      <p className="text-xs text-stone-500 mb-3">{result.soil_analysis.status || 'Under Process'}</p>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Recommended Crops</p>
                        <div className="flex flex-wrap gap-1">
                          {(result.soil_analysis.best_crops || []).map((crop, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {result.soil_analysis.fruit_trees && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Fruit Trees</p>
                          <div className="flex flex-wrap gap-1">
                            {(result.soil_analysis.fruit_trees || []).map((tree, i) => (
                              <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                                {tree}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {result.soil_analysis.improvement_suggestions && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Soil Improvement</p>
                          <ul className="space-y-1">
                            {(result.soil_analysis.improvement_suggestions || []).map((sug, i) => (
                              <li key={i} className="text-[10px] text-stone-600 flex gap-1">
                                <span className="text-amber-500">•</span> {sug}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.soil_analysis.moisture_estimate !== undefined && (
                    <div className="pt-4 border-t border-amber-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Estimated Moisture</span>
                        <span className="text-xs font-bold text-amber-600">{result.soil_analysis.moisture_estimate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-1000" 
                          style={{ width: `${result.soil_analysis.moisture_estimate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {result.growth_stage && (
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="text-emerald-600" size={18} />
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t.growthStage}</h4>
                  </div>
                  <p className="text-lg font-medium text-stone-800">{result.growth_stage}</p>
                </div>
              )}

              {result.yield_prediction && (
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-blue-600" size={18} />
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.yieldPrediction}</h4>
                  </div>
                  <p className="text-lg font-medium text-stone-800">{result.yield_prediction}</p>
                </div>
              )}

              <div className="flex justify-between items-center p-4 border border-stone-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">₹</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.cost}</span>
                </div>
                <span className="font-bold text-emerald-600">{result.cost_estimate || 'Under Process'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Crop Price Trends */}
          {result.crop_price_trends && (
            <div className="bg-stone-900 text-white rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-medium flex items-center gap-2">
                  <span className="text-emerald-400">₹</span>
                  {t.priceTrends}: {result.crop_price_trends.crop_name || 'N/A'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1 tracking-widest">{t.past}</p>
                  <p className="text-xl font-medium">{result.crop_price_trends.past_price || 'N/A'}</p>
                </div>
                <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] uppercase font-bold text-emerald-400 mb-1 tracking-widest">{t.current}</p>
                  <p className="text-xl font-bold text-emerald-400">{result.crop_price_trends.present_price || 'N/A'}</p>
                </div>
                <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1 tracking-widest">{t.future}</p>
                  <p className="text-xl font-medium">{result.crop_price_trends.future_price || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-stone-400 leading-relaxed italic">
                  <span className="font-bold text-stone-300">{t.reason}:</span> {result.crop_price_trends.prediction_reason || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Section 6: Schemes & Advice */}
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-stone-100">
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Landmark size={14} /> {t.schemes}
              </h4>
              <ul className="space-y-2">
                {(result.govt_schemes || []).map((scheme, i) => (
                  scheme && (
                    <li key={i} className="text-xs text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100">
                      {typeof scheme === 'string' ? scheme : scheme.name}
                    </li>
                  )
                ))}
              </ul>
            </div>
            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg shadow-emerald-100">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">{t.advice}</h4>
              <p className="text-sm leading-relaxed italic">
                "{result.ai_advice}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      <div className="bg-white rounded-[40px] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="font-serif font-medium">{t.ask}</h3>
              <p className="text-[10px] opacity-50 uppercase tracking-widest">{t.anything}</p>
            </div>
          </div>
        </div>

        {/* Chat News Section */}
        <div className="bg-emerald-900/10 border-b border-emerald-100/20 p-3 overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap animate-marquee">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 uppercase tracking-widest shrink-0">
              <Newspaper size={12} />
              {t.chatNews}:
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              {(result.agri_news || [t.news1, t.news2]).join(' • ')}
            </p>
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-stone-50/50">
          {chatMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <MessageCircle size={48} />
              <p className="text-sm max-w-[200px]">
                {t.chatEmpty}
              </p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {(chatMessages || []).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm relative group ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="User uploaded" 
                      className="w-full max-w-[200px] rounded-lg mb-2 border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {msg.text}
                  {msg.role === 'ai' && (
                    <div className="absolute -right-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onSpeak(msg.text)}
                        className="p-2 bg-white rounded-full border border-stone-100 shadow-sm text-emerald-600 hover:bg-emerald-50"
                        title={t.listenResponse}
                      >
                        <Volume2 size={14} />
                      </button>
                      {isPlaying && (
                        <button
                          onClick={onStop}
                          className="p-2 bg-white rounded-full border border-stone-100 shadow-sm text-red-500 hover:bg-red-50"
                          title={t.stop}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-stone-100">
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 relative inline-block"
              >
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-20 h-20 object-cover rounded-xl border-2 border-emerald-500"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 bg-stone-100 text-stone-500 rounded-2xl flex items-center justify-center hover:bg-stone-200 transition-colors shrink-0"
              title={t.uploadPhoto}
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || (!inputValue.trim() && !selectedImage)}
              className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
