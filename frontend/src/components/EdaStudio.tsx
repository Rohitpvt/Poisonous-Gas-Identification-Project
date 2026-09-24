import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { DIURNAL_TRENDS } from '../data/constants';
import { Clock, TrendingUp, Sparkles, Wind } from 'lucide-react';
import { PageDescriptionCard } from './PageDescriptionCard';

export const EdaStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'diurnal' | 'downwind' | 'correlation'>('diurnal');

  const downwindData = [
    { name: 'Ammonia (NH₃) [µg/m³]', other: 48.2, downwind: 79.6, unit: 'µg/m³', increase: '+65.1%' },
    { name: 'Carbon Monoxide (CO) [mg/m³]', other: 1.85, downwind: 2.94, unit: 'mg/m³', increase: '+58.9%' },
    { name: 'PM2.5 [µg/m³]', other: 154.2, downwind: 228.7, unit: 'µg/m³', increase: '+48.3%' },
    { name: 'Benzene [µg/m³]', other: 3.4, downwind: 5.8, unit: 'µg/m³', increase: '+70.5%' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Sub-Tab Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Statistical Exploration & Spatio-Temporal Signatures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
            Exploratory Data Analysis <span className="font-serif-italic font-normal text-brand-primary">Studio</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            Empirical evidence of Ghazipur dump yard emissions trapping during nocturnal temperature inversions and downwind wind corridors.
          </p>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="stat-pill p-1 flex items-center gap-1 self-start">
          <button
            onClick={() => setActiveSubTab('diurnal')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'diurnal'
                ? 'bg-surface-dark text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Diurnal Inversion Cycles
          </button>
          <button
            onClick={() => setActiveSubTab('downwind')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeSubTab === 'downwind'
                ? 'bg-surface-dark text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Downwind Plume Impact
          </button>
        </div>
      </div>

      {/* Main Analysis Content */}
      {activeSubTab === 'diurnal' && (
        <div className="space-y-6">
          <div className="card-elevated p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-primary" />
                  <span>24-Hour Diurnal Hazardous Gas Cycles at Anand Vihar</span>
                </h3>
                <p className="text-text-muted text-xs mt-0.5">
                  Notice the sharp accumulation peak between 02:00 and 06:00 IST due to boundary layer compression.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-brand-primary font-medium">
                  <span className="w-3 h-3 rounded-full bg-brand-primary"></span> NH₃ (Ammonia)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span> PM2.5
                </span>
              </div>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DIURNAL_TRENDS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNh3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E34A32" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#E34A32" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2a9d8f" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2a9d8f" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171719',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Area type="monotone" dataKey="nh3Mean" stroke="#E34A32" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNh3)" name="NH₃ (µg/m³)" />
                  <Area type="monotone" dataKey="pm25Mean" stroke="#2a9d8f" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPm)" name="PM2.5 (µg/m³)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Findings Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-elevated p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-surface-dark text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary">Atmospheric Stagnation Mechanism</h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                During cold winter nights and early mornings (00:00 to 06:00 IST), surface radiative cooling prevents convective mixing. Ghazipur’s steady anaerobic methane/ammonia plume stays concentrated near the ground level.
              </p>
            </div>
            <div className="card-elevated p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary">Daytime Convective Ventilation</h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                Between 12:00 and 16:00 IST, solar radiation heats the ground surface, expanding the planetary boundary layer past 1,200m and diluting toxic landfill gas concentrations by more than 55%.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'downwind' && (
        <div className="space-y-6">
          <div className="card-elevated p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                <Wind className="w-5 h-5 text-brand-primary" />
                <span>Ghazipur Direct Downwind Corridor (100° – 160° SE) vs. Other Sectors</span>
              </h3>
              <p className="text-text-muted text-xs mt-0.5">
                Comparison of mean ground toxic gas concentrations when wind blows directly from Ghazipur landfill towards the receptor station.
              </p>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={downwindData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171719',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="other" name="Other Wind Sectors" fill="#8a8c91" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="downwind" name="Ghazipur Direct Path (100°-160°)" fill="#E34A32" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {downwindData.map((d, i) => (
              <div key={i} className="card-elevated p-5">
                <div className="text-xs text-text-muted">{d.name.split('[')[0]}</div>
                <div className="text-2xl font-bold text-brand-primary mt-1">{d.increase}</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Surge under direct plume</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Exploratory Data Analysis (EDA) & Diurnal Dynamics Studio"
        objective="This studio presents empirical temporal and directional distributions extracted from 70,176 continuous ground monitoring records. It isolates how atmospheric boundary layer collapses and nocturnal thermal inversions modulate ground toxicity."
        visualElements={[
          {
            name: "Sub-Navigation Pill Switcher (2 Analysis Modes)",
            type: "Control",
            description: "Top toggle pills switching between 'Diurnal Inversion Cycles' and 'Downwind Plume Impact' exploratory views.",
            axesOrEncoding: "Active mode highlighted in solid dark charcoal with smooth fade-in transition.",
            whatItShows: "Enables focused inspection between 24-hour temporal diurnal cycles and 360° directional plume advection."
          },
          {
            name: "24-Hour Diurnal Continuous Area Chart (Diurnal Tab)",
            type: "Chart",
            description: "Smooth multi-series area chart tracking hourly mean concentrations of Ammonia (NH₃) in crimson (#E34A32) and PM2.5 in emerald (#2a9d8f) from 0:00 to 23:00 IST.",
            axesOrEncoding: "X-Axis: Hour of Day (0:00 to 23:00). Y-Axis: Concentration (µg/m³). Shaded area fills with Cartesian grid and dark tooltip.",
            whatItShows: "Reveals the signature nocturnal accumulation peak between 02:00 and 06:00 IST due to planetary boundary layer compression."
          },
          {
            name: "Atmospheric Mechanism Finding Cards (2 Cards in Diurnal Tab)",
            type: "Panel",
            description: "Two analytical cards below the diurnal chart explaining the physical meteorological mechanisms.",
            axesOrEncoding: "Card 1: 'Atmospheric Stagnation Mechanism' (00:00–06:00 radiative cooling & boundary layer collapse); Card 2: 'Daytime Convective Ventilation' (12:00–16:00 thermal expansion >1,200m diluting gas by >55%).",
            whatItShows: "Connects hourly statistical curves directly to atmospheric boundary layer physics."
          },
          {
            name: "Downwind Plume Sector Comparison Bar Chart (Downwind Tab)",
            type: "Chart",
            description: "Grouped bar chart contrasting average pollutant concentrations under Ghazipur direct path (100°–160° SE) versus other wind sectors across 4 key pollutants.",
            axesOrEncoding: "X-Axis: Pollutants (NH₃, CO, PM2.5, Benzene). Y-Axis: Concentration. Grey bars (#8a8c91) = Other Wind Sectors; Crimson bars (#E34A32) = Direct Ghazipur Corridor (100°–160°).",
            whatItShows: "Quantifies the localized plume delta: NH₃ (48.2 vs 79.6 µg/m³), CO (1.85 vs 2.94 mg/m³), PM2.5 (154.2 vs 228.7 µg/m³), Benzene (3.4 vs 5.8 µg/m³)."
          },
          {
            name: "Metric Plume Surge Highlight Cards (4 Cards in Downwind Tab)",
            type: "Widget",
            description: "Four summary cards below the bar chart displaying the exact empirical percentage increase under direct plume exposure.",
            axesOrEncoding: "Ammonia (+65.1%), Carbon Monoxide (+58.9%), PM2.5 (+48.3%), Benzene (+70.5%) in bold crimson typography.",
            whatItShows: "Instant numerical confirmation of severe chemical amplification caused specifically by landfill plume transport."
          }
        ]}
        symbolsAndIcons={[
          {
            symbol: "📈",
            label: "Diurnal Temporal Trend",
            category: "Icon",
            meaning: "Represents 24-hour cyclical hourly fluctuations governed by solar heating and nocturnal radiation cooling."
          },
          {
            symbol: "💨",
            label: "Plume Wind Vector",
            category: "Icon",
            meaning: "Signifies directional atmospheric advection carrying concentrated gases from the landfill to the ground sensor."
          },
          {
            symbol: "🔴",
            label: "Ghazipur Direct Path (100°-160°)",
            category: "Badge",
            meaning: "Represents air quality measurements taken strictly when wind azimuth was aligned between 100° and 160° directly towards Anand Vihar."
          },
          {
            symbol: "⚪",
            label: "Other Wind Sectors",
            category: "Badge",
            meaning: "Represents baseline urban air quality measurements recorded when wind blew from all other non-landfill directions."
          }
        ]}
        interactiveControls={[
          {
            control: "Analysis Sub-Tab Bar (Diurnal vs Downwind)",
            type: "Tab",
            functionality: "Toggles between 24-Hour Diurnal Dynamics and Downwind Plume Sector comparison views.",
            impactOnOutput: "Switches the display between the continuous hourly area chart and the comparative sector bar chart with delta cards."
          }
        ]}
        metricDefinitions={[
          {
            term: "µg/m³",
            unit: "Concentration",
            definition: "Micrograms of pollutant per cubic meter of ambient air (standard regulatory unit for NH₃, PM2.5, Benzene)."
          },
          {
            term: "mg/m³",
            unit: "Concentration",
            definition: "Milligrams of pollutant per cubic meter of air (used for higher-volume gases like Carbon Monoxide CO)."
          },
          {
            term: "Boundary Layer Height",
            unit: "Meters (m)",
            definition: "Vertical thickness of the troposphere in direct thermal contact with Earth's surface; compresses to <200m at night and expands to >1,200m by day."
          }
        ]}
        actionableInsights={[
          "Confirms that human exposure risk is intensely skewed toward late-night and early morning hours (02:00 to 06:00 IST) when boundary layer compression is severe.",
          "Establishes empirical baselines used as core input features (temporal lags, wind direction, boundary layer height) for the predictive ML models.",
          "Recommends targeted municipal night misting and perimeter flare mitigations between 10:00 PM and 06:00 AM."
        ]}
        dataSources={[
          "DPCC Continuous Ground Telemetry (70,176 samples)",
          "Central Pollution Control Board (CPCB) Verified Data",
          "India Meteorological Department (IMD) Boundary Layer Profiler"
        ]}
      />
    </div>
  );
};
