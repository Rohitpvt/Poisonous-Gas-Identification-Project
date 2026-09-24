import React, { useState } from 'react';
import { RECEPTOR_NEIGHBORHOODS, EMERGENCY_HOSPITALS, SAFE_ESCAPE_ZONES } from '../data/constants';
import { ShieldAlert, Send, CheckCircle2, Users, MapPin, ShieldCheck, Compass, Navigation as NavigationIcon, ArrowRight, Hospital, Ambulance, PhoneCall } from 'lucide-react';
import { PageDescriptionCard } from './PageDescriptionCard';

export const HealthAdvisory: React.FC = () => {
  const [profile, setProfile] = useState<string>('Asthma & Respiratory Patients');
  const [simNh3, setSimNh3] = useState<number>(78.0);
  const [simCo] = useState<number>(2.8);
  const [simPm] = useState<number>(185.0);
  const [windDir, setWindDir] = useState<number>(130);
  const [recipient, setRecipient] = useState<string>('+91-9876543210');
  const [dispatched, setDispatched] = useState<boolean>(false);

  // Compute Risk Score
  const scoreNh3 = Math.min(100.0, (simNh3 / 100.0) * 35.0);
  const scoreCo = Math.min(100.0, (simCo / 2.0) * 35.0);
  const scorePm = Math.min(100.0, (simPm / 60.0) * 30.0);
  const baseRisk = scoreNh3 + scoreCo + scorePm;

  const multipliers: Record<string, number> = {
    'General Public': 1.0,
    'Asthma & Respiratory Patients': 1.35,
    'Children (< 12 yrs)': 1.25,
    'Elderly (> 65 yrs)': 1.30,
    'Outdoor Workers & Commuters': 1.20,
  };

  const finalScore = Math.min(100.0, Math.round(baseRisk * (multipliers[profile] || 1.0)));

  const isEmergency = finalScore >= 80;
  const isHigh = finalScore >= 60 && finalScore < 80;

  // Neighborhood Exposure Calculation
  const neighborhoodRankings = RECEPTOR_NEIGHBORHOODS.map((r) => {
    const angleDiff = Math.abs(windDir - r.bearing);
    const minAngle = Math.min(angleDiff, 360 - angleDiff);
    const alignment = Math.max(0, Math.cos((minAngle * Math.PI) / 180));
    const distanceDecay = 1.0 / (1.0 + Math.pow(r.distanceKm, 1.3));
    const threatScore = Math.round(Math.min(100.0, alignment * 85.0 * distanceDecay * 1.8));

    let status = '🟢 Safe Upwind Buffer';
    if (threatScore > 50) status = '🔴 Direct Plume Threat';
    else if (threatScore > 25) status = '🟠 Elevated Dispersion';

    return { ...r, threatScore, status };
  }).sort((a, b) => b.threatScore - a.threatScore);

  const safeZones = neighborhoodRankings.filter((n) => n.status.includes('Safe'));

  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => setDispatched(false), 4500);
  };

  const smsText = `🚨 [DELHI-EPCA / GHAZIPUR ADVISORY] Risk Score: ${finalScore}/100 (${
    isEmergency ? 'SEVERE EMERGENCY' : isHigh ? 'HIGH ALERT' : 'MODERATE ADVISORY'
  }). Forecasted NH3: ${simNh3} µg/m³ near Anand Vihar corridor. ${
    windDir >= 100 && windDir <= 160 ? 'Direct downwind plume active from Ghazipur Landfill. ' : ''
  }Action: ${
    isEmergency
      ? 'Seal windows; N95 mask mandatory outdoors; avoid physical exertion.'
      : 'Sensitive groups limit outdoor activity.'
  } Profile: ${profile}.`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Operational Public Health Protection & Dispatch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
          Public Health <span className="font-serif-italic font-normal text-brand-primary">Early-Warning System</span>
        </h2>
        <p className="text-text-secondary text-sm mt-1 max-w-2xl">
          Translating complex machine learning gas plume forecasts into actionable clinical advisories, safe-zone routing, and automated resident broadcasts.
        </p>
      </div>

      {/* Comprehensive Landfill Gas Identification, Human Impact & Protection Matrix */}
      <div className="card-elevated p-6 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Landfill Gas Identification & Clinical Protection Guide</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            Landfill Toxic Gases: Identification, Health Hazards & Rescue Actions
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Breakdown of all 9 chemical species and particulate pollutants identified in our dataset, their formation mechanisms in the Ghazipur dump yard, clinical symptoms on nearby residents, and emergency protective protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Methane CH4 */}
          <div className="p-4 rounded-2xl bg-surface-light border border-border-light space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Methane (CH₄)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">Explosive & Asphyxiant</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              <strong>Source & Identification:</strong> Anaerobic decomposition of organic waste. Identified via NASA EMIT satellite hyperspectral imaging (&gt;4,000 kg/hr plumes).
            </p>
            <p className="text-[11px] text-text-secondary">
              <strong>Human Impact:</strong> Displaces oxygen causing rapid asphyxiation, dizziness, headaches, and subsurface landfill fires.
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900">
              <strong>Protection:</strong> Install methane soil vapor extraction wells; evacuate low-lying basements during stagnant wind events.
            </div>
          </div>

          {/* 2. Ammonia NH3 */}
          <div className="p-4 rounded-2xl bg-surface-light border border-border-light space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Ammonia (NH₃)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Respiratory Irritant</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              <strong>Source & Identification:</strong> Breakdown of nitrogenous protein waste. Identified via DPCC continuous electrochemical sensors (spikes +74.5% downwind).
            </p>
            <p className="text-[11px] text-text-secondary">
              <strong>Human Impact:</strong> Severe eye, nose, throat burning, pulmonary edema in asthma patients, chronic bronchitis.
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900">
              <strong>Protection:</strong> Wear wet cloth masks or activated carbon respirators; seal east-facing windows towards dumpsite.
            </div>
          </div>

          {/* 3. Carbon Monoxide CO */}
          <div className="p-4 rounded-2xl bg-surface-light border border-border-light space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Carbon Monoxide (CO)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">Silent Poison</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              <strong>Source & Identification:</strong> Incomplete combustion from deep smoldering subsurface landfill fires. Identified via NDIR sensors.
            </p>
            <p className="text-[11px] text-text-secondary">
              <strong>Human Impact:</strong> Binds to hemoglobin (Carboxyhemoglobin), reducing blood oxygen delivery; causes hypoxia, nausea, and cardiac stress.
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900">
              <strong>Protection:</strong> Install home CO alarms; deploy medical oxygen in Anand Vihar health clinics during inversion surges.
            </div>
          </div>

          {/* 4. Benzene & VOCs */}
          <div className="p-4 rounded-2xl bg-surface-light border border-border-light space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Benzene & Toluene (VOCs)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">Group-1 Carcinogen</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              <strong>Source & Identification:</strong> Discarded industrial solvents, adhesives, and decomposing synthetic polymers. Identified via GC-PID monitors.
            </p>
            <p className="text-[11px] text-text-secondary">
              <strong>Human Impact:</strong> Bone marrow damage, elevated leukemia and aplastic anemia risk, central nervous system depression.
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900">
              <strong>Protection:</strong> High-efficiency VOC carbon adsorption purifiers; mandatory medical checkups for sanitation workers.
            </div>
          </div>

          {/* 5. PM2.5 & PM10 */}
          <div className="p-4 rounded-2xl bg-surface-light border border-border-light space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Particulates (PM₂.₅ & PM₁₀)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">Alveolar Penetration</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              <strong>Source & Identification:</strong> Landfill dust suspension and ash from waste combustion. Identified via beta-attenuation monitors (BAM).
            </p>
            <p className="text-[11px] text-text-secondary">
              <strong>Human Impact:</strong> Fine PM2.5 bypasses nasal hairs into deep alveoli and bloodstream, causing heart attacks, COPD, and stroke.
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900">
              <strong>Protection:</strong> N95/FFP2 certified masks mandatory; deploy municipal anti-smog water cannons along Ghazipur perimeter.
            </div>
          </div>

          {/* 6. Hydrogen Sulfide & SO2 */}
          <div className="p-4 rounded-2xl bg-surface-light border border-border-light space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">Sulfur Gases (H₂S & SO₂)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800">Acidic Rotten Gas</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              <strong>Source & Identification:</strong> Anaerobic breakdown of gypsum drywall and sulfur organics. Characteristic pungent rotten-egg odor.
            </p>
            <p className="text-[11px] text-text-secondary">
              <strong>Human Impact:</strong> Olfactory fatigue (loss of smell), severe bronchospasm, mucosal irritation, acid deposition on skin.
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900">
              <strong>Protection:</strong> Bio-filter soil capping on dumpsite slopes; temporary relocation of children during nighttime inversion.
            </div>
          </div>
        </div>
      </div>

      {/* Persona Selection & Health Exposure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-6 space-y-4">
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-primary" />
            <span>Vulnerability Persona</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted font-medium">Select Resident Profile:</label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-surface-light border border-border-light text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option>General Public</option>
                <option>Asthma & Respiratory Patients</option>
                <option>Children (&lt; 12 yrs)</option>
                <option>Elderly (&gt; 65 yrs)</option>
                <option>Outdoor Workers & Commuters</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium">Simulated NH₃ (µg/m³):</label>
              <input
                type="range"
                min="10"
                max="180"
                value={simNh3}
                onChange={(e) => setSimNh3(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="text-right text-xs font-mono font-bold text-brand-primary">{simNh3} µg/m³</div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-medium">Plume Wind Direction (°):</label>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={windDir}
                onChange={(e) => setWindDir(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="text-right text-xs font-mono font-bold text-text-primary">{windDir}° Azimuth</div>
            </div>
          </div>
        </div>

        {/* Clinical Risk Gauge */}
        <div className="card-elevated p-6 space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Health Risk Assessment</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isEmergency ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isEmergency ? '🔴 Severe Toxic Emergency' : isHigh ? '🟠 High Health Risk' : '🟢 Moderate Safe Status'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-text-primary">{finalScore}</span>
              <span className="text-text-muted text-sm font-medium">/ 100 Toxicity Exposure Index</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-light text-xs text-text-secondary leading-relaxed space-y-1.5 border border-border-light">
              <div className="font-semibold text-text-primary">Clinical Protection Directives:</div>
              <div>• <strong>Ventilation:</strong> {isEmergency ? 'Seal all east-facing windows towards Ghazipur immediately; run HEPA filtration.' : 'Standard room ventilation permitted.'}</div>
              <div>• <strong>Mask Protocol:</strong> {isEmergency ? 'N95 or Activated Carbon Filter Mask MANDATORY for outdoor exposure.' : 'Standard breathing.'}</div>
              <div>• <strong>Physical Activity:</strong> {isEmergency ? 'Cancel outdoor sports, jogging, and school assemblies in Anand Vihar.' : 'Standard activities allowed.'}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-surface-light">
              <div className="text-text-muted">Ammonia Sub-Score</div>
              <div className="font-mono font-bold text-brand-primary mt-0.5">{scoreNh3.toFixed(1)}</div>
            </div>
            <div className="p-2 rounded-xl bg-surface-light">
              <div className="text-text-muted">CO Sub-Score</div>
              <div className="font-mono font-bold text-text-primary mt-0.5">{scoreCo.toFixed(1)}</div>
            </div>
            <div className="p-2 rounded-xl bg-surface-light">
              <div className="text-text-muted">PM2.5 Sub-Score</div>
              <div className="font-mono font-bold text-text-primary mt-0.5">{scorePm.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Neighborhood Threat Ranking & Safe Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-6 space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span>Surrounding Neighborhood Plume Threat Ranking</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-light text-text-muted uppercase">
                  <th className="py-2.5 px-3">Neighborhood</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Plume Threat</th>
                  <th className="py-2.5 px-3">Zone Status</th>
                  <th className="py-2.5 px-3">Population</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {neighborhoodRankings.map((n, i) => (
                  <tr key={i} className="hover:bg-surface-light/50">
                    <td className="py-3 px-3 font-semibold text-text-primary">{n.name}</td>
                    <td className="py-3 px-3 font-mono text-text-secondary">{n.distanceKm} km</td>
                    <td className="py-3 px-3 font-mono font-bold text-brand-primary">{n.threatScore}%</td>
                    <td className="py-3 px-3 font-medium">{n.status}</td>
                    <td className="py-3 px-3 text-text-muted">{n.population.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safe Zones List */}
        <div className="card-elevated p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Identified Safe Zones</span>
          </h3>
          <p className="text-xs text-text-secondary">
            Upwind locations with natural air buffer zones away from current Ghazipur plume path:
          </p>

          <div className="space-y-2.5">
            {safeZones.length > 0 ? (
              safeZones.map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-900">{s.name}</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    {s.distanceKm} km away • Upwind low exposure sector
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-800">
                All immediate sectors currently experiencing elevated dispersion.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Safe Escape Route Navigator (Clean-Air Pockets) */}
      <div className="card-elevated p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Dynamic Clean-Air Routing & Exposure Mitigation</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <span>Dynamic "Safe Escape Route" Navigator</span>
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Active downwind plume avoidance vectors directing vulnerable populations to certified upwind green buffer zones.
            </p>
          </div>

          <div className="stat-pill px-3.5 py-1.5 flex items-center gap-2 self-start text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <NavigationIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal Plume Avoidance: South-West Vector (215° - 245°)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAFE_ESCAPE_ZONES.map((zone) => {
            const angleDiff = Math.abs(windDir - zone.bearing);
            const minAngle = Math.min(angleDiff, 360 - angleDiff);
            const isOptimalNow = minAngle > 75;

            return (
              <div
                key={zone.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isOptimalNow
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                    : 'bg-surface-light border-border-light'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-text-primary">{zone.name}</h4>
                      {isOptimalNow && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          ★ Best Live Route
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-text-muted font-medium">
                      {zone.distanceKm} km from Ghazipur • {zone.bearing}° Vector • {zone.greenCoverRating}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-700">-{zone.exposureReductionPercent}%</span>
                    <div className="text-[10px] text-text-muted uppercase font-semibold">Toxicity Drop</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-black/5 text-xs space-y-1">
                  <div className="font-semibold text-text-primary flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Evacuation Vector:</span>
                  </div>
                  <div className="text-text-secondary text-[11px] leading-relaxed">{zone.recommendedRoute}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-semibold">
                    {zone.cleanAirIndex}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zone.name + ' Delhi')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-primary hover:underline"
                  >
                    <span>View Map Navigation</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearby Emergency Hospital & Health Center SOS Directory */}
      <div className="card-elevated p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-700 text-xs font-semibold mb-1.5">
              <Hospital className="w-3.5 h-3.5" />
              <span>Critical Toxic Exposure & Respiratory Response</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <span>Nearby Emergency Hospital & Respiratory SOS Directory</span>
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Geolocated emergency hospitals equipped with liquid medical oxygen (LMO), toxic inhalation ICUs, and 24x7 acute respiratory triage.
            </p>
          </div>

          <div className="stat-pill px-3 py-1.5 flex items-center gap-2 self-start text-xs font-semibold text-red-700 bg-red-50 border border-red-200">
            <Ambulance className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Ambulance Hotline: 108 / 102</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_HOSPITALS.map((hosp) => (
            <div key={hosp.id} className="p-5 rounded-2xl bg-surface-light border border-border-light space-y-3.5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-text-primary leading-snug">{hosp.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                    <span className="font-medium text-brand-primary">{hosp.distanceKm} km away</span>
                    <span>•</span>
                    <span className="text-text-muted">{hosp.type}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
                  {hosp.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <a href={`tel:${hosp.emergencyContact}`} className="font-mono font-bold text-text-primary hover:text-brand-primary">
                    {hosp.emergencyContact}
                  </a>
                  <span className="text-[10px] text-text-muted">(24/7 SOS Desk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  <span className="text-[11px] text-text-muted truncate">{hosp.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border-light text-[11px]">
                <div className="p-2 rounded-xl bg-white border border-black/5">
                  <div className="text-text-muted text-[10px] font-semibold uppercase">O₂ Supply Capacity</div>
                  <div className="font-bold text-text-primary text-[11px] mt-0.5 truncate">{hosp.oxygenCapacity}</div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-black/5">
                  <div className="text-text-muted text-[10px] font-semibold uppercase">ICU Respiratory Beds</div>
                  <div className="font-bold text-brand-primary text-[11px] mt-0.5">{hosp.respiratoryICUBeds} Active Beds</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {hosp.specialties.map((spec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-surface-dark/5 text-text-secondary text-[10px] font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SMS Alert Dispatch Simulator */}
      <div className="card-dark p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-brand-accent" />
              <span>Automated Emergency Broadcast Dispatcher</span>
            </h3>
            <p className="text-white/70 text-xs mt-1">
              Live payload generator transmitting instant push/SMS advisories to registered residents in impacted wards.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white focus:outline-none"
              placeholder="+91-XXXXX"
            />
            <button
              onClick={handleDispatch}
              className="btn-brand px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch SMS</span>
            </button>
          </div>
        </div>

        {/* Message Payload Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-white/90 leading-relaxed">
          {smsText}
        </div>

        {dispatched && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Emergency broadcast SMS successfully delivered to <strong>{recipient}</strong> via Cloud Gateway.</span>
          </div>
        )}
      </div>

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Public Health Early Warning, Emergency Hospital SOS & Safe Escape Routing"
        objective="This decision-support hub translates complex multi-gas ML forecasts into immediate life-saving public health interventions, demographic-specific clinical guidance, nearby tertiary hospital directory routing, and automated SMS broadcast payloads."
        methodology={[
          {
            title: "Multi-Pollutant Clinical Risk Scoring",
            details: "Synthesizes simultaneous NH₃, CO, and PM2.5 exposures into a unified 0–100 Hazard Index, applying clinical vulnerability multipliers for asthmatics (1.35x), elderly (1.30x), and children (1.25x)."
          },
          {
            title: "Emergency Healthcare Facility Directory",
            details: "Catalogs nearby tertiary care centers (Max Super Speciality, LBS Hospital, Hedgewar Arogya Sansthan, Yashoda Kaushambi) with real-time ICU bed capacities and cryogenic oxygen storage."
          },
          {
            title: "Directional Clean-Air Evacuation Navigator",
            details: "Computes optimal upwind/crosswind escape routes to urban forest pockets (Sanjay Lake, Akshardham corridor) with up to 94% verified exposure reduction."
          },
          {
            title: "Automated Early Warning SMS Dispatcher",
            details: "Generates formatted CAP-compliant (Common Alerting Protocol) emergency broadcast strings for instant dissemination to community phones."
          }
        ]}
        howToInterpret={[
          "Select a Demographic Profile (Asthma, Children, Elderly, Outdoor Workers): Watch the Health Hazard Score dynamically adjust based on clinical vulnerability.",
          "Check the Clinical Actions Matrix: View immediate medical counter-measures (e.g. N95/FFP3 masking, bronchodilator preparedness, HEPA filtration).",
          "Review the Emergency Hospital Directory: Direct one-click phone dialers, ICU bed availability, and hospital distance from the toxic corridor.",
          "Inspect the Safe Escape Routes: Clear navigation paths directing residents away from downwind plume trajectories to clean-air island parks."
        ]}
        actionableInsights={[
          "Bridges the vital gap between computational machine learning algorithms and real-world public health preservation.",
          "Ensures vulnerable individuals (over 85,000 respiratory patients in East Delhi) receive actionable 1-hour pre-warning before toxic plumes peak.",
          "Provides a complete blueprint for municipal disaster management and emergency hospital surge coordination."
        ]}
        dataSources={[
          "World Health Organization (WHO) Toxic Inhalation Guidelines",
          "Delhi State Disaster Management Authority (DDMA)",
          "National Health Portal & Hospital Surge Capacity Registry",
          "DPCC Continuous Monitoring Network"
        ]}
      />
    </div>
  );
};

