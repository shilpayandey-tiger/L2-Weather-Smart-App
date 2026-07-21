import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Gauge, 
  Cloud, 
  Compass, 
  CloudRain 
} from "lucide-react";
import { WeatherData, CityResult } from "../types";
import { getWeatherDetails } from "../utils/weatherUtils";

interface CurrentWeatherCardProps {
  weather: WeatherData;
  city: CityResult;
}

export default function CurrentWeatherCard({ weather, city }: CurrentWeatherCardProps) {
  const current = weather.current;
  const weatherDetails = getWeatherDetails(current.weather_code, current.is_day === 1);
  const WeatherIcon = weatherDetails.icon;

  return (
    <div
      id="current-weather-card"
      className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-6 shadow-sm overflow-hidden relative transition-all"
    >
      {/* Decorative Subtle Weather Background Accent */}
      <div 
        className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${weatherDetails.gradientClass} ${weatherDetails.darkGradientClass} opacity-15 blur-3xl rounded-full pointer-events-none -mr-16 -mt-16`}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider text-sky-600 dark:text-sky-400 uppercase bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full">
            Current Weather
          </span>
          <h2 id="current-city-title" className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 mt-2.5 tracking-tight">
            {city.name}
          </h2>
          <p id="current-location-subtitle" className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {city.admin1 ? `${city.admin1}, ` : ""}{city.country || "Unknown Country"} • {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${weatherDetails.gradientClass} ${weatherDetails.darkGradientClass}`}>
            <WeatherIcon id="current-weather-main-icon" className="h-8 w-8" />
          </div>
          <div>
            <p id="current-condition-label" className="text-lg font-medium text-slate-700 dark:text-slate-200">
              {weatherDetails.label}
            </p>
            <p id="current-daynight-label" className="text-xs text-slate-400 dark:text-slate-500">
              {current.is_day === 1 ? "Daylight Hours" : "Night Hours"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
        {/* Main Temperature Gauge */}
        <div className="md:col-span-5 flex items-baseline gap-2">
          <span id="current-temp" className="text-6xl font-light tracking-tighter text-slate-900 dark:text-white">
            {Math.round(current.temperature_2m)}°
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Celsius</span>
            <span id="current-apparent-temp" className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
              <Thermometer className="h-3 w-3 text-sky-500" />
              Feels like {Math.round(current.apparent_temperature)}°
            </span>
          </div>
        </div>

        {/* Dynamic Detail Metrics Grid */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div id="metric-wind" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <Wind className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-2xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Wind</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{current.wind_speed_10m} km/h</p>
            </div>
          </div>

          <div id="metric-humidity" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <Droplets className="h-5 w-5 text-teal-500" />
            <div>
              <p className="text-2xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Humidity</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{current.relative_humidity_2m}%</p>
            </div>
          </div>

          <div id="metric-clouds" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <Cloud className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-2xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clouds</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{current.cloud_cover}%</p>
            </div>
          </div>

          <div id="metric-precipitation" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <CloudRain className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Precip.</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{current.precipitation} mm</p>
            </div>
          </div>

          <div id="metric-pressure" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <Gauge className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-2xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pressure</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{Math.round(current.pressure_msl)} hPa</p>
            </div>
          </div>

          <div id="metric-elevation" className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40">
            <Compass className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-2xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Elevation</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{Math.round(weather.elevation)} m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
