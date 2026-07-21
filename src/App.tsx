import { useState, useEffect } from "react";
import { 
  CloudSun, 
  Sun, 
  Moon, 
  RefreshCw, 
  AlertCircle, 
  Sparkles,
  MapPin,
  CalendarDays
} from "lucide-react";
import SearchBox from "./components/SearchBox";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import Forecast7Day from "./components/Forecast7Day";
import ActivityRecommendations from "./components/ActivityRecommendations";
import SmartCharts from "./components/SmartCharts";
import WeatherAlerts from "./components/WeatherAlerts";
import { CityResult, WeatherData, WeatherRecommendation } from "./types";

// Default start city: Paris, France
const DEFAULT_CITY: CityResult = {
  id: 2988507,
  name: "Paris",
  latitude: 48.85341,
  longitude: 2.3488,
  country: "France",
  admin1: "Île-de-France",
  country_code: "FR"
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<WeatherRecommendation | null>(null);
  
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fetch geolocation and reverse geocode on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
            if (res.ok) {
              const cityDetails: CityResult = await res.json();
              setSelectedCity(cityDetails);
            }
          } catch (err) {
            console.error("Failed to reverse geocode user location on mount:", err);
          }
        },
        (error) => {
          console.warn("User location access was declined or timed out:", error);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 600000 }
      );
    }
  }, []);

  // Toggle theme
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // Fetch weather and then AI recommendations on selectedCity changes
  const fetchWeatherAndRecommendations = async (city: CityResult) => {
    setLoadingWeather(true);
    setLoadingAI(true);
    setError(null);
    setWeatherData(null);
    setRecommendations(null);

    try {
      // 1. Fetch Local Weather from Open-Meteo Proxy
      const weatherRes = await fetch(`/api/weather?lat=${city.latitude}&lon=${city.longitude}`);
      if (!weatherRes.ok) {
        throw new Error("Unable to fetch weather data. Please try again.");
      }
      const weatherJson: WeatherData = await weatherRes.json();
      setWeatherData(weatherJson);
      setLoadingWeather(false);

      // 2. Progressive load: Fetch AI planning recommendations using weather details
      try {
        const aiRes = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationName: city.name,
            weatherData: weatherJson
          })
        });
        if (!aiRes.ok) {
          throw new Error("AI Recommendation service offline.");
        }
        const aiJson: WeatherRecommendation = await aiRes.json();
        setRecommendations(aiJson);
      } catch (aiErr) {
        console.error("AI recommendations failure:", aiErr);
        // Do not fail the whole view if only AI fails, just log and keep recommendations null
      } finally {
        setLoadingAI(false);
      }

    } catch (err: any) {
      console.error("Main fetch sequence error:", err);
      setError(err.message || "Failed to establish connections. Check server connectivity.");
      setLoadingWeather(false);
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndRecommendations(selectedCity);
  }, [selectedCity]);

  const handleRefresh = () => {
    fetchWeatherAndRecommendations(selectedCity);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-12 font-sans">
      {/* Decorative Blur Background Glares */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/5 dark:bg-sky-950/5 blur-3xl rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-indigo-400/5 dark:bg-indigo-950/5 blur-3xl rounded-full pointer-events-none translate-x-1/3 z-0" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl shadow-md text-white">
              <CloudSun className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Weather Intelligence
              </h1>
              <p className="text-3xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                Precision Weather & Smart Planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              className="p-2.5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl focus:outline-none transition-all shadow-sm"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400 animate-pulse" /> : <Moon className="h-4.5 w-4.5 text-slate-500" />}
            </button>

            {/* Refresh Button */}
            <button
              id="refresh-weather-btn"
              onClick={handleRefresh}
              disabled={loadingWeather}
              className="p-2.5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl focus:outline-none transition-all shadow-sm disabled:opacity-50"
              title="Refresh localized weather data"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${loadingWeather ? "animate-spin text-sky-500" : ""}`} />
            </button>
          </div>
        </header>

        {/* Search Segment */}
        <section className="flex flex-col items-center justify-center text-center mb-8 relative z-20">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5 justify-center">
            <MapPin className="h-3.5 w-3.5 text-sky-500" />
            Forecast conditions matched with smart outdoor advice
          </p>
          <SearchBox onSelectCity={setSelectedCity} selectedCity={selectedCity} />
        </section>

        {/* Main Error Indicator */}
        {error && (
          <div id="main-error-banner" className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl flex items-start gap-3 mb-8 max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-400">Failed to establish connection</p>
              <p className="text-3xs text-rose-600 dark:text-rose-500 mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2.5 text-3xs font-semibold text-sky-600 dark:text-sky-400 underline hover:no-underline focus:outline-none"
              >
                Retry connection sequence
              </button>
            </div>
          </div>
        )}

        {/* Loader skeleton representing primary dashboard elements */}
        {loadingWeather && !weatherData && (
          <div id="dashboard-skeleton" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Weather Card Skeleton */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 h-64 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  </div>
                  <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
                <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              </div>
              {/* Hourly Forecast Skeleton */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 h-48 animate-pulse flex flex-col justify-between">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="flex gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-24 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>
            {/* 7 Day Forecast Skeleton */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 h-[480px] animate-pulse flex flex-col justify-between">
              <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="space-y-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-8 w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Weather Intelligence Dashboard Content */}
        {weatherData && (
          <>
            {/* Real-time critical atmospheric warning alerts */}
            <WeatherAlerts weather={weatherData} />

            <div id="weather-dashboard-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left and Main Content Widgets */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Current detailed weather card */}
              <CurrentWeatherCard weather={weatherData} city={selectedCity} />

              {/* Outdoor planning Activity recommendations */}
              <ActivityRecommendations recommendation={recommendations} isLoading={loadingAI} />

              {/* Smart atmospheric trends & predictive curves */}
              <SmartCharts weather={weatherData} />

              {/* 24h Hourly scrolling timeline */}
              <HourlyForecast weather={weatherData} />

            </div>

            {/* Right Side Forecast Widgets */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* 7-day outlook details */}
              <Forecast7Day weather={weatherData} />

              {/* Mini Informative Feature widget */}
              <div id="weather-tips-box" className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white shadow-sm flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-xl rounded-full -mr-8 -mt-8 pointer-events-none" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-3xs font-mono font-semibold uppercase tracking-wider">Planning Strategy</span>
                </div>
                <h4 className="text-xs font-semibold leading-tight mt-1">Smart Outdoor Planning advice is refreshed continuously</h4>
                <p className="text-4xs leading-relaxed text-indigo-100/90">
                  By tracking humidity, cloud covers, temperatures, UV levels, and rainfall probabilities, our system maps athletic index suitability metrics using advanced Generative intelligence.
                </p>
              </div>

            </div>

          </div>
          </>
        )}

      </div>
    </div>
  );
}
