import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { CityResult } from "../types";

interface SearchBoxProps {
  onSelectCity: (city: CityResult) => void;
  selectedCity: CityResult | null;
}

export default function SearchBox({ onSelectCity, selectedCity }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch cities when query changes with a simple debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error("Failed to search location");
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setResults(data.results);
          setIsOpen(true);
        } else {
          setResults([]);
          setError("No locations found.");
        }
      } catch (err: any) {
        console.error("Geocoding fetch error:", err);
        setError("Error finding locations.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (city: CityResult) => {
    onSelectCity(city);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  return (
    <div id="search-box-container" ref={wrapperRef} className="relative w-full max-w-md z-30">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search id="search-icon" className="h-5 w-5" />
        </div>
        <input
          id="city-search-input"
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 text-sm bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/50 dark:border-slate-800/70 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all shadow-sm"
          placeholder="Search for a city (e.g. Paris, Tokyo, London)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {isLoading && <Loader2 id="search-loader" className="h-4 w-4 animate-spin text-sky-500" />}
          {query && (
            <button
              id="clear-search-button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (query.trim().length >= 2) && (results.length > 0 || error) && (
        <div
          id="search-results-dropdown"
          className="absolute mt-2 w-full bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
        >
          {error ? (
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">
              {error}
            </div>
          ) : (
            results.map((city) => (
              <button
                id={`city-result-${city.id}`}
                key={city.id}
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between group focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-sky-500 transition-colors" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {city.name}
                    </span>
                    {city.admin1 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">
                        • {city.admin1}
                      </span>
                    )}
                    {city.country && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">
                        • {city.country}
                      </span>
                    )}
                  </div>
                </div>
                {city.country_code && (
                  <span className="text-xs font-mono font-semibold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded uppercase">
                    {city.country_code}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
