import { useRef } from "react";
import { ChevronLeft, ChevronRight, Droplets, Sun, Wind } from "lucide-react";
import { WeatherData } from "../types";
import { getWeatherDetails } from "../utils/weatherUtils";

interface HourlyForecastProps {
  weather: WeatherData;
}

export default function HourlyForecast({ weather }: HourlyForecastProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find index of the current or next hour
  const findCurrentHourIndex = (): number => {
    const now = new Date();
    const times = weather.hourly.time;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < times.length; i++) {
      const forecastTime = new Date(times[i]);
      const diff = Math.abs(forecastTime.getTime() - now.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  };

  const startIndex = findCurrentHourIndex();
  const hourlyData = Array.from({ length: 24 }).map((_, index) => {
    const dataIndex = startIndex + index;
    // Guard against overflow
    const safeIndex = dataIndex < weather.hourly.time.length ? dataIndex : weather.hourly.time.length - 1;

    return {
      time: new Date(weather.hourly.time[safeIndex]),
      temp: weather.hourly.temperature_2m[safeIndex],
      appTemp: weather.hourly.apparent_temperature[safeIndex],
      humidity: weather.hourly.relative_humidity_2m[safeIndex],
      precipProb: weather.hourly.precipitation_probability[safeIndex],
      precip: weather.hourly.precipitation[safeIndex],
      code: weather.hourly.weather_code[safeIndex],
      wind: weather.hourly.wind_speed_10m[safeIndex],
      uv: weather.hourly.uv_index[safeIndex],
    };
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatHour = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const isCurrentHour = (date: Date): boolean => {
    const now = new Date();
    return date.getHours() === now.getHours() && date.getDate() === now.getDate();
  };

  return (
    <div id="hourly-forecast-container" className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-6 shadow-sm relative transition-all">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Hourly Timeline</h3>
          <p className="text-2xs text-slate-400 dark:text-slate-500 mt-0.5">Next 24 hours index breakdown</p>
        </div>

        {/* Scroll controllers */}
        <div className="flex gap-1.5">
          <button
            id="scroll-hourly-left"
            onClick={() => scroll("left")}
            className="p-1.5 border border-slate-100 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 focus:outline-none transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            id="scroll-hourly-right"
            onClick={() => scroll("right")}
            className="p-1.5 border border-slate-100 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 focus:outline-none transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        id="hourly-scroll-viewport"
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {hourlyData.map((hour, idx) => {
          const isCurrent = isCurrentHour(hour.time);
          const weatherDetails = getWeatherDetails(hour.code, true);
          const WeatherIcon = weatherDetails.icon;

          return (
            <div
              id={`hourly-item-${idx}`}
              key={idx}
              className={`flex-shrink-0 w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between text-center border snap-start transition-all ${
                isCurrent
                  ? "bg-sky-50/70 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/40 ring-1 ring-sky-300/30"
                  : "bg-slate-50/30 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700/60"
              }`}
            >
              <span className={`text-2xs font-medium ${isCurrent ? "text-sky-600 dark:text-sky-400 font-semibold" : "text-slate-400 dark:text-slate-500"}`}>
                {isCurrent ? "Now" : formatHour(hour.time)}
              </span>

              <div className={`p-2 rounded-xl my-2.5 bg-gradient-to-br ${weatherDetails.gradientClass} ${weatherDetails.darkGradientClass} bg-opacity-20`}>
                <WeatherIcon className="h-5 w-5" />
              </div>

              <span className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {Math.round(hour.temp)}°
              </span>

              <div className="flex flex-col gap-1 mt-2.5 w-full">
                {/* Precipitation Probability */}
                <span className="flex items-center justify-center gap-0.5 text-3xs font-medium text-blue-500 dark:text-blue-400">
                  <Droplets className="h-2.5 w-2.5" />
                  {hour.precipProb}%
                </span>

                {/* Wind speed indicator */}
                <span className="flex items-center justify-center gap-0.5 text-3xs text-slate-400 dark:text-slate-500">
                  <Wind className="h-2.5 w-2.5" />
                  {Math.round(hour.wind)}k
                </span>

                {/* UV Index if day */}
                {hour.uv > 0 && (
                  <span className="flex items-center justify-center gap-0.5 text-3xs text-amber-500 dark:text-amber-400">
                    <Sun className="h-2.5 w-2.5" />
                    UV {Math.round(hour.uv)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
