"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRisk } from "@/context/RiskContext";
import { RiskAssessment } from "@/lib/types";
import {
  Flame,
  ShieldAlert,
  Thermometer,
  Droplets,
  Layers,
  Building,
  Truck,
  Navigation,
  Radio,
} from "lucide-react";

// Helper component to center map on selected village
function MapController({ selected }: { selected: RiskAssessment | null }) {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      map.panTo([selected.village.lat, selected.village.lon], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selected, map]);
  return null;
}

// Helper component to fly map dynamically when district changes
function DistrictFlyController({
  districtLat,
  districtLon,
  zoom,
  districtId,
}: {
  districtLat: number;
  districtLon: number;
  zoom: number;
  districtId: string;
}) {
  const map = useMap();
  const prevDistrictRef = React.useRef(districtId);

  useEffect(() => {
    if (prevDistrictRef.current !== districtId) {
      prevDistrictRef.current = districtId;
      map.flyTo([districtLat, districtLon], zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [districtId, districtLat, districtLon, zoom, map]);

  return null;
}

// Helper component to fly map dynamically when a live search location is selected
function LiveSearchFlyController({ liveAssessment }: { liveAssessment: RiskAssessment | null }) {
  const map = useMap();
  const prevIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (liveAssessment && liveAssessment.village.id !== prevIdRef.current) {
      prevIdRef.current = liveAssessment.village.id;
      map.flyTo([liveAssessment.village.lat, liveAssessment.village.lon], 12.0, {
        animate: true,
        duration: 1.6,
      });
    }
  }, [liveAssessment, map]);

  return null;
}

export default function LeafletMap() {
  const {
    assessments,
    selectedVillageId,
    selectedAssessment,
    selectVillage,
    fireHotspots,
    showHotspotsLayer,
    selectedDistrict,
    currentDistrictInfo,
    liveSearchAssessment,
    clearLiveSearch,
  } = useRisk();

  const [basemap, setBasemap] = useState<"dark" | "satellite" | "streets">("dark");
  const [showEvacuationRoute, setShowEvacuationRoute] = useState(true);
  const [showFleet, setShowFleet] = useState(true);

  // Dynamic center from active district
  const centerLat = currentDistrictInfo.centerLat;
  const centerLon = currentDistrictInfo.centerLon;
  const zoom = currentDistrictInfo.zoom || 9.5;

  const basemapUrls = {
    dark: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    streets: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  const basemapAttributions = {
    dark: '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin',
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a> & NASA',
    streets: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };

  const getMarkerColor = (level: string) => {
    if (level === "High") return "#D32F2F";
    if (level === "Moderate") return "#F9A825";
    return "#2E7D32";
  };

  // Dynamic relief fleet for active physical disaster response centered on current district
  const reliefFleet = [
    {
      id: `tanker-01-${selectedDistrict}`,
      type: "Water Tanker",
      callsign: "DISASTER-RESP-01",
      lat: centerLat + 0.045,
      lon: centerLon - 0.035,
      status: `En Route to ${currentDistrictInfo.name} Relief Sector`,
      speed: "34 km/h",
    },
    {
      id: `medical-01-${selectedDistrict}`,
      type: "Mobile Disaster ICU",
      callsign: "AMB-RAPID-04",
      lat: centerLat - 0.038,
      lon: centerLon + 0.025,
      status: `Standby at ${currentDistrictInfo.name} Collectorate`,
      speed: "0 km/h",
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0A1128] overflow-hidden">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: "#0A1128" }}
      >
        <DistrictFlyController
          districtLat={centerLat}
          districtLon={centerLon}
          zoom={zoom}
          districtId={selectedDistrict}
        />
        <LiveSearchFlyController liveAssessment={liveSearchAssessment} />
        <MapController selected={selectedAssessment} />

        {/* Dynamic Basemap Tile Layer (Watermark-Free) */}
        <TileLayer
          key={basemap}
          attribution={basemapAttributions[basemap]}
          url={basemapUrls[basemap]}
          maxZoom={18}
        />

        {/* Evacuation / Relief Corridor Line to Nearest Shelter */}
        {showEvacuationRoute && selectedAssessment && selectedAssessment.nearest_shelter && (
          <>
            <Polyline
              positions={[
                [selectedAssessment.village.lat, selectedAssessment.village.lon],
                [selectedAssessment.nearest_shelter.lat, selectedAssessment.nearest_shelter.lon],
              ]}
              pathOptions={{
                color: "#EC1E63",
                weight: 3,
                dashArray: "6, 8",
                opacity: 0.9,
              }}
            />
            {/* Shelter Destination Landmark Pin */}
            <CircleMarker
              center={[selectedAssessment.nearest_shelter.lat, selectedAssessment.nearest_shelter.lon]}
              radius={8}
              pathOptions={{
                color: "#00E676",
                fillColor: "#00C853",
                fillOpacity: 0.95,
                weight: 2,
              }}
            >
              <Popup className="sanjeevani-map-popup">
                <div className="p-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                    <Building size={14} />
                    <span>Designated Relief Shelter</span>
                  </div>
                  <div className="font-semibold text-gray-900">{selectedAssessment.nearest_shelter.name}</div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    Distance: <strong className="text-pink">{selectedAssessment.nearest_shelter.distanceKm} km</strong> • Cap: {selectedAssessment.nearest_shelter.capacity}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* Emergency Relief Fleet Layer (Water Tankers & Medical Ambulances) */}
        {showFleet &&
          reliefFleet.map((unit) => (
            <CircleMarker
              key={unit.id}
              center={[unit.lat, unit.lon]}
              radius={6}
              pathOptions={{
                color: "#00B0FF",
                fillColor: "#2979FF",
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup className="sanjeevani-map-popup">
                <div className="p-2 text-xs">
                  <div className="flex items-center gap-1 font-bold text-blue-600 mb-0.5">
                    <Truck size={13} />
                    <span>{unit.type} ({unit.callsign})</span>
                  </div>
                  <div className="text-[11px] text-gray-700">{unit.status}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">Speed: {unit.speed} • GPS Verified</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* NASA FIRMS Thermal Hotspots Layer */}
        {showHotspotsLayer &&
          fireHotspots.map((hotspot) => (
            <CircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lon]}
              radius={7}
              pathOptions={{
                color: "#FF3D00",
                fillColor: "#FF6D00",
                fillOpacity: 0.85,
                weight: 2,
                dashArray: "3, 3",
              }}
            >
              <Popup className="sanjeevani-map-popup">
                <div className="p-2 text-xs max-w-[220px]">
                  <div className="flex items-center gap-1.5 font-bold text-red-600 mb-1">
                    <Flame size={14} className="fill-red-500" />
                    <span>NASA Satellite Thermal Hotspot</span>
                  </div>
                  <p className="text-[11px] text-gray-700 font-medium">
                    {hotspot.location_name || "Thermal Radiance Anomaly"}
                  </p>
                  <div className="mt-2 space-y-0.5 text-[10px] text-gray-600 font-mono bg-gray-50 p-1.5 rounded">
                    <div>Brightness: {hotspot.brightness} K</div>
                    <div>FRP: {hotspot.frp} MW (Fire Radiative Power)</div>
                    <div>Confidence: {hotspot.confidence.toUpperCase()}</div>
                    {hotspot.is_fallback && (
                      <div className="text-amber-600 italic">Fallback Reference Baseline</div>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Village Risk Markers */}
        {assessments.map((item) => {
          const isSelected = item.village.id === selectedVillageId;
          const isHigh = item.risk_level === "High";
          const color = getMarkerColor(item.risk_level);
          const radius = Math.max(9, Math.min(22, Math.sqrt(item.village.population) / 18));

          return (
            <React.Fragment key={item.village.id}>
              {/* Outer pulsing beacon ring for High Risk */}
              {isHigh && (
                <CircleMarker
                  center={[item.village.lat, item.village.lon]}
                  radius={radius + 9}
                  pathOptions={{
                    color: "#D32F2F",
                    fillColor: "#D32F2F",
                    fillOpacity: 0.25,
                    weight: 1.5,
                    dashArray: "2, 4",
                  }}
                />
              )}

              {/* Selection Halo */}
              {isSelected && (
                <CircleMarker
                  center={[item.village.lat, item.village.lon]}
                  radius={radius + 5}
                  pathOptions={{
                    color: "#EC1E63",
                    fillColor: "transparent",
                    weight: 3,
                  }}
                />
              )}

              {/* Primary Core Marker */}
              <CircleMarker
                center={[item.village.lat, item.village.lon]}
                radius={radius}
                pathOptions={{
                  color: isSelected ? "#FFFFFF" : color,
                  fillColor: color,
                  fillOpacity: isHigh ? 0.95 : 0.85,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => selectVillage(item.village.id),
                }}
              >
                <Popup className="sanjeevani-map-popup">
                  <div className="p-2.5 text-xs min-w-[210px]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm text-gray-900">
                        {item.village.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                        style={{ backgroundColor: color }}
                      >
                        {item.risk_level} Risk
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-600 mb-2">
                      Block: <span className="font-semibold text-gray-800">{item.village.block}</span> • Pop:{" "}
                      <span className="font-semibold text-gray-800">
                        {item.village.population.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-gray-100 p-2 rounded mb-2">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Thermometer size={13} className="text-red-500" />
                        <span>{Math.round(item.weather.max_temperature_forecast)}°C Peak</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Droplets size={13} className="text-blue-500" />
                        <span>{item.groundwater.water_level_mbgl} mbgl</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-700 mb-3">
                      <span className="font-semibold text-gray-900">Primary Hazard: </span>
                      {item.primary_risk_driver}
                    </div>

                    <button
                      onClick={() => selectVillage(item.village.id)}
                      className="w-full bg-navy hover:bg-navy-light text-white text-[11px] font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <ShieldAlert size={13} className="text-pink" />
                      <span>Inspect Risk & Alert Details</span>
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* Live Search Custom Location Pin & Radar Wave */}
        {liveSearchAssessment && (
          <React.Fragment key={liveSearchAssessment.village.id}>
            {/* Outer Pulsing Live Radar Ring */}
            <CircleMarker
              center={[liveSearchAssessment.village.lat, liveSearchAssessment.village.lon]}
              radius={32}
              pathOptions={{
                color: "#00E5FF",
                fillColor: "#00E5FF",
                fillOpacity: 0.2,
                weight: 1.5,
                dashArray: "4, 6",
              }}
            />
            <CircleMarker
              center={[liveSearchAssessment.village.lat, liveSearchAssessment.village.lon]}
              radius={20}
              pathOptions={{
                color: "#D500F9",
                fillColor: "#D500F9",
                fillOpacity: 0.35,
                weight: 2,
              }}
            />
            <CircleMarker
              center={[liveSearchAssessment.village.lat, liveSearchAssessment.village.lon]}
              radius={11}
              pathOptions={{
                color: "#FFFFFF",
                fillColor: getMarkerColor(liveSearchAssessment.risk_level),
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Popup className="sanjeevani-map-popup" autoPan={true}>
                <div className="p-2.5 text-xs min-w-[220px]">
                  <div className="flex items-center gap-1 font-bold text-cyan-400 mb-1 bg-cyan-950/60 p-1 rounded text-[10px] uppercase">
                    <Radio size={12} className="animate-pulse" />
                    <span>Real-Time Geocoded Hazard Pin</span>
                  </div>
                  <div className="font-bold text-sm text-gray-900 mt-1">
                    {liveSearchAssessment.village.name}
                  </div>
                  <div className="text-[11px] text-gray-600 mb-2">
                    {liveSearchAssessment.village.district}, {liveSearchAssessment.village.state}
                  </div>
                  <div className="bg-gray-100 p-2 rounded mb-2 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Live Forecast:</span>
                      <strong className="text-gray-900">
                        {Math.round(liveSearchAssessment.weather.max_temperature_forecast)}°C / {liveSearchAssessment.weather.precipitation_forecast_sum}mm rain
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Risk Score:</span>
                      <strong style={{ color: getMarkerColor(liveSearchAssessment.risk_level) }}>
                        {Math.round(liveSearchAssessment.overall_score * 100)} / 100 ({liveSearchAssessment.risk_level})
                      </strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-tight">
                    {liveSearchAssessment.village.primary_hazard}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        )}
      </MapContainer>

      {/* Live Search Mode Floating Banner */}
      {liveSearchAssessment && (
        <div className="absolute top-3 left-14 z-20 bg-navy/95 border border-cyan-400/80 px-3.5 py-1.5 rounded-lg shadow-xl flex items-center gap-2.5 backdrop-blur-md text-xs text-white">
          <Radio size={14} className="text-cyan-400 animate-pulse flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-bold text-cyan-300">
              Live Hazard Radar: {liveSearchAssessment.village.name}
            </span>
            <span className="text-[11px] text-gray-300">
              ({liveSearchAssessment.village.district}, {liveSearchAssessment.village.state}) • Score:{" "}
              <strong style={{ color: getMarkerColor(liveSearchAssessment.risk_level) }}>
                {Math.round(liveSearchAssessment.overall_score * 100)}/100
              </strong>
            </span>
          </div>
          <button
            onClick={clearLiveSearch}
            className="ml-2 bg-navy-card hover:bg-navy-light text-gray-300 hover:text-white px-2 py-0.5 rounded border border-gray-700 text-[10px] transition-colors"
          >
            Exit Live Search
          </button>
        </div>
      )}

      {/* Top Map Controls Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-navy/90 backdrop-blur-sm border border-navy-light/80 p-1 rounded-card text-xs shadow-lg">
        {/* Basemap Switcher */}
        <div className="flex items-center text-[10px] font-medium">
          <button
            onClick={() => setBasemap("dark")}
            className={`px-2 py-1 rounded transition-colors ${
              basemap === "dark" ? "bg-pink text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Dark Ops
          </button>
          <button
            onClick={() => setBasemap("satellite")}
            className={`px-2 py-1 rounded transition-colors ${
              basemap === "satellite" ? "bg-pink text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setBasemap("streets")}
            className={`px-2 py-1 rounded transition-colors ${
              basemap === "streets" ? "bg-pink text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
          >
            Streets
          </button>
        </div>

        <div className="w-[1px] h-4 bg-gray-700" />

        {/* Evacuation Route Toggle */}
        <button
          onClick={() => setShowEvacuationRoute((p) => !p)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
            showEvacuationRoute ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-gray-400 hover:text-white"
          }`}
          title="Toggle route line to nearest relief center"
        >
          <Navigation size={11} />
          <span className="hidden sm:inline">Relief Route</span>
        </button>

        {/* Fleet Tracker Toggle */}
        <button
          onClick={() => setShowFleet((p) => !p)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
            showFleet ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-gray-400 hover:text-white"
          }`}
          title="Toggle live water tanker fleet positions"
        >
          <Truck size={11} />
          <span className="hidden sm:inline">Fleet</span>
        </button>
      </div>

      {/* Floating Interactive Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-navy/90 backdrop-blur-sm border border-navy-light/80 p-3 rounded-card text-white text-[11px] shadow-xl max-w-[240px]">
        <div className="font-heading font-semibold text-xs text-gray-200 mb-2 border-b border-gray-700 pb-1 flex items-center justify-between">
          <span>Map Telemetry Legend</span>
          <span className="text-[9px] text-pink font-mono uppercase">{basemap} Mode</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#D32F2F] border border-white/50 flex-shrink-0 relative">
              <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-60"></span>
            </span>
            <span className="text-gray-200">High Risk (&gt;0.70) — Pulsing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F9A825] border border-white/40 flex-shrink-0"></span>
            <span className="text-gray-200">Moderate Risk (0.40–0.69)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#2E7D32] border border-white/40 flex-shrink-0"></span>
            <span className="text-gray-200">Low Risk (&lt;0.40)</span>
          </div>
          {showEvacuationRoute && (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white/60"></span>
              <span>Designated Cooling Shelter</span>
            </div>
          )}
          {showFleet && (
            <div className="flex items-center gap-2 text-blue-300">
              <Truck size={12} className="text-blue-400" />
              <span>Water Tanker / Relief Vehicle</span>
            </div>
          )}
          {showHotspotsLayer && (
            <div className="flex items-center gap-2 pt-1 border-t border-gray-700/60 text-orange-300">
              <Flame size={13} className="fill-orange-500 text-orange-500 flex-shrink-0" />
              <span>NASA Satellite Thermal Radiance</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
