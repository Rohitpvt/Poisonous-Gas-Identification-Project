import React, { useState } from 'react';
import { Zap, Wind, Thermometer, Droplets, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';

export const PlumeSimulator: React.FC = () => {
  const [currentNh3, setCurrentNh3] = useState<number>(45.0);
  const [currentCo, setCurrentCo] = useState<number>(1.5);
  const [temperature, setTemperature] = useState<number>(25.0);
  const [windSpeed, setWindSpeed] = useState<number>(1.8);
  const [windDirection, setWindDirection] = useState<number>(130);
  const [humidity, setHumidity] = useState<number>(65.0);

  // Compute Plume Geometric Alignment Index
  const GHAZIPUR_AZIMUTH = 130.0;
  const angleDiff = Math.abs(windDirection - GHAZIPUR_AZIMUTH);
  const minAngleDiff = Math.min(angleDiff, 360.0 - angleDiff);
  const alignment = Math.max(0, Math.cos((minAngleDiff * Math.PI) / 180));
  const dispersionIndex = alignment * Math.exp(-0.25 * windSpeed);

  // Local SHAP Waterfall Contributions
  const baseValue = 25.0;
  const contribLag = (currentNh3 - 25.0) * 0.72;
  const contribPlume = dispersionIndex * 34.5;
  const contribTemp = Math.max(-10.0, (25.0 - temperature) * 0.6);
  const contribHumidity = (humidity - 50.0) * 0.08;

  const predictedNh3 = Math.max(5.0, baseValue + contribLag + contribPlume + contribTemp + contribHumidity);
  const predictedCo = Math.max(0.2, currentCo * 0.82 + dispersionIndex * 0.9);
  const riskProb = Math.min(0.99, Math.max(0.01, (predictedNh3 / 80.0) * 0.6 + dispersionIndex * 0.4));

  const isDownwindCorridor = windDirection >= 100 && windDirection <= 160;

  // Local Waterfall Data
  const waterfallData = [
    { name: 'Base Expected', value: baseValue, type: 'base' },
    { name: 'Prior NH₃ Lag', value: Number(contribLag.toFixed(1)), type: contribLag >= 0 ? 'pos' : 'neg' },
    { name: 'Ghazipur Plume Vector', value: Number(contribPlume.toFixed(1)), type: 'pos' },
    { name: 'Temp / Inversion', value: Number(contribTemp.toFixed(1)), type: contribTemp >= 0 ? 'pos' : 'neg' },
    { name: 'Humidity Factor', value: Number(contribHumidity.toFixed(1)), type: contribHumidity >= 0 ? 'pos' : 'neg' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Real-Time Atmospheric Inference Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
          Live Landfill Gas Dispersion <span className="font-serif-italic font-normal text-brand-primary">Simulator</span>
        </h2>
        <p className="text-text-secondary text-sm mt-1 max-w-2xl">
          Adjust environmental parameters and current baseline concentrations to generate real-time 1-hour ahead forecasts and local SHAP factor decompositions.
        </p>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Control Panel */}
        <div className="card-elevated p-8 space-y-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <span>Environmental Parameters</span>
          </h3>

          <div className="space-y-4">
            {/* NH3 Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-1">
                <span>Current NH₃ Baseline:</span>
                <span className="font-mono font-bold text-brand-primary">{currentNh3} µg/m³</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                value={currentNh3}
                onChange={(e) => setCurrentNh3(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* CO Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-1">
                <span>Current CO Baseline:</span>
                <span className="font-mono font-bold text-text-primary">{currentCo.toFixed(1)} mg/m³</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.1"
                value={currentCo}
                onChange={(e) => setCurrentCo(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Wind Direction */}
            <div>
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-1">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5" /> Wind Direction:
                </span>
                <span className="font-mono font-bold text-text-primary">
                  {windDirection}° {isDownwindCorridor ? '(🔥 Direct Ghazipur Corridor)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={windDirection}
                onChange={(e) => setWindDirection(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Wind Speed */}
            <div>
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-1">
                <span>Wind Speed:</span>
                <span className="font-mono font-bold text-text-primary">{windSpeed.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="12.0"
                step="0.2"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-1">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" /> Temperature:
                </span>
                <span className="font-mono font-bold text-text-primary">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {/* Humidity */}
            <div>
              <div className="flex justify-between text-xs font-medium text-text-secondary mb-1">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> Relative Humidity:
                </span>
                <span className="font-mono font-bold text-text-primary">{humidity}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Prediction Results & SHAP Waterfall */}
        <div className="space-y-6 lg:col-span-2">
          {/* Top Prediction Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-elevated p-6 space-y-2">
              <div className="text-xs text-text-muted">1-Hour Forecast: Ammonia (NH₃)</div>
              <div className="text-3xl font-bold text-brand-primary">{predictedNh3.toFixed(2)} µg/m³</div>
              <div className="text-xs text-text-secondary flex items-center gap-1">
                <span>Delta from baseline:</span>
                <span className={`font-semibold ${predictedNh3 - currentNh3 >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {predictedNh3 - currentNh3 >= 0 ? '+' : ''}{(predictedNh3 - currentNh3).toFixed(2)} µg/m³
                </span>
              </div>
            </div>

            <div className="card-elevated p-6 space-y-2">
              <div className="text-xs text-text-muted">1-Hour Forecast: Carbon Monoxide (CO)</div>
              <div className="text-3xl font-bold text-text-primary">{predictedCo.toFixed(2)} mg/m³</div>
              <div className="text-xs text-text-secondary">
                CPCB Standard Limit: <strong>2.0 mg/m³</strong>
              </div>
            </div>
          </div>

          {/* Episode Threat Alert Banner */}
          <div className={`p-6 rounded-[22px] flex items-start gap-4 ${
            riskProb > 0.6
              ? 'bg-red-50 border border-red-200 text-red-900'
              : riskProb > 0.35
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          }`}>
            <div className="p-2 rounded-xl bg-white shadow-sm flex-shrink-0">
              {riskProb > 0.6 ? (
                <ShieldAlert className="w-6 h-6 text-red-600" />
              ) : riskProb > 0.35 ? (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              )}
            </div>
            <div>
              <div className="font-bold text-sm">
                {riskProb > 0.6
                  ? 'CRITICAL DUMP PLUME ALERT: HIGH ACCUMULATION RISK'
                  : riskProb > 0.35
                  ? 'MODERATE ADVISORY: ELEVATED LANDFILL GAS DISPERSION'
                  : 'SAFE STATUS: ADEQUATE ATMOSPHERIC VENTILATION'}
              </div>
              <div className="text-xs mt-1 leading-relaxed opacity-90">
                {riskProb > 0.6
                  ? `Plume risk score is ${(riskProb * 100).toFixed(1)}%. Wind vector is directly carrying Ghazipur dump yard emissions towards Anand Vihar and Kaushambi.`
                  : riskProb > 0.35
                  ? `Plume risk score is ${(riskProb * 100).toFixed(1)}%. Stagnation likely during upcoming night hours.`
                  : `Plume risk score is ${(riskProb * 100).toFixed(1)}%. Favorable wind trajectory and ventilation keep ground concentrations within acceptable bounds.`}
              </div>
            </div>
          </div>

          {/* Local SHAP Force Waterfall Breakdown */}
          <div className="card-elevated p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-text-primary">Local SHAP Force Decomposition</h4>
              <span className="text-xs text-text-muted">Feature contributions to this specific prediction</span>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171719',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                  />
                  <ReferenceLine y={0} stroke="#232427" />
                  <Bar dataKey="value" name="Contribution (µg/m³)" radius={[6, 6, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'base' ? '#171719' : entry.value >= 0 ? '#E34A32' : '#2a9d8f'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
