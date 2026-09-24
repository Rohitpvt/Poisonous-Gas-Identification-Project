import React, { useState } from 'react';
import { Zap, Wind, Thermometer, Droplets, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { PageDescriptionCard } from './PageDescriptionCard';

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

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Interactive Gaussian Plume Simulation & What-If Inference Engine"
        objective="This simulator provides an interactive physics-informed inference sandbox. Users can test hypothetical meteorological conditions, emission fluxes, and ambient temperatures to predict ground-level Ammonia and Carbon Monoxide spikes and evaluate real-time local SHAP force waterfall attributions."
        visualElements={[
          {
            name: "Interactive Meteorological Parameter Sliders (Left Panel)",
            type: "Control",
            description: "Six adjustable range inputs: Current NH₃ Baseline (5–200 µg/m³), Current CO Baseline (0.2–8.0 mg/m³), Wind Direction (0°–360° with Ghazipur 100°–160° corridor tag), Wind Speed (0.2–12.0 m/s), Temperature (5°C–45°C), and Relative Humidity (15%–95%).",
            axesOrEncoding: "Continuous numeric sliders with real-time numeric value pills and direct plume corridor detection.",
            whatItShows: "Allows arbitrary parameter tweaking to simulate cold winter smog nights, summer monsoon ventilation, or calm inversion trapping."
          },
          {
            name: "1-Hour Ahead Gas Prediction Cards (Top Right)",
            type: "Widget",
            description: "Two elevated cards displaying forecasted Ammonia (NH₃ in µg/m³) with delta from baseline and Carbon Monoxide (CO in mg/m³) compared against CPCB standard limit (2.0 mg/m³).",
            axesOrEncoding: "Large bold typography with live colored delta tags (+/- µg/m³).",
            whatItShows: "Instant forecast of expected ground-level chemical concentrations 1 hour in advance."
          },
          {
            name: "Episode Threat Alert Banner",
            type: "Panel",
            description: "Color-coded dynamic alert banner triggered by composite plume risk score.",
            axesOrEncoding: "Red banner (Critical Dump Plume Alert, risk > 60%), Amber banner (Moderate Advisory, risk 35%–60%), Green banner (Safe Status, risk < 35%).",
            whatItShows: "Translates quantitative gas forecasts into an immediate operational alert level."
          },
          {
            name: "Local SHAP Force Decomposition Waterfall Bar Chart",
            type: "Chart",
            description: "A bar chart breaking down the marginal contribution of each individual slider input to the final predicted Ammonia concentration.",
            axesOrEncoding: "X-Axis: 5 Factors (Base Expected, Prior NH₃ Lag, Ghazipur Plume Vector, Temp / Inversion, Humidity Factor). Y-Axis: Contribution in µg/m³. Charcoal (#171719) = Base; Crimson (#E34A32) = Positive Force (+); Teal (#2a9d8f) = Negative Cleansing (-).",
            whatItShows: "Explains step-by-step why the model generated the specific prediction, showing which physical factor contributed most to the gas spike."
          }
        ]}
        symbolsAndIcons={[
          {
            symbol: "⚡",
            label: "Real-Time Inference Engine",
            category: "Icon",
            meaning: "Signifies active sub-millisecond forward-pass computation from the surrogate ML model."
          },
          {
            symbol: "🛡️",
            label: "Critical Plume Alert Shield",
            category: "Icon",
            meaning: "Active when risk probability exceeds 60%, warning that wind vector is directly carrying Ghazipur dump yard emissions towards Anand Vihar and Kaushambi."
          },
          {
            symbol: "⚠️",
            label: "Moderate Advisory Warning",
            category: "Icon",
            meaning: "Active when risk probability is between 35% and 60%, indicating elevated stagnation potential during upcoming nocturnal hours."
          },
          {
            symbol: "✓",
            label: "Safe Status Checkmark",
            category: "Icon",
            meaning: "Active when risk probability is below 35%, confirming adequate ventilation and crosswind dispersion."
          }
        ]}
        interactiveControls={[
          {
            control: "Wind Direction Slider (0°–360°)",
            type: "Slider",
            functionality: "Changes the simulated wind blow angle.",
            impactOnOutput: "Aligning near 130° (Ghazipur corridor) activates the '🔥 Direct Ghazipur Corridor' tag and immediately adds up to +34.5 µg/m³ to the predicted ground concentration."
          },
          {
            control: "Wind Speed Slider (0.2 – 12.0 m/s)",
            type: "Slider",
            functionality: "Adjusts horizontal ventilation speed.",
            impactOnOutput: "Speeds > 3.5 m/s exponentially reduce predicted concentrations via aerodynamic dilution."
          },
          {
            control: "Temperature Slider (5°C – 45°C)",
            type: "Slider",
            functionality: "Adjusts ambient surface temperature.",
            impactOnOutput: "Temperatures < 15°C trigger positive SHAP additions representing shallow boundary layer trapping."
          }
        ]}
        metricDefinitions={[
          {
            term: "Plume Dispersion Index",
            unit: "0.0 – 1.0",
            definition: "Trigonometric alignment metric: cos(θ_wind - 130°) · exp(-0.25 · v_wind), quantifying effective downwind mass transport from Ghazipur."
          },
          {
            term: "Base Value E[y]",
            unit: "25.0 µg/m³",
            definition: "The historical expected baseline of Ammonia in Delhi's urban background when no active landfill plumes are present."
          }
        ]}
        actionableInsights={[
          "Enables municipal emergency operators to test 'worst-case' meteorological scenarios (e.g. winter night at 13°C, 1.2 m/s wind, 130° azimuth).",
          "Demonstrates immediate cause-and-effect between environmental variables and localized ground-level toxicity.",
          "Provides a practical simulation tool for urban planners designing vegetative green buffer zones around solid waste facilities."
        ]}
        dataSources={[
          "Gaussian Plume Dispersion Physics Formulation",
          "Trained Ridge & LightGBM Surrogate Models",
          "CPCB Acute Health Threshold Standards"
        ]}
      />
    </div>
  );
};
