"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRisk } from "@/context/RiskContext";
import { Search, Loader2, MapPin, X, Radio, AlertCircle, Sparkles } from "lucide-react";

interface GeocodeResult {
  id: string;
  name: string;
  displayName: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  type: string;
}

export default function LiveLocationSearch() {
  const { setLiveSearchAssessment, liveSearchAssessment, clearLiveSearch } = useRisk();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingHazard, setIsLoadingHazard] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing with debounced geocoding search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(val.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  // Handle location selection
  const handleSelectLocation = async (item: GeocodeResult) => {
    setIsOpen(false);
    setIsLoadingHazard(true);
    setStatusMessage(`Connecting to meteorological satellites for ${item.name}...`);

    try {
      const url = `/api/live-hazard?lat=${item.lat}&lon=${item.lon}&name=${encodeURIComponent(
        item.name
      )}&district=${encodeURIComponent(item.district)}&state=${encodeURIComponent(item.state)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to evaluate live hazard");

      const data = await res.json();
      if (data.assessment) {
        setLiveSearchAssessment(data.assessment);
        setStatusMessage(`Live radar locked on ${item.name}, ${item.district}`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.error("Live hazard query failed:", err);
      setStatusMessage("Failed to evaluate live hazard for location.");
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsLoadingHazard(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    clearLiveSearch();
  };

  return (
    <div ref={containerRef} className="relative z-40 w-full sm:w-80 md:w-96">
      {/* Search Input Box */}
      <div
        className={`flex items-center gap-2 bg-navy-card/95 border px-3 py-1.5 rounded-lg shadow-md transition-all ${
          liveSearchAssessment
            ? "border-cyan-400/80 ring-1 ring-cyan-400/50"
            : isOpen
            ? "border-[#147D78] ring-1 ring-[#147D78]/40"
            : "border-navy-light/80 hover:border-gray-600"
        }`}
      >
        {isLoadingHazard ? (
          <Loader2 size={16} className="text-cyan-400 animate-spin flex-shrink-0" />
        ) : liveSearchAssessment ? (
          <Radio size={16} className="text-cyan-400 animate-pulse flex-shrink-0" />
        ) : (
          <Search size={15} className="text-gray-400 flex-shrink-0" />
        )}

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={
            liveSearchAssessment
              ? `Live: ${liveSearchAssessment.village.name} (${liveSearchAssessment.village.district})`
              : "Search ANY Indian village, town, or place..."
          }
          className="bg-transparent text-white placeholder:text-gray-400 text-xs w-full focus:outline-none font-sans"
        />

        {/* Live Active Pill Indicator */}
        {liveSearchAssessment && !query && (
          <span className="hidden lg:inline-flex items-center gap-1 bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            LIVE
          </span>
        )}

        {/* Loading Spinner during debounce */}
        {isSearching && <Loader2 size={14} className="text-gray-400 animate-spin flex-shrink-0" />}

        {/* Clear Button */}
        {(query || liveSearchAssessment) && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-white p-0.5 rounded transition-colors flex-shrink-0"
            title="Clear search and return to district view"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Floating Status Notification */}
      {statusMessage && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#203447] border border-[#147D78]/60 p-2 rounded-md shadow-xl text-[11px] text-[#EAF5F0] flex items-center gap-2 animate-fade-in z-50">
          <Radio size={13} className="text-[#147D78] flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Autocomplete Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#203447] border border-[#2D465A] rounded-lg shadow-2xl overflow-hidden custom-scrollbar max-h-72 z-50 divide-y divide-[#2D465A]">
          <div className="px-3 py-1.5 bg-[#17212B] text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Pan-India Live Geocoding</span>
            <span className="text-[#147D78] font-bold">Select to Analyze Live Hazard</span>
          </div>

          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectLocation(item)}
              className="w-full text-left px-3 py-2.5 hover:bg-[#2D465A] transition-colors flex items-start gap-2.5 group"
            >
              <div className="mt-0.5 p-1 rounded bg-[#17212B] text-[#147D78] group-hover:bg-[#147D78] group-hover:text-white transition-colors flex-shrink-0">
                <MapPin size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-semibold text-xs text-white group-hover:text-[#147D78] transition-colors truncate">
                    {item.name}
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-gray-800 text-gray-300 font-mono flex-shrink-0">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {item.district !== item.name ? `${item.district}, ` : ""}
                  {item.state}
                </p>
                <div className="text-[9px] text-gray-500 font-mono mt-0.5">
                  GPS: {item.lat.toFixed(3)}°N, {item.lon.toFixed(3)}°E
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {isOpen && !isSearching && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-navy border border-gray-700 p-3 rounded-lg shadow-xl text-center text-xs text-gray-400 z-50">
          No matching Indian village, town, or tehsil found for "{query}".
        </div>
      )}
    </div>
  );
}
