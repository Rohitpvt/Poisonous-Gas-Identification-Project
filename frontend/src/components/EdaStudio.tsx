import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { DIURNAL_TRENDS } from '../data/constants';
import { Clock, TrendingUp, Sparkles, Wind } from 'lucide-react';

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
    </div>
  );
};
