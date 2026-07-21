import { useState, useEffect } from "react";
import { AlertTriangle, X, ShieldAlert, Sun, Wind, Thermometer, CloudLightning } from "lucide-react";
import { WeatherData } from "../types";

interface WeatherAlertsProps {
  weather: WeatherData;
}

interface Alert {
  id: string;
  type: "heat" | "cold" | "storm" | "uv" | "wind";
  title: string;
  description: string;
  severity: "critical" | "warning";
}

export default function WeatherAlerts({ weather }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    const activeAlerts: Alert[] = [];
    const current = weather.current;
    const hourly = weather.hourly;
    const daily = weather.daily;

    // 1. Extreme Heat Check (Temperature or Apparent temp >= 35°C, or daily max >= 35°C)
    if (current.temperature_2m >= 35 || current.apparent_temperature >= 35 || daily.temperature_2m_max[0] >= 35) {
      activeAlerts.push({
        id: "alert-extreme-heat",
        type: "heat",
        title: "Extreme Heat Advisory",
        description: `Extreme temperatures detected (${Math.round(Math.max(current.temperature_2m, daily.temperature_2m_max[0]))}°C). Limit outdoor activities, seek shade, and stay highly hydrated.`,
        severity: "critical"
      });
    }

    // 2. Severe Storm Check (Thunderstorm WMO codes 95, 96, 99, or heavy rain WMO codes 65, 82)
    const stormCodes = [95, 96, 99, 65, 82];
    const isCurrentStorm = stormCodes.includes(current.weather_code);
    const hourlyCodes = hourly.weather_code.slice(0, 6); // Next 6 hours
    const isUpcomingStorm = hourlyCodes.some(code => stormCodes.includes(code));

    if (isCurrentStorm || isUpcomingStorm) {
      activeAlerts.push({
        id: "alert-severe-storm",
        type: "storm",
        title: isCurrentStorm ? "Severe Storm Warning" : "Upcoming Storm Advisory",
        description: isCurrentStorm 
          ? "Severe thunderstorms or torrential rainfall active. Seek secure indoor shelter immediately and minimize travel."
          : "Severe convective storms or heavy downpours forecasted within the next few hours. Secure outdoor items and plan accordingly.",
        severity: "critical"
      });
    }

    // 3. High UV Indices Check (UV Index peak >= 8)
    const next12HoursUV = hourly.uv_index.slice(0, 12);
    const peakUV = Math.max(...next12HoursUV, 0);
    if (peakUV >= 8) {
      activeAlerts.push({
        id: "alert-extreme-uv",
        type: "uv",
        title: "Extreme UV Index Alert",
        description: `Peak UV radiation level is extreme (${peakUV.toFixed(1)}). Unprotected skin and eyes can burn quickly. Wear SPF 30+, hats, and protective lenses.`,
        severity: "warning"
      });
    }

    // 4. Gale / High Wind Check (Wind speed >= 40 km/h or daily max >= 40 km/h)
    const maxWind = Math.max(current.wind_speed_10m, daily.wind_speed_10m_max[0]);
    if (maxWind >= 40) {
      activeAlerts.push({
        id: "alert-high-wind",
        type: "wind",
        title: "High Wind Advisory",
        description: `Severe atmospheric wind speeds detected reaching ${Math.round(maxWind)} km/h. Secure loose outdoor fixtures and exercise caution while driving.`,
        severity: "warning"
      });
    }

    // 5. Extreme Cold Check (Apparent temperature <= 0°C)
    if (current.apparent_temperature <= 0 || daily.apparent_temperature_min[0] <= 0) {
      activeAlerts.push({
        id: "alert-extreme-cold",
        type: "cold",
        title: "Extreme Freeze & Frost Warning",
        description: `Freezing chill indices detected (${Math.round(current.apparent_temperature)}°C feels-like). High risk of cold exposure. Wear insulated thermal layers.`,
        severity: "critical"
      });
    }

    setAlerts(activeAlerts);
  }, [weather]);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const visibleAlerts = alerts.filter(alert => !dismissedIds.includes(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "heat":
        return <Thermometer className="h-5 w-5 text-amber-500 animate-pulse" />;
      case "cold":
        return <Thermometer className="h-5 w-5 text-blue-400" />;
      case "storm":
        return <CloudLightning className="h-5 w-5 text-rose-500 animate-bounce" />;
      case "uv":
        return <Sun className="h-5 w-5 text-orange-500 animate-spin-slow" style={{ animationDuration: "12s" }} />;
      case "wind":
        return <Wind className="h-5 w-5 text-sky-400" />;
      default:
        return <ShieldAlert className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div id="weather-alerts-container" className="space-y-3 mb-8 relative z-30 max-w-7xl mx-auto w-full">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          id={alert.id}
          className={`flex items-start justify-between gap-4 p-4.5 rounded-2xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden ${
            alert.severity === "critical"
              ? "bg-rose-50/90 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40 text-rose-900 dark:text-rose-200"
              : "bg-amber-50/90 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200"
          }`}
        >
          {/* Subtle Ambient Red/Orange glow animation */}
          <div className={`absolute top-0 left-0 w-1 h-full ${
            alert.severity === "critical" ? "bg-rose-500" : "bg-amber-500"
          }`} />

          <div className="flex items-start gap-3 relative z-10">
            <div className={`p-2.5 rounded-xl ${
              alert.severity === "critical"
                ? "bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300"
                : "bg-amber-100/80 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300"
            }`}>
              {getAlertIcon(alert.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-tight">{alert.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-4xs font-mono font-bold uppercase tracking-wider ${
                  alert.severity === "critical"
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-amber-500 text-white"
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {alert.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDismiss(alert.id)}
            className="p-1.5 rounded-xl hover:bg-slate-200/35 dark:hover:bg-slate-800/40 transition-colors focus:outline-none"
            aria-label="Dismiss weather alert"
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
          </button>
        </div>
      ))}
    </div>
  );
}
