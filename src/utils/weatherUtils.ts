import { 
  Sun, 
  Moon, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  Snowflake, 
  CloudLightning,
  Wind,
  LucideIcon
} from "lucide-react";

interface WeatherCodeDetails {
  label: string;
  icon: LucideIcon;
  gradientClass: string; // Subtle visual mood representing weather
  darkGradientClass: string;
}

export function getWeatherDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  // WMO Weather interpretation codes
  switch (code) {
    case 0:
      return {
        label: "Clear Sky",
        icon: isDay ? Sun : Moon,
        gradientClass: "from-amber-50 to-orange-100/40 text-amber-600",
        darkGradientClass: "dark:from-amber-950/20 dark:to-orange-950/10 dark:text-amber-400"
      };
    case 1:
    case 2:
      return {
        label: isDay ? "Mainly Clear" : "Partly Cloudy",
        icon: isDay ? CloudSun : Cloud,
        gradientClass: "from-sky-50 to-blue-100/40 text-sky-600",
        darkGradientClass: "dark:from-sky-950/20 dark:to-blue-950/10 dark:text-sky-400"
      };
    case 3:
      return {
        label: "Overcast",
        icon: Cloud,
        gradientClass: "from-slate-100 to-slate-200/50 text-slate-600",
        darkGradientClass: "dark:from-slate-900 dark:to-slate-950/50 dark:text-slate-400"
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        icon: CloudFog,
        gradientClass: "from-gray-100 to-zinc-200/50 text-zinc-600",
        darkGradientClass: "dark:from-zinc-900 dark:to-zinc-950/50 dark:text-zinc-400"
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Drizzle",
        icon: CloudDrizzle,
        gradientClass: "from-blue-50 to-teal-100/30 text-blue-500",
        darkGradientClass: "dark:from-blue-950/25 dark:to-teal-950/10 dark:text-blue-400"
      };
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle",
        icon: Snowflake,
        gradientClass: "from-cyan-50 to-indigo-100/30 text-cyan-500",
        darkGradientClass: "dark:from-cyan-950/20 dark:to-indigo-950/10 dark:text-cyan-400"
      };
    case 61:
    case 63:
    case 65:
      return {
        label: "Rain",
        icon: CloudRain,
        gradientClass: "from-blue-100 to-blue-200/40 text-blue-600",
        darkGradientClass: "dark:from-blue-950/40 dark:to-slate-900 dark:text-blue-300"
      };
    case 66:
    case 67:
      return {
        label: "Freezing Rain",
        icon: CloudSnow,
        gradientClass: "from-cyan-100 to-blue-200/30 text-cyan-600",
        darkGradientClass: "dark:from-cyan-950/30 dark:to-blue-950/20 dark:text-cyan-300"
      };
    case 71:
    case 73:
    case 75:
      return {
        label: "Snowfall",
        icon: Snowflake,
        gradientClass: "from-indigo-50 to-zinc-100 text-indigo-500",
        darkGradientClass: "dark:from-indigo-950/20 dark:to-zinc-900 dark:text-indigo-300"
      };
    case 77:
      return {
        label: "Snow Grains",
        icon: Snowflake,
        gradientClass: "from-slate-100 to-indigo-100/50 text-indigo-500",
        darkGradientClass: "dark:from-slate-950 dark:to-indigo-950/10 dark:text-indigo-400"
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        icon: CloudRain,
        gradientClass: "from-blue-100 to-sky-200/50 text-blue-600",
        darkGradientClass: "dark:from-blue-950/40 dark:to-sky-950/20 dark:text-blue-300"
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        icon: CloudSnow,
        gradientClass: "from-indigo-100 to-blue-100/40 text-indigo-600",
        darkGradientClass: "dark:from-indigo-950/30 dark:to-blue-950/15 dark:text-indigo-300"
      };
    case 95:
      return {
        label: "Thunderstorm",
        icon: CloudLightning,
        gradientClass: "from-purple-50 to-slate-200 text-purple-600",
        darkGradientClass: "dark:from-purple-950/20 dark:to-slate-900 dark:text-purple-400"
      };
    case 96:
    case 99:
      return {
        label: "Thunderstorm & Hail",
        icon: CloudLightning,
        gradientClass: "from-red-50 to-purple-100 text-purple-700",
        darkGradientClass: "dark:from-red-950/20 dark:to-purple-950/20 dark:text-purple-400"
      };
    default:
      return {
        label: "Unknown",
        icon: Sun,
        gradientClass: "from-slate-50 to-slate-100 text-slate-500",
        darkGradientClass: "dark:from-slate-900 dark:to-slate-950/30 dark:text-slate-400"
      };
  }
}

// Convert wind direction in degrees to compass heading
export function getWindDirection(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor((deg / 22.5) + 0.5);
  return directions[val % 16];
}
