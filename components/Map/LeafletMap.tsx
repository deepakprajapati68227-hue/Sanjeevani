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

  const [basemap, setBasemap] = useState<"light" | "dark" | "satellite">("light");
  const [showEvacuationRoute, setShowEvacuationRoute] = useState(true);
  const [showFleet, setShowFleet] = useState(true);

  // Dynamic center from active district
  const centerLat = currentDistrictInfo.centerLat;
  const centerLon = currentDistrictInfo.centerLon;
  const zoom = currentDistrictInfo.zoom || 9.5;

  const basemapUrls = {
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const basemapAttributions = {
    light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a> & NASA',
  };

  const getMarkerColor = (level: string) => {
    if (level === "High") return "#B9383E";
    if (level === "Moderate") return "#C47A12";
    return "#267A58";
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
    <div className="relative w-full h-full bg-[#EAF2F5] min-h-[420px] select-none">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0 font-sans"
        zoomControl={false}
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

        {/* Evacuation Route to Nearest Shelter */}
        {showEvacuationRoute && selectedAssessment && selectedAssessment.nearest_shelter && (
          <>
            <Polyline
              positions={[
                [selectedAssessment.village.lat, selectedAssessment.village.lon],
                [selectedAssessment.nearest_shelter.lat, selectedAssessment.nearest_shelter.lon],
              ]}
              pathOptions={{
                color: "#087F7B",
                weight: 3,
                dashArray: "6, 8",
                opacity: 0.95,
              }}
            />
            {/* Shelter Destination Landmark Pin */}
            <CircleMarker
              center={[selectedAssessment.nearest_shelter.lat, selectedAssessment.nearest_shelter.lon]}
              radius={8}
              pathOptions={{
                color: "#267A58",
                fillColor: "#267A58",
                fillOpacity: 0.95,
                weight: 2,
              }}
            >
              <Popup className="sanjeevani-map-popup">
                <div className="p-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#2E8B68] mb-1">
                    <Building size={14} />
                    <span>Designated Relief Shelter</span>
                  </div>
                  <div className="font-semibold text-[#17212B]">{selectedAssessment.nearest_shelter.name}</div>
                  <div className="text-[10px] text-[#526575] mt-1">
                    Distance: <strong className="text-[#147D78]">{selectedAssessment.nearest_shelter.distanceKm} km</strong> • Cap: {selectedAssessment.nearest_shelter.capacity}
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
                    color: "#4CC9F0",
                    fillColor: "transparent",
                    weight: 2.5,
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
                      className="w-full bg-[#203447] hover:bg-[#2D465A] text-white text-[11px] font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert size={13} className="text-[#147D78]" />
                      <span>Inspect Risk &amp; Alert Details</span>
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
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-white/95 border border-[#E7EDF0] p-1 rounded-md text-xs shadow-md">
        {/* Basemap Switcher */}
        <div className="flex items-center text-[10px] font-medium">
          <button
            onClick={() => setBasemap("light")}
            className={`px-2 py-1 rounded transition-colors ${
              basemap === "light" ? "bg-[#147D78] text-white font-bold" : "text-[#526575] hover:text-[#17212B]"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setBasemap("dark")}
            className={`px-2 py-1 rounded transition-colors ${
              basemap === "dark" ? "bg-[#147D78] text-white font-bold" : "text-[#526575] hover:text-[#17212B]"
            }`}
          >
            Dark Ops
          </button>
          <button
            onClick={() => setBasemap("satellite")}
            className={`px-2 py-1 rounded transition-colors ${
              basemap === "satellite" ? "bg-[#147D78] text-white font-bold" : "text-[#526575] hover:text-[#17212B]"
            }`}
          >
            Satellite
          </button>
        </div>

        <div className="w-[1px] h-4 bg-[#E7EDF0]" />

        {/* Evacuation Route Toggle */}
        <button
          onClick={() => setShowEvacuationRoute((p) => !p)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
            showEvacuationRoute ? "bg-[#EAF5F0] text-[#2E8B68] border border-[#BCE1D1]" : "text-[#526575] hover:text-[#17212B]"
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
            showFleet ? "bg-[#F4F7F8] text-[#2F6F9F] border border-[#D5DFE5]" : "text-[#526575] hover:text-[#17212B]"
          }`}
          title="Toggle live water tanker fleet positions"
        >
          <Truck size={11} />
          <span className="hidden sm:inline">Fleet</span>
        </button>
      </div>

      {/* Floating Interactive Map Legend (Canonical Thresholds) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 border border-[#E7EDF0] p-3 rounded-md text-[#17212B] text-[11px] shadow-md max-w-[240px]">
        <div className="font-heading font-semibold text-xs text-[#17212B] mb-2 border-b border-[#E7EDF0] pb-1 flex items-center justify-between">
          <span>Map Risk Legend</span>
          <span className="text-[9px] text-[#147D78] font-mono uppercase font-bold">{basemap} Mode</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#C43D3D] border border-white flex-shrink-0"></span>
            <span className="text-[#17212B]">Critical (&ge;0.70)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#B7791F] border border-white flex-shrink-0"></span>
            <span className="text-[#17212B]">Watch (0.45–0.69)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#2E8B68] border border-white flex-shrink-0"></span>
            <span className="text-[#17212B]">Stable (&lt;0.45)</span>
          </div>
          {showEvacuationRoute && (
            <div className="flex items-center gap-2 text-[#2E8B68]">
              <span className="w-3 h-3 rounded-full bg-[#2E8B68] border border-white"></span>
              <span>Designated Cooling Shelter</span>
            </div>
          )}
          {showFleet && (
            <div className="flex items-center gap-2 text-[#2F6F9F]">
              <Truck size={12} className="text-[#2F6F9F]" />
              <span>Water Tanker / Relief Vehicle</span>
            </div>
          )}
          {showHotspotsLayer && (
            <div className="flex items-center gap-2 pt-1 border-t border-[#E7EDF0] text-[#B7791F]">
              <Flame size={13} className="fill-[#B7791F] text-[#B7791F] flex-shrink-0" />
              <span>NASA Satellite Thermal Radiance</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
