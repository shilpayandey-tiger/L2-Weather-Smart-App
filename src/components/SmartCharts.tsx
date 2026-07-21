import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { WeatherData } from "../types";
import { 
  TrendingUp, 
  Thermometer, 
  CloudRain, 
  Wind,
  Sun
} from "lucide-react";

interface SmartChartsProps {
  weather: WeatherData;
}

export default function SmartCharts({ weather }: SmartChartsProps) {
  const [activeTab, setActiveTab] = useState<"temp" | "precip" | "wind">("temp");

  // Format hourly data for Recharts
  const formatChartData = () => {
    const hourly = weather.hourly;
    const now = new Date();
    
    // Find index corresponding to current hour to start from
    let startIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < hourly.time.length; i++) {
      const forecastTime = new Date(hourly.time[i]);
      const diff = Math.abs(forecastTime.getTime() - now.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        startIndex = i;
      }
    }

    // Prepare next 12 hours for high-density useful chart visualization
    return Array.from({ length: 12 }).map((_, index) => {
      const dataIndex = (startIndex + index) % hourly.time.length;
      const date = new Date(hourly.time[dataIndex]);
      const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      
      return {
        time: timeStr,
        temp: Math.round(hourly.temperature_2m[dataIndex]),
        feelsLike: Math.round(hourly.apparent_temperature[dataIndex]),
        precipProb: hourly.precipitation_probability[dataIndex],
        windSpeed: Math.round(hourly.wind_speed_10m[dataIndex]),
        uvIndex: hourly.uv_index[dataIndex],
      };
    });
  };

  const chartData = formatChartData();

  // Custom Tooltip component for cohesive design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 p-3.5 rounded-2xl shadow-xl">
          <p className="text-2xs font-mono font-semibold text-slate-400 dark:text-slate-500 mb-1.5">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.name} className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">{pld.name === "temp" ? "Temperature" : pld.name === "feelsLike" ? "Feels Like" : pld.name === "precipProb" ? "Rain Probability" : pld.name === "windSpeed" ? "Wind Speed" : pld.name}:</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {pld.value}{activeTab === "temp" ? "°C" : activeTab === "precip" ? "%" : " km/h"}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="smart-charts-card"
      className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-6 shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-500" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Smart Atmospheric Trends</h3>
          </div>
          <p className="text-2xs text-slate-400 dark:text-slate-500 mt-0.5">Interactive hourly forecasts and predictive curves</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/60 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 self-start sm:self-auto">
          <button
            id="tab-temp"
            onClick={() => setActiveTab("temp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all focus:outline-none ${
              activeTab === "temp"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Thermometer className="h-3.5 w-3.5" />
            <span>Temp</span>
          </button>
          <button
            id="tab-precip"
            onClick={() => setActiveTab("precip")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all focus:outline-none ${
              activeTab === "precip"
                ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>Precipitation</span>
          </button>
          <button
            id="tab-wind"
            onClick={() => setActiveTab("wind")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all focus:outline-none ${
              activeTab === "wind"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>Wind Speed</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-64 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "temp" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(14, 165, 233)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="rgb(14, 165, 233)" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(245, 158, 11)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="rgb(245, 158, 11)" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.15)", strokeWidth: 1 }} />
              <Area 
                name="temp"
                type="monotone" 
                dataKey="temp" 
                stroke="rgb(14, 165, 233)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
              />
              <Area 
                name="feelsLike"
                type="monotone" 
                dataKey="feelsLike" 
                stroke="rgb(245, 158, 11)" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorFeels)" 
              />
            </AreaChart>
          ) : activeTab === "precip" ? (
            <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(14, 165, 233, 0.04)" }} />
              <Bar 
                name="precipProb"
                dataKey="precipProb" 
                fill="rgb(20, 184, 166)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.15)", strokeWidth: 1 }} />
              <Line 
                name="windSpeed"
                type="monotone" 
                dataKey="windSpeed" 
                stroke="rgb(99, 102, 241)" 
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Descriptive dynamic micro-trends insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-500 mt-0.5">
            <Thermometer className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-3xs font-semibold text-slate-700 dark:text-slate-300">Thermal Variation</h4>
            <p className="text-4xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
              Today's temperature peak is projected at {Math.round(Math.max(...weather.daily.temperature_2m_max))}°C with low overnight cooling.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-500 mt-0.5">
            <CloudRain className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-3xs font-semibold text-slate-700 dark:text-slate-300">Humidity & Wind Interaction</h4>
            <p className="text-4xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
              Max rain probability stands at {Math.round(Math.max(...weather.daily.precipitation_probability_max))}% with peak gusts around {Math.round(Math.max(...weather.daily.wind_speed_10m_max))} km/h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
