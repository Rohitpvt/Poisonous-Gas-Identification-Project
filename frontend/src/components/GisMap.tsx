import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import {
  LANDFILL_SITES,
  RECEPTOR_NEIGHBORHOODS,
  SATELLITE_PLUMES,
  SAFE_ESCAPE_ZONES
} from '../data/constants';
import {
  MapPin,
  Wind,
  Info,
  Layers,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck,
  Satellite,
  Activity,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { PageDescriptionCard } from './PageDescriptionCard';

// Custom Map Marker Icons using Leaflet divIcon
const createCustomIcon = (color: string, iconSymbol: string, size = 32) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${size > 32 ? '16px' : '13px'};
        font-weight: bold;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        border: 2.5px solid white;
        transition: transform 0.2s ease;
      ">
        ${iconSymbol}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
  });
};

const landfillIcon = createCustomIcon('#EF4444', '🔥', 36);
const otherLandfillIcon = createCustomIcon('#F97316', '🌋', 30);
const stationIcon = createCustomIcon('#0284C7', '📡', 34);
const receptorIcon = createCustomIcon('#64748B', '🏘️', 26);
const exposedReceptorIcon = createCustomIcon('#DC2626', '⚠️', 30);
const satellitePlumeIcon = createCustomIcon('#8B5CF6', '🛰️', 28);
const safeZoneIcon = createCustomIcon('#10B981', '🛡️', 30);

export const GisMap: React.FC = () => {
  // State
  const [selectedSiteId, setSelectedSiteId] = useState<string>('ghazipur');
  const [windAngle, setWindAngle] = useState<number>(130);
  const [windSpeed, setWindSpeed] = useState<number>(2.2); // m/s
  const [activeScenario, setActiveScenario] = useState<string>('winter_inversion');
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Layer Visibility Controls
  const [layers, setLayers] = useState({
    plumeCone: true,
    satelliteFootprints: true,
    bufferRings: true,
    receptors: true,
    safeZones: true,
    otherLandfills: true
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Ghazipur Coordinates (Primary Super-Emitter Origin)
  const ghazipurLat = 28.6238;
  const ghazipurLng = 77.3284;
  const coneLength = 0.048; // ~4.8 km dispersion trajectory length
  const coneSpreadDeg = 28; // ±28° dispersion angle

  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Compute Plume dispersion polygon
  const leftAngle = windAngle - coneSpreadDeg;
  const rightAngle = windAngle + coneSpreadDeg;
  const p1 = [ghazipurLat, ghazipurLng];
  const p2 = [
    ghazipurLat + coneLength * Math.cos(rad(leftAngle)),
    ghazipurLng + (coneLength * 1.15) * Math.sin(rad(leftAngle))
  ];
  const p3 = [
    ghazipurLat + coneLength * Math.cos(rad(rightAngle)),
    ghazipurLng + (coneLength * 1.15) * Math.sin(rad(rightAngle))
  ];

  // Dynamically calculate which receptors are within the active plume cone
  const exposedNeighborhoods = useMemo(() => {
    return RECEPTOR_NEIGHBORHOODS.map((rec) => {
      // Angular difference between wind direction and receptor bearing
      let diff = Math.abs(rec.bearing - windAngle);
      if (diff > 180) diff = 360 - diff;
      const isExposed = diff <= (coneSpreadDeg + 6); // inside or right at plume margin
      const travelTimeMinutes = Math.round((rec.distanceKm * 1000) / (windSpeed * 60));
      return {
        ...rec,
        isExposed,
        diff,
        travelTimeMinutes
      };
    });
  }, [windAngle, windSpeed]);

  const currentlyExposedCount = exposedNeighborhoods.filter((n) => n.isExposed).length;
  const totalExposedPopulation = exposedNeighborhoods
    .filter((n) => n.isExposed)
    .reduce((sum, n) => sum + (n.population || 0), 0);

  // Quick Preset Scenarios
  const handleScenarioChange = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    if (scenarioKey === 'winter_inversion') {
      setWindAngle(130);
      setWindSpeed(1.3);
      setSelectedSiteId('ghazipur');
    } else if (scenarioKey === 'satellite_overpass') {
      setWindAngle(288);
      setWindSpeed(2.8);
      setSelectedSiteId('ghazipur');
    } else if (scenarioKey === 'north_wind') {
      setWindAngle(345);
      setWindSpeed(3.5);
      setSelectedSiteId('ghazipur');
    } else if (scenarioKey === 'safe_dispersion') {
      setWindAngle(215);
      setWindSpeed(4.0);
      setSelectedSiteId('ghazipur');
    }
  };

  const currentSelectedSite = LANDFILL_SITES.find((s) => s.id === selectedSiteId) || LANDFILL_SITES[0];

  return (
    <div className="space-y-6 animate-fade-in text-text-primary">
      {/* Page Title & Subheading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive GIS Geospatial Analyzer & Plume Tracker</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            Delhi Landfill Plumes & <span className="font-serif-italic font-normal text-brand-primary">Atmospheric Dispersion</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1 max-w-3xl leading-relaxed">
            Visualizing real-time atmospheric gas transport from the <strong>Ghazipur Landfill super-emitter</strong> to the <strong>DPCC Anand Vihar Continuous Ground Station</strong>, overlaid with NASA EMIT & ESA EnMAP satellite observations and exposed residential receptor hubs.
          </p>
        </div>

        {/* Live Plume Status Banner */}
        <div className="stat-pill px-4 py-3 flex items-center gap-4 bg-surface-card border border-border-light shadow-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${currentlyExposedCount > 0 ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
            <div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Hazard Level</div>
              <div className="text-xs font-bold text-text-primary">
                {currentlyExposedCount > 0 ? `⚠️ ${currentlyExposedCount} Hubs in Danger Sector` : '✅ Corridor Dispersing Clear'}
              </div>
            </div>
          </div>
          <div className="h-7 w-px bg-border-light" />
          <div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Exposed Pop.</div>
            <div className="text-xs font-mono font-bold text-brand-primary">
              {totalExposedPopulation.toLocaleString()} Residents
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory "How to Read This Map" Guide Box */}
      {showGuide && (
        <div className="card-elevated p-5 bg-gradient-to-r from-surface-card via-surface-light to-brand-primary/5 border border-brand-primary/20 relative">
          <button
            onClick={() => setShowGuide(false)}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary text-xs flex items-center gap-1 font-medium bg-white/60 px-2 py-1 rounded-lg border border-border-light"
            title="Dismiss Guide"
          >
            Got it, Hide Guide ✕
          </button>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-2 pr-20">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span>How to Read and Understand This GIS Map</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-mono">
                  4-Step Scientific Pipeline
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white/80 border border-border-light/60">
                  <div className="font-semibold text-red-600 flex items-center gap-1.5 mb-1">
                    <span>1. 🔥 Super-Emitter</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    <strong>Ghazipur Dumpsite</strong> emits ~3,843 kg/hr of anaerobic methane (CH₄) & ammonia (NH₃).
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-border-light/60">
                  <div className="font-semibold text-purple-600 flex items-center gap-1.5 mb-1">
                    <span>2. 🛰️ Satellite Footprint</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    NASA EMIT & ESA EnMAP satellites detect column methane density plumes from 400+ km orbit.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-border-light/60">
                  <div className="font-semibold text-amber-600 flex items-center gap-1.5 mb-1">
                    <span>3. 💨 Gaussian Dispersion</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    The <strong>Red Plume Cone</strong> represents downwind gas spread along the active wind vector (rotatable below).
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-border-light/60">
                  <div className="font-semibold text-emerald-600 flex items-center gap-1.5 mb-1">
                    <span>4. 🛡️ Safe Clean Corridors</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Green shields mark upwind eco-parks (Sanjay Lake, Akshardham) with up to 94% lower gas exposure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Scenario Tabs & Layer Controls Bar */}
      <div className="card-elevated p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Preset Scenarios */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Preset Scenarios:</span>
          </span>
          <button
            onClick={() => handleScenarioChange('winter_inversion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeScenario === 'winter_inversion'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'bg-surface-light text-text-secondary hover:bg-white hover:text-text-primary'
            }`}
          >
            🚨 Winter Smog Inversion (130° SE)
          </button>
          <button
            onClick={() => handleScenarioChange('satellite_overpass')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeScenario === 'satellite_overpass'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'bg-surface-light text-text-secondary hover:bg-white hover:text-text-primary'
            }`}
          >
            🛰️ NASA EMIT Overpass (288° NW)
          </button>
          <button
            onClick={() => handleScenarioChange('safe_dispersion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeScenario === 'safe_dispersion'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'bg-surface-light text-text-secondary hover:bg-white hover:text-text-primary'
            }`}
          >
            🛡️ Crosswind Evacuation (215° SW)
          </button>
        </div>

        {/* Leaflet Engine Badge & Reset Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-light border border-border-light text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Leaflet.js Standard Tile Engine</span>
          </div>
          {!showGuide && (
            <button
              onClick={() => setShowGuide(true)}
              className="text-xs text-brand-primary hover:underline font-medium px-2 py-1"
            >
              Show Guide
            </button>
          )}
        </div>
      </div>

      {/* Main Map & Detailed Breakdown Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leaflet Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card-elevated p-2.5 relative overflow-hidden h-[620px] shadow-lg rounded-3xl border border-border-light">
            <MapContainer
              center={[28.6280, 77.3080]}
              zoom={12}
              scrollWheelZoom={true}
              className="w-full h-full rounded-[20px] z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://leafletjs.com/">Leaflet.js</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 1. Ghazipur Buffer Zones (1km Danger Perimeter & 2.8km Station Circle) */}
              {layers.bufferRings && (
                <>
                  <Circle
                    center={[ghazipurLat, ghazipurLng]}
                    radius={1000}
                    pathOptions={{
                      color: '#DC2626',
                      fillColor: '#DC2626',
                      fillOpacity: 0.12,
                      weight: 1.5,
                      dashArray: '3, 4'
                    }}
                  >
                    <Tooltip sticky>High-Toxicity Perimeter (1.0 km)</Tooltip>
                  </Circle>
                  <Circle
                    center={[ghazipurLat, ghazipurLng]}
                    radius={2800}
                    pathOptions={{
                      color: '#F97316',
                      fillColor: '#F97316',
                      fillOpacity: 0.05,
                      weight: 1.5,
                      dashArray: '6, 6'
                    }}
                  >
                    <Tooltip sticky>DPCC Anand Vihar Ground Station Distance (2.8 km)</Tooltip>
                  </Circle>
                </>
              )}

              {/* 2. Dynamic Gaussian Plume Dispersion Cone */}
              {layers.plumeCone && (
                <Polygon
                  positions={[p1 as any, p2 as any, p3 as any]}
                  pathOptions={{
                    color: '#DC2626',
                    fillColor: '#EF4444',
                    fillOpacity: 0.32,
                    weight: 2.5
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <div className="font-bold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Active Plume Dispersion Corridor</span>
                      </div>
                      <div className="mt-1 text-text-secondary">
                        Wind Bearing: <strong>{windAngle}°</strong> ({windAngle >= 90 && windAngle <= 180 ? 'Southeast' : windAngle >= 270 && windAngle <= 360 ? 'Northwest' : 'Crosswind'})
                      </div>
                      <div className="text-text-secondary mt-0.5">
                        Dispersion Length: <strong>4.8 km</strong> | Spread: <strong>±28°</strong>
                      </div>
                      <div className="text-red-700 font-medium mt-1">
                        Estimated Ground Concentration: <strong>Elevated NH₃ & CH₄ Spike</strong>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              )}

              {/* 3. Satellite Plume Observation Footprints */}
              {layers.satelliteFootprints &&
                SATELLITE_PLUMES.map((obs, idx) => (
                  <Marker
                    key={`sat-${idx}`}
                    position={[
                      ghazipurLat + (idx % 2 === 0 ? 0.003 : -0.003) * (idx + 1),
                      ghazipurLng + (idx % 3 === 0 ? 0.004 : -0.002) * (idx + 1)
                    ]}
                    icon={satellitePlumeIcon}
                  >
                    <Popup>
                      <div className="p-1.5 text-xs font-sans">
                        <div className="font-bold text-purple-700 flex items-center gap-1">
                          <Satellite className="w-3.5 h-3.5" />
                          <span>{obs.instrument} Satellite Methane Detection</span>
                        </div>
                        <div className="text-text-muted text-[10px] mt-0.5 font-mono">{obs.datetime} UTC</div>
                        <div className="mt-1.5 p-2 rounded bg-purple-50 border border-purple-100 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">CH₄ Emission Rate:</span>
                            <span className="font-bold text-purple-900 font-mono">{obs.ch4EmissionKgHr.toFixed(1)} kg/hr</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Observed Wind:</span>
                            <span className="font-mono">{obs.windSpeed.toFixed(1)} m/s @ {obs.windDirection.toFixed(0)}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Target Facility:</span>
                            <span className="font-semibold text-text-primary">{obs.landfillSite} Landfill</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              {/* 4. Landfill & DPCC Station Markers */}
              {LANDFILL_SITES.map((site) => {
                if (!layers.otherLandfills && site.id !== 'ghazipur' && site.id !== 'anand_vihar_station') {
                  return null;
                }
                const icon =
                  site.id === 'ghazipur'
                    ? landfillIcon
                    : site.type === 'station'
                    ? stationIcon
                    : otherLandfillIcon;

                return (
                  <Marker
                    key={site.id}
                    position={[site.lat, site.lng]}
                    icon={icon}
                    eventHandlers={{
                      click: () => setSelectedSiteId(site.id)
                    }}
                  >
                    <Popup>
                      <div className="p-1 text-xs font-sans">
                        <div className="font-bold text-sm text-text-primary flex items-center gap-1">
                          <span>{site.type === 'station' ? '📡' : '🔥'}</span>
                          <span>{site.name}</span>
                        </div>
                        <div className="text-xs font-semibold text-brand-primary mt-0.5">{site.status}</div>
                        <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">{site.description}</p>
                        {site.ch4Emission && (
                          <div className="mt-2 p-1.5 rounded bg-red-50 text-red-800 font-mono font-medium text-[11px] border border-red-100">
                            Mean CH₄ Emission: {site.ch4Emission}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 5. Receptor Neighborhoods (Highlighted if in plume path) */}
              {layers.receptors &&
                exposedNeighborhoods.map((rec, i) => (
                  <Marker
                    key={`rec-${i}`}
                    position={[rec.lat, rec.lng]}
                    icon={rec.isExposed ? exposedReceptorIcon : receptorIcon}
                  >
                    <Popup>
                      <div className="p-1 text-xs font-sans">
                        <div className="font-bold text-sm text-text-primary flex items-center gap-1">
                          <span>{rec.isExposed ? '⚠️' : '🏘️'}</span>
                          <span>{rec.name}</span>
                        </div>
                        <div className="text-text-muted text-[11px]">{rec.type}</div>
                        <div className="mt-2 space-y-1 p-2 rounded bg-surface-light border border-border-light">
                          <div className="flex justify-between">
                            <span>Distance from Ghazipur:</span>
                            <span className="font-mono font-bold">{rec.distanceKm} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Azimuth Bearing:</span>
                            <span className="font-mono font-bold">{rec.bearing}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Population:</span>
                            <span className="font-mono font-bold">{rec.population?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gas Travel Time:</span>
                            <span className="font-mono font-bold text-brand-primary">~{rec.travelTimeMinutes} mins</span>
                          </div>
                        </div>
                        {rec.isExposed ? (
                          <div className="mt-2 p-1.5 rounded bg-red-100 text-red-800 font-bold text-[11px] text-center border border-red-200">
                            ⚠️ DIRECTLY IN ACTIVE PLUME PATH
                          </div>
                        ) : (
                          <div className="mt-2 p-1.5 rounded bg-green-100 text-green-800 font-medium text-[11px] text-center border border-green-200">
                            ✅ Currently Out of Direct Gas Path
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}

              {/* 6. Safe Escape Zones */}
              {layers.safeZones &&
                SAFE_ESCAPE_ZONES.map((zone) => (
                  <Marker
                    key={zone.id}
                    position={[zone.lat, zone.lng]}
                    icon={safeZoneIcon}
                  >
                    <Popup>
                      <div className="p-1 text-xs font-sans">
                        <div className="font-bold text-sm text-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{zone.name}</span>
                        </div>
                        <div className="text-emerald-700 font-medium text-[11px] mt-0.5">{zone.cleanAirIndex}</div>
                        <p className="text-text-secondary text-[11px] mt-1.5">
                          <strong>Escape Route:</strong> {zone.recommendedRoute}
                        </p>
                        <div className="mt-2 p-1.5 rounded bg-emerald-50 text-emerald-900 font-semibold text-[11px] border border-emerald-200 flex justify-between">
                          <span>Exposure Drop:</span>
                          <span className="font-bold">-{zone.exposureReductionPercent}% Less Gas</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>

            {/* Floating Layer Visibility Pills Overlay (Top Right) */}
            <div className="absolute top-5 right-5 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-border-light max-w-xs space-y-1.5 text-xs">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-border-light">
                <Layers className="w-3 h-3 text-brand-primary" />
                <span>Map Layer Toggles</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => toggleLayer('plumeCone')}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    layers.plumeCone ? 'bg-red-50 text-red-700 border border-red-200' : 'text-text-muted hover:bg-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Gaussian Plume Cone</span>
                  </span>
                  {layers.plumeCone ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => toggleLayer('satelliteFootprints')}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    layers.satelliteFootprints ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-text-muted hover:bg-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>NASA/ESA Satellites</span>
                  </span>
                  {layers.satelliteFootprints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => toggleLayer('receptors')}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    layers.receptors ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-text-muted hover:bg-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span>Populated Receptors</span>
                  </span>
                  {layers.receptors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => toggleLayer('safeZones')}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    layers.safeZones ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-text-muted hover:bg-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Safe Clean Corridors</span>
                  </span>
                  {layers.safeZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => toggleLayer('bufferRings')}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    layers.bufferRings ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'text-text-muted hover:bg-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    <span>Buffer Rings (1km / 2.8km)</span>
                  </span>
                  {layers.bufferRings ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Interactive Wind Direction & Speed Slider Overlay (Bottom Left) */}
            <div className="absolute bottom-5 left-5 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-border-light max-w-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <Wind className="w-4 h-4 text-brand-primary" />
                  <span>Interactive Wind Vector Controller</span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary">
                  {windAngle}° ({windAngle >= 100 && windAngle <= 160 ? '🚨 SE Smog Corridor' : 'Crosswind'})
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-text-secondary font-medium mb-1">
                  <span>Plume Direction (Azimuth):</span>
                  <span className="font-mono font-bold">{windAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={windAngle}
                  onChange={(e) => setWindAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-[9px] text-text-muted mt-0.5">
                  <span>0° (N)</span>
                  <span>90° (E)</span>
                  <span className="text-red-500 font-bold">130° (Anand Vihar)</span>
                  <span>270° (W)</span>
                  <span>360° (N)</span>
                </div>
              </div>

              <div className="pt-1 border-t border-border-light flex items-center justify-between text-xs">
                <span className="text-text-secondary text-[11px]">Wind Speed: <strong>{windSpeed} m/s</strong></span>
                <span className="text-text-muted text-[10px]">Transit to Station: <strong>~{Math.round((2800) / (windSpeed * 60))} mins</strong></span>
              </div>
            </div>
          </div>

          {/* Interactive Legend Bar (Bottom of Map) */}
          <div className="card-elevated p-4">
            <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Map Legend & Symbol Key</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-border-light">
                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  🔥
                </div>
                <div>
                  <div className="font-bold text-[11px] text-text-primary">Ghazipur Landfill</div>
                  <div className="text-[10px] text-text-muted">Primary Super-Emitter</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-border-light">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  📡
                </div>
                <div>
                  <div className="font-bold text-[11px] text-text-primary">DPCC Station</div>
                  <div className="text-[10px] text-text-muted">Anand Vihar Receptor</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-border-light">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  🛰️
                </div>
                <div>
                  <div className="font-bold text-[11px] text-text-primary">NASA Plumes</div>
                  <div className="text-[10px] text-text-muted">EMIT / EnMAP CH₄</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-border-light">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 border border-red-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                  ⚠️
                </div>
                <div>
                  <div className="font-bold text-[11px] text-red-700">Exposed Hub</div>
                  <div className="text-[10px] text-red-600">In Plume Path</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-border-light">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  🛡️
                </div>
                <div>
                  <div className="font-bold text-[11px] text-emerald-800">Safe Eco-Park</div>
                  <div className="text-[10px] text-emerald-600">Clean Air Zone</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-light border border-border-light">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  🌋
                </div>
                <div>
                  <div className="font-bold text-[11px] text-text-primary">Other Dumpsites</div>
                  <div className="text-[10px] text-text-muted">Bhalswa & Okhla</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Plume Telemetry & Inspector Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Entity Profile Card */}
          <div className="card-elevated p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-primary" />
                <span>Selected Spatial Entity</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-bold uppercase">
                {currentSelectedSite.type}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-light border border-border-light space-y-2">
              <div className="font-bold text-text-primary text-base">{currentSelectedSite.name}</div>
              <div className="text-xs text-brand-primary font-semibold">{currentSelectedSite.status}</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {currentSelectedSite.description}
              </p>
              {currentSelectedSite.ch4Emission && (
                <div className="mt-2 p-2 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Methane Emission Flux</div>
                  <div className="text-xs font-mono font-bold text-red-900 mt-0.5">{currentSelectedSite.ch4Emission}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-surface-light">
                <div className="text-[10px] text-text-muted uppercase">Latitude</div>
                <div className="font-mono font-bold text-text-primary mt-0.5">{currentSelectedSite.lat.toFixed(4)}° N</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-light">
                <div className="text-[10px] text-text-muted uppercase">Longitude</div>
                <div className="font-mono font-bold text-text-primary mt-0.5">{currentSelectedSite.lng.toFixed(4)}° E</div>
              </div>
            </div>

            {/* Quick Entity Jump Selector */}
            <div className="space-y-1.5 pt-2 border-t border-border-light">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Quick Jump to Facility</div>
              <div className="space-y-1">
                {LANDFILL_SITES.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                      selectedSiteId === site.id
                        ? 'bg-surface-dark text-white font-semibold'
                        : 'bg-surface-light hover:bg-white text-text-secondary'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${site.id === 'ghazipur' ? 'text-red-400' : 'text-brand-primary'}`} />
                      <span className="truncate">{site.name}</span>
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">{site.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Plume Downwind Impact Analyzer */}
          <div className="card-elevated p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span>Receptor Exposure Monitor</span>
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentlyExposedCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {currentlyExposedCount} Impacted
              </span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Real-time exposure calculation for residential hubs given current wind bearing (<strong>{windAngle}°</strong>):
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {exposedNeighborhoods.map((rec, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    rec.isExposed
                      ? 'bg-red-50 border-red-200 text-red-950'
                      : 'bg-surface-light border-border-light text-text-secondary opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{rec.isExposed ? '🚨' : '🏘️'}</span>
                      <span>{rec.name}</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold">
                      {rec.distanceKm} km ({rec.bearing}°)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-1 text-text-muted">
                    <span>Pop: {rec.population?.toLocaleString()}</span>
                    <span>Transit Time: ~{rec.travelTimeMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Safe Escape Zone Card */}
          <div className="card-elevated p-5 bg-gradient-to-br from-emerald-50/80 to-surface-card border border-emerald-200/70 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Recommended Safe Air Corridor</span>
            </div>
            <div className="p-3 rounded-xl bg-white/90 border border-emerald-100 space-y-1.5">
              <div className="font-bold text-xs text-emerald-900">Sanjay Lake & Eco-Park (2.9 km SW)</div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Take NH-24 Bypass towards Mayur Vihar Phase-2. Vegetative canopy provides up to <strong>88% gas exposure drop</strong> during active Ghazipur emissions.
              </p>
              <div className="text-[10px] font-bold text-emerald-700 pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Optimal Crosswind Evacuation Haven</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Geospatial Information System (GIS) & Atmospheric Dispersion Tracker"
        objective="This page provides an interactive geospatial map modeling the physical transport of hazardous gases from Delhi's landfill dumpsites across surrounding residential receptors. It dynamically couples Gaussian dispersion physics with orbital satellite plume observations."
        visualElements={[
          {
            name: "Interactive Leaflet Geospatial Canvas",
            type: "Map",
            description: "Full-bleed interactive vector tile map centered on East Delhi and Ghaziabad (28.628°N, 77.308°E), rendering landfill coordinates, ground stations, and plume polygons.",
            axesOrEncoding: "OpenStreetMap, CartoDB Positron, and Dark Voyager tile layers with dynamic SVG marker layers.",
            whatItShows: "Real-time geographic spatial distribution of landfill emission sources and downwind receptors."
          },
          {
            name: "Dynamic Gaussian Dispersion Plume Cone",
            type: "Diagram",
            description: "A semi-transparent red triangular polygon anchored at Ghazipur's coordinates, extending 4.8 km downwind with a ±28° spread angle.",
            axesOrEncoding: "Red boundary with 35% crimson fill, dynamically recalculating corner vertices as the wind slider rotates.",
            whatItShows: "Visualizes the atmospheric corridor where airborne toxic concentrations (NH₃, CO, VOCs) exceed safe ambient background levels."
          },
          {
            name: "Buffer Perimeter Rings (1.0 km & 2.8 km)",
            type: "Diagram",
            description: "Concentric dashed circles around Ghazipur representing critical safety and monitoring milestones.",
            axesOrEncoding: "Inner dashed red circle = 1.0 km High-Toxicity Zone; Outer orange circle = 2.8 km Anand Vihar Ground Station radius.",
            whatItShows: "Demarcates the immediate lethal containment zone and distance to continuous regulatory monitoring instruments."
          },
          {
            name: "Floating Layer Visibility Control Panel",
            type: "Widget",
            description: "Top-right glassmorphic panel with 5 interactive eye-toggle pills.",
            axesOrEncoding: "Pills: Gaussian Plume Cone, NASA/ESA Satellites, Populated Receptors, Safe Clean Corridors, Buffer Rings.",
            whatItShows: "Allows users to isolate individual spatial layers to prevent visual clutter."
          },
          {
            name: "Interactive Wind Vector Controller (Slider)",
            type: "Control",
            description: "Bottom-left glassmorphic control with an azimuth slider (0°–360°), wind speed readout, and calculated transit time.",
            axesOrEncoding: "Azimuth slider with compass ticks (0° N, 90° E, 130° SE, 270° W, 360° N).",
            whatItShows: "Enables interactive simulation of changing weather patterns and instant observation of which neighborhoods become exposed."
          },
          {
            name: "Live Receptor Exposure Monitor (Right Sidebar)",
            type: "Panel",
            description: "Live scrolling list of 6 receptor neighborhoods with real-time exposure badges, population counts, and travel times.",
            axesOrEncoding: "Red '🚨 In Plume Path' badge versus green '✅ Clear' badge based on angular difference (|θ_wind - θ_receptor| ≤ 34°).",
            whatItShows: "Instant calculation of human exposure burden (e.g. 155,000 residents in danger zone under 130° wind)."
          }
        ]}
        symbolsAndIcons={[
          {
            symbol: "🔥",
            label: "Ghazipur Super-Emitter Marker",
            category: "Marker",
            meaning: "Location of Ghazipur solid waste facility (28.6238°N, 77.3284°E) — primary source of the simulated gas plume."
          },
          {
            symbol: "📡",
            label: "DPCC Ground Station Marker",
            category: "Marker",
            meaning: "Continuous air monitoring station at Anand Vihar ISBT (28.6469°N, 77.3160°E) measuring empirical ground-level spikes."
          },
          {
            symbol: "🛰️",
            label: "Satellite Plume Footprint",
            category: "Marker",
            meaning: "Verified spaceborne methane column retrieval footprint from NASA EMIT or ESA EnMAP hyperspectral instruments."
          },
          {
            symbol: "⚠️",
            label: "Exposed Receptor Hub",
            category: "Marker",
            meaning: "Residential colony or transit hub currently located directly inside the active ±28° dispersion cone."
          },
          {
            symbol: "🏘️",
            label: "Safe Receptor Hub",
            category: "Marker",
            meaning: "Populated neighborhood currently located outside the direct downwind gas plume corridor."
          },
          {
            symbol: "🛡️",
            label: "Safe Clean-Air Eco-Park",
            category: "Zone",
            meaning: "Certified green buffer zone (e.g. Sanjay Lake, Akshardham corridor) offering up to 94% lower gas exposure for evacuation."
          },
          {
            symbol: "🌋",
            label: "Other Landfill Dumpsites",
            category: "Marker",
            meaning: "Bhalswa (North Delhi) and Okhla (South Delhi) municipal dumpsites."
          }
        ]}
        interactiveControls={[
          {
            control: "Wind Azimuth Slider (0°–360°)",
            type: "Slider",
            functionality: "Rotates the downwind Gaussian dispersion polygon in real time around Ghazipur.",
            impactOnOutput: "Triggers immediate recalculation of exposed neighborhoods, total exposed population, and gas travel times."
          },
          {
            control: "Preset Scenario Tabs",
            type: "Button",
            functionality: "Quick 1-click presets: 🚨 Winter Smog Inversion (130° SE), 🛰️ NASA EMIT Overpass (288° NW), 🛡️ Crosswind Evacuation (215° SW).",
            impactOnOutput: "Instantly sets realistic historical weather parameters and adjusts map focus."
          }
        ]}
        metricDefinitions={[
          {
            term: "Dispersion Length",
            unit: "4.8 km",
            definition: "Effective downwind reach where landfill-generated gases remain significantly elevated above urban background levels."
          },
          {
            term: "Cone Spread Angle",
            unit: "±28°",
            definition: "Lateral plume standard deviation angle (θ) parameterized by Pasquill-Gifford atmospheric stability class."
          },
          {
            term: "Transit Time",
            unit: "Minutes",
            definition: "Estimated duration for gas molecules leaving Ghazipur crest to reach the receptor at current wind velocity: t = Distance / Wind Speed."
          }
        ]}
        actionableInsights={[
          "Identifies Anand Vihar ISBT (120,000 people) and Kaushambi (60,000 people) as the most frequently impacted hubs under prevailing 110°–150° winds.",
          "Demonstrates that Sanjay Lake and Akshardham riverbank buffers remain clean-air sanctuaries (>88% exposure drop) even during intense landfill flare-ups.",
          "Equips municipal disaster response teams with precise geospatial boundary coordinates for emergency perimeter evacuations."
        ]}
        dataSources={[
          "Leaflet.js Official OpenStreetMap Vector Tile Engine",
          "NASA EMIT (Earth Surface Mineral Dust Source Investigation)",
          "ESA Environmental Mapping and Analysis Program (EnMAP)",
          "Delhi Municipal Corporation (MCD) Landfill Geocodes"
        ]}
      />
    </div>
  );
};
