import { Calendar, Droplets, ArrowUp, ArrowDown } from "lucide-react";
import { WeatherData } from "../types";
import { getWeatherDetails } from "../utils/weatherUtils";

interface Forecast7DayProps {
  weather: WeatherData;
}

export default function Forecast7Day({ weather }: Forecast7DayProps) {
  const daily = weather.daily;

  const formatDate = (dateStr: string, index: number): string => {
    if (index === 0) return "Today";
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { weekday: "long" });
  };

  const formatShortDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Compile the 7 days of daily records
  const days = daily.time.map((time, index) => {
    return {
      time,
      dayName: formatDate(time, index),
      shortDate: formatShortDate(time),
      code: daily.weather_code[index],
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      precipProb: daily.precipitation_probability_max[index],
      precipSum: daily.precipitation_sum[index],
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index],
    };
  });

  return (
    <div id="forecast-7day-container" className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-6 shadow-sm transition-all h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="h-5 w-5 text-sky-500" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">7-Day Outlook</h3>
        </div>

        <div className="space-y-3.5">
          {days.map((day, idx) => {
            const weatherDetails = getWeatherDetails(day.code, true);
            const WeatherIcon = weatherDetails.icon;

            return (
              <div
                id={`forecast-day-row-${idx}`}
                key={day.time}
                className="flex items-center justify-between py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/20 rounded-xl transition-colors"
              >
                {/* Left: Date / Day */}
                <div className="w-1/3 min-w-[100px]">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {day.dayName}
                  </p>
                  <p className="text-4xs font-medium text-slate-400 dark:text-slate-500">
                    {day.shortDate}
                  </p>
                </div>

                {/* Middle: Weather Icon & Desc */}
                <div className="w-1/3 flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${weatherDetails.gradientClass} ${weatherDetails.darkGradientClass} bg-opacity-25`}>
                    <WeatherIcon className="h-4.5 w-4.5" />
                  </div>
                  <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 text-left truncate max-w-[100px]">
                    {weatherDetails.label}
                  </span>
                </div>

                {/* Right: Rain Prob & Temp min/max */}
                <div className="w-1/3 flex items-center justify-end gap-3.5">
                  {/* Rain Probability */}
                  <span className="flex items-center gap-0.5 text-3xs font-medium text-sky-500 dark:text-sky-400 min-w-[40px] justify-end">
                    <Droplets className="h-3 w-3" />
                    {day.precipProb}%
                  </span>

                  {/* High/Low Temperature Bar Visualizer */}
                  <div className="flex items-center gap-2 min-w-[70px] justify-end">
                    <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500 flex items-center">
                      <ArrowDown className="h-2.5 w-2.5 text-blue-400" />
                      {Math.round(day.tempMin)}°
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                      <ArrowUp className="h-2.5 w-2.5 text-orange-400" />
                      {Math.round(day.tempMax)}°
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between text-4xs text-slate-400 dark:text-slate-500">
        <span>Units: °C / km/h / mm</span>
        <span>Updates real-time via Open-Meteo</span>
      </div>
    </div>
  );
}
