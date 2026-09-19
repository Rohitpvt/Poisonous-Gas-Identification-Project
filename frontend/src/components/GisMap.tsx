import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { LANDFILL_SITES, RECEPTOR_NEIGHBORHOODS } from '../data/constants';
import { MapPin, Wind, Info, Layers } from 'lucide-react';

// Custom Map Marker Icons using SVGs
const createCustomIcon = (color: string, iconSymbol: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 2px solid white;
      ">
        ${iconSymbol}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const landfillIcon = createCustomIcon('#E34A32', '🔥');
const stationIcon = createCustomIcon('#171719', '📡');
const receptorIcon = createCustomIcon('#457b9d', '🏘️');

export const GisMap: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<string>('ghazipur');
  const [windAngle, setWindAngle] = useState<number>(130);
  const [showCone, setShowCone] = useState<boolean>(true);

  // Compute Plume dispersion cone coordinates from Ghazipur (Lat: 28.6238, Lng: 77.3284)
  const ghazipurLat = 28.6238;
  const ghazipurLng = 77.3284;
  const coneLength = 0.045; // ~4.5 km dispersion length
  const coneSpreadDeg = 28; // Cone spread angle

  const rad = (deg: number) => (deg * Math.PI) / 180;
  
  // Calculate cone end vertices
  const leftAngle = windAngle - coneSpreadDeg;
  const rightAngle = windAngle + coneSpreadDeg;

  // Inverted bearing translation for map coordinates
  const p1 = [ghazipurLat, ghazipurLng];
  const p2 = [
    ghazipurLat + coneLength * Math.cos(rad(leftAngle)),
    ghazipurLng + (coneLength * 1.15) * Math.sin(rad(leftAngle))
  ];
  const p3 = [
    ghazipurLat + coneLength * Math.cos(rad(rightAngle)),
    ghazipurLng + (coneLength * 1.15) * Math.sin(rad(rightAngle))
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>High-Resolution GIS Spatial Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
            Spatial Distribution of Delhi's <span className="font-serif-italic font-normal text-brand-primary">Landfill Plumes</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            Interactive map displaying the 4 major solid waste landfills, DPCC Anand Vihar receptor hub, and Gaussian dispersion plume trajectories.
          </p>
        </div>

        {/* Live Controls */}
        <div className="stat-pill px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
            <Wind className="w-4 h-4 text-brand-primary animate-spin" />
            <span>Wind Blow Angle:</span>
            <span className="font-mono font-bold text-text-primary">{windAngle}°</span>
          </div>
          <button
            onClick={() => setShowCone(!showCone)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              showCone ? 'bg-surface-dark text-white' : 'bg-surface-light text-text-secondary'
            }`}
          >
            {showCone ? 'Plume Cone: On' : 'Plume Cone: Off'}
          </button>
        </div>
      </div>

      {/* Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Card */}
        <div className="lg:col-span-2 card-elevated p-3 relative overflow-hidden h-[540px]">
          <MapContainer
            center={[28.6238, 77.28]}
            zoom={11}
            scrollWheelZoom={false}
            className="w-full h-full rounded-[22px] z-10"
          >
            {/* OpenStreetMap Tile Layer (Free, No API Key) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Landfill Markers */}
            {LANDFILL_SITES.map((site) => (
              <Marker
                key={site.id}
                position={[site.lat, site.lng]}
                icon={site.type === 'station' ? stationIcon : landfillIcon}
                eventHandlers={{
                  click: () => setSelectedSite(site.id),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 text-sm font-sans">
                    <div className="font-bold text-text-primary">{site.name}</div>
                    <div className="text-xs text-brand-primary font-semibold mt-0.5">{site.status}</div>
                    {site.ch4Emission && (
                      <div className="text-xs text-text-secondary mt-1 font-mono">
                        CH₄ Emission: {site.ch4Emission}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Receptor Neighborhood Markers */}
            {RECEPTOR_NEIGHBORHOODS.map((rec, i) => (
              <Marker
                key={i}
                position={[rec.lat, rec.lng]}
                icon={receptorIcon}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <div className="font-bold">{rec.name}</div>
                    <div className="text-text-muted">{rec.type}</div>
                    <div>Distance: {rec.distanceKm} km from Ghazipur</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Ghazipur Buffer Radius */}
            <Circle
              center={[ghazipurLat, ghazipurLng]}
              radius={2800}
              pathOptions={{ color: '#E34A32', fillColor: '#E34A32', fillOpacity: 0.08, weight: 1.5, dashArray: '4, 4' }}
            />

            {/* Dynamic Plume Dispersion Cone */}
            {showCone && (
              <Polygon
                positions={[p1 as any, p2 as any, p3 as any]}
                pathOptions={{
                  color: '#E34A32',
                  fillColor: '#E34A32',
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              />
            )}
          </MapContainer>

          {/* Quick Wind Slider Overlay */}
          <div className="absolute bottom-6 left-6 z-20 floating-nav px-4 py-3 flex items-center gap-3 max-w-xs shadow-lg">
            <Wind className="w-4 h-4 text-brand-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-text-secondary font-medium mb-1">
                <span>Plume Direction</span>
                <span className="font-bold text-brand-primary">{windAngle}° SE Corridor</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={windAngle}
                onChange={(e) => setWindAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Selected Landfill & Receptors Panel */}
        <div className="space-y-4">
          <div className="card-elevated p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-primary" />
              <span>Dumpsite Target Profile</span>
            </h3>

            {(() => {
              const current = LANDFILL_SITES.find((s) => s.id === selectedSite) || LANDFILL_SITES[0];
              return (
                <div className="space-y-3 text-sm">
                  <div className="p-3.5 rounded-2xl bg-surface-light border border-border-light">
                    <div className="font-bold text-text-primary">{current.name}</div>
                    <div className="text-xs text-brand-primary font-semibold mt-0.5">{current.status}</div>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      {current.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-surface-light">
                      <div className="text-text-muted">Latitude</div>
                      <div className="font-mono font-semibold text-text-primary mt-0.5">{current.lat}° N</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-surface-light">
                      <div className="text-text-muted">Longitude</div>
                      <div className="font-mono font-semibold text-text-primary mt-0.5">{current.lng}° E</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick Select Sites */}
          <div className="card-elevated p-6 space-y-3">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Quick Jump Location</div>
            <div className="space-y-2">
              {LANDFILL_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                    selectedSite === site.id
                      ? 'bg-surface-dark text-white'
                      : 'bg-surface-light hover:bg-white text-text-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${site.id === 'ghazipur' ? 'text-brand-primary' : ''}`} />
                    <span>{site.name}</span>
                  </span>
                  <span className="text-[10px] opacity-75">{site.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
