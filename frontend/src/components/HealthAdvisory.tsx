import React, { useState } from 'react';
import { RECEPTOR_NEIGHBORHOODS } from '../data/constants';
import { ShieldAlert, Send, CheckCircle2, Users, MapPin } from 'lucide-react';

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
    </div>
  );
};
