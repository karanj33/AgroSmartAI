import React from 'react';
import { 
  Activity, Droplets, Thermometer, Wind, 
  AlertTriangle, CheckCircle2, TrendingUp, 
  Bug, ShieldAlert, Sprout, Calendar, Leaf,
  RefreshCw, Camera, Globe, Search, Cloud,
  Landmark, Newspaper
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';

const Dashboard = ({ 
  data, t, onUploadLeaf, onUploadSoil, onOpenCamera, 
  onRefresh, result, onViewAnalysis,
  locationInput, setLocationInput, onSearchLocation, isSearchingLocation,
  soilType, setSoilType, nutrientLevels, setNutrientLevels, currentSeason, setCurrentSeason,
  onDashboardAction
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy':
      case 'Optimal':
      case 'Low':
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Warning':
      case 'Medium':
        return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'Critical':
      case 'High':
        return 'text-red-500 bg-red-50 border-red-100';
      default:
        return 'text-stone-500 bg-stone-50 border-stone-100';
    }
  };

  const nutrientData = [
    { name: 'Nitrogen (N)', value: data.soil_nutrients.nitrogen, full: 100 },
    { name: 'Phosphorus (P)', value: data.soil_nutrients.phosphorus, full: 100 },
    { name: 'Potassium (K)', value: data.soil_nutrients.potassium, full: 100 },
    { name: 'Calcium (Ca)', value: 45, full: 100 },
    { name: 'Magnesium (Mg)', value: 30, full: 100 },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="text-emerald-600" size={18} />
            <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{data.weather.location_name || "Global Farm"}</span>
          </div>
          <h1 className="text-4xl font-serif font-medium text-stone-900 mb-2">Farm Intelligence Center</h1>
          
          {/* Location Search */}
          <form onSubmit={onSearchLocation} className="mt-4 flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                type="text" 
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder={t.searchCity + "..."}
                className="w-full pl-10 pr-4 py-2 bg-stone-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearchingLocation}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {isSearchingLocation ? "..." : "Search"}
            </button>
          </form>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onRefresh}
            className="p-3 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 transition-all"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={onUploadLeaf}
            className="px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all flex items-center gap-2"
          >
            <Leaf size={18} />
            Upload Leaf
          </button>
          <button 
            onClick={onUploadSoil}
            className="px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all flex items-center gap-2"
          >
            <Droplets size={18} />
            Upload Soil
          </button>
        </div>
      </div>

      {/* Recent Analysis Summary */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-emerald-50 border border-emerald-100 rounded-[40px] shadow-sm flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
            <ShieldAlert className="text-emerald-600" size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Recent Analysis</span>
              <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border ${
                result.severity === 'High' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-amber-100 text-amber-600 border-amber-200'
              }`}>
                {result.severity} Severity
              </span>
            </div>
            <h3 className="text-2xl font-serif font-medium text-stone-900 mb-2">{result.disease_name}</h3>
            <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
              {result.ai_advice}
            </p>
          </div>
          <button 
            onClick={onViewAnalysis}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all whitespace-nowrap"
          >
            View Full Report
          </button>
        </motion.div>
      )}

      {/* Weather & Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Thermometer className="text-orange-500" size={20} />
            </div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.temp}</span>
          </div>
          <p className="text-3xl font-serif font-medium">{data.weather.temp}°C</p>
          <p className="text-xs text-stone-400 mt-1">{data.weather.condition || 'Clear'}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Droplets className="text-blue-500" size={20} />
            </div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.humidity}</span>
          </div>
          <p className="text-3xl font-serif font-medium">{data.weather.humidity}%</p>
          <p className="text-xs text-stone-400 mt-1">Relative Humidity</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Cloud className="text-indigo-500" size={20} />
            </div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.rainfall}</span>
          </div>
          <p className="text-3xl font-serif font-medium">{data.weather.rain_chance_tomorrow}%</p>
          <p className="text-xs text-stone-400 mt-1">Next 24h probability</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white rounded-[32px] border border-stone-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Wind className="text-emerald-500" size={20} />
            </div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.windSpeed}</span>
          </div>
          <p className="text-3xl font-serif font-medium">{data.weather.wind_speed || 0} km/h</p>
          <p className="text-xs text-stone-400 mt-1">Current Speed</p>
        </motion.div>
      </div>

      {/* Top Row: Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[32px] border ${getStatusColor(data.crop_health.status)}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm">
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{t.cropHealth}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-bold">{data.crop_health.score}%</h3>
            <p className="text-sm font-medium opacity-80">{data.crop_health.status}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-[32px] border ${getStatusColor(data.disease_risk.level)}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm">
              <ShieldAlert size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{t.diseaseRisk}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-bold">{data.disease_risk.level}</h3>
            <p className="text-sm font-medium opacity-80">{data.disease_risk.likely_diseases[0] || 'No threats'}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-[32px] border border-stone-100 bg-white shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-500">
              <Droplets size={24} />
            </div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{t.irrigation}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-bold text-stone-900">{data.irrigation.needed ? 'Needed' : 'Optimal'}</h3>
            <p className="text-sm font-medium text-stone-500">{data.irrigation.frequency}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-[32px] border ${getStatusColor(data.pest_risk.level)}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm">
              <Bug size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{t.pestRisk}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-bold">{data.pest_risk.level}</h3>
            <p className="text-sm font-medium opacity-80">{data.pest_risk.active_pests[0] || 'Clear'}</p>
          </div>
        </motion.div>
      </div>

      {/* Animal Intrusion Alert */}
      {data.animal_intrusion.detected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-red-600 text-white rounded-[32px] shadow-lg flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldAlert size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-serif font-medium mb-1">{t.animalDetected}: {data.animal_intrusion.animal_type}</h4>
            <p className="text-sm opacity-90">{data.animal_intrusion.recommendation}</p>
          </div>
          <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors">
            {t.takeAction}
          </button>
        </motion.div>
      )}

      {/* Main Grid: Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Soil Nutrients Chart */}
        <div className="lg:col-span-2 p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-serif font-medium text-stone-800">{t.soilNutrients}</h3>
              <p className="text-sm text-stone-400">{t.nutrientStatus}: {data.soil_nutrients.status}</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nutrientData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 10}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f5f5f4'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  {nutrientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : index === 2 ? '#0ea5e9' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trend Chart */}
        <div className="p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-serif font-medium text-stone-800">Growth Trend</h3>
            <p className="text-sm text-stone-400">Weekly plant height (cm)</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.growth_history}>
                <defs>
                  <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="height" stroke="#10b981" fillOpacity={1} fill="url(#colorHeight)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Soil & Season Profile */}
      <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-emerald-600" size={24} />
          <h3 className="text-2xl font-serif font-medium text-stone-800">Farm Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.soilType}</label>
            <select 
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Loamy">Loamy</option>
              <option value="Clayey">Clayey</option>
              <option value="Sandy">Sandy</option>
              <option value="Silty">Silty</option>
              <option value="Black Soil">Black Soil</option>
              <option value="Red Soil">Red Soil</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.season}</label>
            <select 
              value={currentSeason}
              onChange={(e) => setCurrentSeason(e.target.value)}
              className="w-full p-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Summer">Summer (Zaid)</option>
              <option value="Monsoon">Monsoon (Kharif)</option>
              <option value="Winter">Winter (Rabi)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.nutrients} (N-P-K)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={nutrientLevels.N}
                onChange={(e) => setNutrientLevels({...nutrientLevels, N: parseInt(e.target.value)})}
                className="w-full p-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="N"
              />
              <input 
                type="number" 
                value={nutrientLevels.P}
                onChange={(e) => setNutrientLevels({...nutrientLevels, P: parseInt(e.target.value)})}
                className="w-full p-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="P"
              />
              <input 
                type="number" 
                value={nutrientLevels.K}
                onChange={(e) => setNutrientLevels({...nutrientLevels, K: parseInt(e.target.value)})}
                className="w-full p-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="K"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Crops Section */}
      <div className="p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-emerald-600" size={24} />
          <h3 className="text-2xl font-serif font-medium text-stone-800">{t.cropRecs}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.recommended_crops.map((crop, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-stone-50 rounded-[32px] border border-stone-100 hover:border-emerald-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-serif font-medium text-stone-900 mb-1">{crop.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-widest ${
                      crop.profit_potential === 'High' ? 'bg-emerald-100 text-emerald-700' : 
                      crop.profit_potential === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {crop.profit_potential} Profit
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{crop.suitability}% Match</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
                  <Sprout className="text-emerald-600" size={24} />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">{t.expectedYield}</span>
                  <span className="font-medium text-stone-800">{crop.expected_yield}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">{t.marketPrice}</span>
                  <span className="font-medium text-emerald-600 font-mono">{crop.market_price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.whySuitable}</p>
                  <p className="text-sm text-stone-600 leading-relaxed">{crop.reason}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-stone-200">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg shrink-0">
                      <Droplets className="text-indigo-500" size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.irrigationAdvice}</p>
                      <p className="text-xs text-stone-600">{crop.irrigation_advice}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-amber-50 rounded-lg shrink-0">
                      <Activity className="text-amber-500" size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.fertilizerAdvice}</p>
                      <p className="text-xs text-stone-600">{crop.fertilizer_advice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather & Alerts */}
        <div className="space-y-8">
          <div className="p-8 bg-stone-900 text-white rounded-[40px] shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif font-medium">{t.weatherTitle}</h3>
                <Calendar size={20} className="text-stone-500" />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Thermometer size={16} />
                    <span className="text-xs uppercase tracking-wider">{t.temp}</span>
                  </div>
                  <p className="text-2xl font-medium">{data.weather.temp}°C</p>
                  <p className="text-[10px] text-stone-500">{data.weather.condition}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Cloud size={16} />
                    <span className="text-xs uppercase tracking-wider">Rain Chance</span>
                  </div>
                  <p className="text-2xl font-medium">{data.weather.rain_chance_tomorrow}%</p>
                </div>
              </div>
              <div className="space-y-3">
                {data.weather.alerts.map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <p className="text-xs font-medium">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>

          <div className="p-8 bg-emerald-600 text-white rounded-[40px] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sprout size={24} />
              <h3 className="text-xl font-serif font-medium">Smart Farm Advice</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-90 mb-6">
              Based on your current location in {data.weather.location_name} and the {data.weather.temp}°C temperature, we recommend monitoring for {data.disease_risk.likely_diseases[0] || 'potential threats'}. Ensure your irrigation is set for {data.irrigation.frequency}.
            </p>
            <button 
              onClick={onViewAnalysis}
              className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-colors"
            >
              View Detailed Insights
            </button>
          </div>

          <div className="p-8 bg-white border border-stone-100 rounded-[40px] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert size={24} className="text-red-500" />
              <h3 className="text-xl font-serif font-medium text-stone-800">{t.security}</h3>
            </div>
            <button 
              onClick={() => onDashboardAction('report_animal')}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <Bug size={18} />
              {t.reportAnimal}
            </button>
          </div>
        </div>
      </div>

      {/* Government Schemes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Landmark className="text-emerald-600" size={24} />
              <h3 className="text-2xl font-serif font-medium text-stone-800">Active Government Schemes</h3>
            </div>
          </div>
          <div className="space-y-4">
            {(data.govt_schemes || []).map((scheme, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-stone-900 text-sm">{scheme.name}</h4>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{scheme.last_date}</span>
                </div>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">{scheme.description}</p>
                <a 
                  href={scheme.apply_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline"
                >
                  Apply Now →
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-stone-900 text-white rounded-[40px] shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="text-emerald-400" size={24} />
            <h3 className="text-2xl font-serif font-medium">Latest Agri News</h3>
          </div>
          <div className="space-y-6">
            {(data.agri_news || []).map((news, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-sm leading-relaxed text-stone-300">{news}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge System */}
      <div className="mt-12">
        <h3 className="text-2xl font-serif font-medium text-stone-800 mb-8">{t.farmingKnowledge}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'fertilizer', title: t.bestFertilizer, icon: Sprout, color: 'bg-emerald-50 text-emerald-600' },
            { id: 'pest', title: t.pestControl, icon: Bug, color: 'bg-amber-50 text-amber-600' },
            { id: 'sustainable', title: t.sustainableAg, icon: Leaf, color: 'bg-sky-50 text-sky-600' }
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => onDashboardAction(item.id)}
              className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                <item.icon size={24} />
              </div>
              <h4 className="font-medium text-stone-800">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Other Suggestions */}
      <div className="mt-12 p-8 bg-stone-50 rounded-[40px] border border-stone-100">
        <h3 className="text-2xl font-serif font-medium text-stone-800 mb-6">Other Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => onDashboardAction('rotation')}
            className="p-4 bg-white rounded-2xl border border-stone-100 flex items-start gap-4 cursor-pointer hover:border-emerald-200 transition-all"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-stone-800">Crop Rotation</p>
              <p className="text-xs text-stone-500">Rotate with legumes next season to improve soil nitrogen naturally.</p>
            </div>
          </div>
          <div 
            onClick={() => onDashboardAction('soil_test')}
            className="p-4 bg-white rounded-2xl border border-stone-100 flex items-start gap-4 cursor-pointer hover:border-amber-200 transition-all"
          >
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-stone-800">Soil Testing</p>
              <p className="text-xs text-stone-500">Schedule a professional soil test every 6 months for precise nutrient management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
