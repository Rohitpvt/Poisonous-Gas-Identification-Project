import React from 'react';
import { ArrowUpRight, Satellite, ShieldCheck, Flame, Compass, Wind, Download, BookOpen, ExternalLink } from 'lucide-react';
import { SATELLITE_PLUMES } from '../data/constants';
import { PageDescriptionCard } from './PageDescriptionCard';

interface OverviewProps {
  onExploreSimulator: () => void;
  onExploreMap: () => void;
  onExploreInsights?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({ onExploreSimulator, onExploreMap, onExploreInsights }) => {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Container */}
      <div className="card-dark p-8 md:p-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/90 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
            <span>Multimodal NASA EMIT & DPCC Continuous Ground Fusion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
            Transforming Landfill <span className="font-serif-italic text-brand-accent font-normal">Super-Emitters</span> into Actionable Air Intelligence.
          </h1>

          <p className="text-white/75 text-base sm:text-lg max-w-2xl leading-relaxed">
            A precision machine learning framework predicting hazardous ammonia (NH₃), carbon monoxide (CO), and methane (CH₄) dispersion episodes across residential corridors bordering Delhi's Ghazipur dump yard.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreSimulator}
              className="btn-brand px-6 py-3 text-sm font-medium flex items-center gap-2"
            >
              <span>Launch Plume Simulator</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreMap}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div>
            <div className="text-white/50 text-xs font-medium">DPCC Ground Records</div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">70,176</div>
            <div className="text-emerald-400 text-[11px] mt-0.5 flex items-center gap-1">
              <span>●</span> 15-min continuous time series
            </div>
          </div>
          <div>
            <div className="text-white/50 text-xs font-medium">Satellite Plumes Tracked</div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">23</div>
            <div className="text-brand-accent text-[11px] mt-0.5">NASA EMIT & ESA EnMAP</div>
          </div>
          <div>
            <div className="text-white/50 text-xs font-medium">Forecasting R² Score</div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">0.8462</div>
            <div className="text-white/70 text-[11px] mt-0.5">1-Hour Ahead NH₃ / Benzene</div>
          </div>
          <div>
            <div className="text-white/50 text-xs font-medium">Episode Alert F1</div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">0.9995</div>
            <div className="text-emerald-400 text-[11px] mt-0.5">ROC-AUC 1.000</div>
          </div>
        </div>
      </div>

      {/* Academic Research Publication Spotlight Banner */}
      <div className="card-elevated p-6 sm:p-8 bg-gradient-to-r from-[#171719] via-[#1E2024] to-[#25272C] text-white rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-primary/20 text-brand-accent border border-brand-primary/30">
                IEEE Manuscript Ready
              </span>
              <span className="text-white/60 text-xs">
                Department of CSE, Christ (Deemed to be University)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              LandfillPlume-AI: Satellite-Ground Sensor Fusion for Hazardous Gas Forecasting and Early-Warning
            </h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              Synthesizing 34 peer-reviewed citations across <em>Nature Reviews Physics</em>, <em>Science Advances</em>, <em>ACS ES&amp;T</em>, <em>Springer</em>, <em>Elsevier</em>, and <em>IEEE</em>. Empirically proves +74.5% downwind NH₃ surge and an 88%–94% exposure reduction via clean-air routing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <a
              href={`${import.meta.env.BASE_URL}RESEARCH_PAPER 2.docx`}
              download="RESEARCH_PAPER 2.docx"
              className="px-4 py-2.5 rounded-full bg-[#E34A32] hover:bg-[#c93f2a] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Paper (.docx)</span>
            </a>
            {onExploreInsights && (
              <button
                onClick={onExploreInsights}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/15 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-accent" />
                <span>Explore 34 Citations</span>
              </button>
            )}
            <a
              href="https://github.com/Rohitpvt/Poisonous-Gas-Identification-Research.git"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3-Column Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Ghazipur Focus */}
        <div className="card-elevated p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary">
              Ghazipur <span className="font-serif-italic font-normal text-brand-primary">Corridor</span>
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              When wind vectors align with the <strong>100° – 160° azimuth</strong>, toxic ammonia and carbon monoxide surge by <strong>35% to 65%</strong> at Anand Vihar within 45 minutes.
            </p>
          </div>
          <div className="stat-pill px-4 py-2.5 flex items-center justify-between text-xs">
            <span className="text-text-muted">Direct Alignment Azimuth:</span>
            <span className="font-bold text-brand-primary">130.0° SE</span>
          </div>
        </div>

        {/* Card 2: Thermal Inversion */}
        <div className="card-elevated p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-dark text-white flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary">
              Nocturnal <span className="font-serif-italic font-normal">Trapping</span>
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Boundary layer compression between <strong>10:00 PM and 6:00 AM</strong> traps low-velocity dump emissions in the lowest 100 meters, creating acute ground exposure.
            </p>
          </div>
          <div className="stat-pill px-4 py-2.5 flex items-center justify-between text-xs">
            <span className="text-text-muted">Peak Hazardous Hours:</span>
            <span className="font-bold text-text-primary">02:00 – 05:00 IST</span>
          </div>
        </div>

        {/* Card 3: Explainable AI */}
        <div className="card-elevated p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary">
              Explainable <span className="font-serif-italic font-normal text-emerald-600">SHAP</span>
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Every forecast is broken down into game-theoretic Shapley force values, eliminating black-box opacity and providing transparent legal and health justification.
            </p>
          </div>
          <div className="stat-pill px-4 py-2.5 flex items-center justify-between text-xs">
            <span className="text-text-muted">Feature Decomposition:</span>
            <span className="font-bold text-emerald-600">Live Waterfall</span>
          </div>
        </div>
      </div>

      {/* Satellite Plume Overpasses Log */}
      <div className="card-elevated p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-text-primary flex items-center gap-2.5">
              <Satellite className="w-6 h-6 text-brand-primary" />
              <span>Satellite Hyperspectral Plume Overpass Feed</span>
            </h3>
            <p className="text-text-muted text-sm mt-1">
              Direct methane super-emitter detections across Delhi solid waste dumpsites (IPCC Sector 6A).
            </p>
          </div>
          <div className="stat-pill px-4 py-2 text-xs font-semibold text-text-secondary self-start">
            23 Point Source Detections
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light text-text-muted text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Observation Time (UTC)</th>
                <th className="py-3 px-4">Landfill Site</th>
                <th className="py-3 px-4">CH₄ Emission Rate</th>
                <th className="py-3 px-4">Wind Vector</th>
                <th className="py-3 px-4">Sensor Instrument</th>
                <th className="py-3 px-4">Target Gas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {SATELLITE_PLUMES.slice(0, 6).map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-light/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">{p.datetime}</td>
                  <td className="py-3.5 px-4 font-semibold text-text-primary">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.landfillSite === 'Ghazipur' ? 'bg-brand-primary' : 'bg-amber-500'}`}></span>
                      {p.landfillSite}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                    {p.ch4EmissionKgHr.toLocaleString()} kg/hr
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary text-xs">
                    {p.windSpeed} m/s @ {p.windDirection}°
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-light border border-border-light text-text-secondary">
                      {p.instrument}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{p.gas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Executive Overview & Multi-Sensor Fusion Architecture"
        objective="This page establishes the macro research framework, uniting high-resolution orbital satellite hyperspectral imaging (NASA EMIT, ESA EnMAP) with continuous ground-level ambient air monitoring (DPCC Anand Vihar). It contextualizes the massive scale of solid waste emissions across the Delhi-NCR capital region."
        visualElements={[
          {
            name: "Hero Intelligence Banner & Quick Action Buttons",
            type: "Panel",
            description: "Deep charcoal header card featuring the 'Multimodal NASA EMIT & DPCC Continuous Ground Fusion' badge, project title, and two direct action buttons.",
            axesOrEncoding: "Deep charcoal card with ambient crimson radial glow. Action buttons: 'Launch Plume Simulator' (brand red) and 'Explore Interactive Map' (translucent white).",
            whatItShows: "Immediate system overview and one-click navigation to the interactive Gaussian Plume Simulator and Leaflet GIS Map."
          },
          {
            name: "Executive Live KPI Metrics Grid (4 Metric Counters)",
            type: "Widget",
            description: "Four elevated live summary metric cards embedded in the hero banner displaying dataset size and model benchmarks.",
            axesOrEncoding: "Card 1: 70,176 DPCC Ground Records (15-min continuous time series); Card 2: 23 Satellite Plumes Tracked (NASA EMIT & ESA EnMAP); Card 3: 0.8425 Forecasting R² Score (1-Hour Ahead NH₃/CO); Card 4: 0.9995 Episode Alert F1 (ROC-AUC 1.000).",
            whatItShows: "Quantifies the empirical dataset scale (70,176 15-min records), 23 spaceborne plume captures, and peak predictive performance."
          },
          {
            name: "Three Core Scientific Highlight Cards",
            type: "Panel",
            description: "Three structured cards outlining the primary empirical phenomena governing Delhi landfill pollution.",
            axesOrEncoding: "Card 1 (🔥 Ghazipur Corridor): 100°–160° azimuth alignment, 130.0° SE direct corridor, +35% to +65% toxic gas surge; Card 2 (💨 Nocturnal Trapping): Boundary layer compression 10:00 PM – 6:00 AM, Peak hours 02:00–05:00 IST; Card 3 (🛡️ Explainable SHAP): Shapley force values with live waterfall decomposition.",
            whatItShows: "Explains how wind geometry, nighttime thermal inversions, and game-theoretic AI drive toxic gas accumulation."
          },
          {
            name: "Satellite Hyperspectral Plume Overpass Feed Table",
            type: "Table",
            description: "A 6-column historical register displaying verified spaceborne hyperspectral methane plume observations with a '23 Point Source Detections' badge.",
            axesOrEncoding: "Columns: Observation Time (UTC), Landfill Site (Ghazipur / Bhalswa / Okhla), CH₄ Emission Rate (kg/hr in bold crimson), Wind Vector (Speed @ Azimuth), Sensor Instrument (NASA EMIT / ESA EnMAP), Target Gas (CH₄ in green).",
            whatItShows: "Direct physical proof of spaceborne methane captures ranging from 1,850 kg/hr to over 4,890 kg/hr across Delhi dumpsites."
          }
        ]}
        interactiveControls={[
          {
            control: "Launch Plume Simulator CTA",
            type: "Button",
            functionality: "Switches the active workspace tab directly to the interactive Gaussian Plume Simulation Studio.",
            impactOnOutput: "Loads real-time sliders for wind speed, temperature, and atmospheric stability."
          },
          {
            control: "Explore Interactive Map CTA",
            type: "Button",
            functionality: "Navigates directly to the Leaflet.js & OpenStreetMap GIS map view.",
            impactOnOutput: "Opens the 2D geospatial map centered on the Ghazipur-Anand Vihar dispersion corridor."
          }
        ]}
        metricDefinitions={[
          {
            term: "DPCC Ground Records",
            unit: "70,176 Samples",
            definition: "Continuous 15-minute ambient air telemetry collected by the Delhi Pollution Control Committee station at Anand Vihar."
          },
          {
            term: "kg/hr",
            unit: "Mass Flux",
            definition: "Kilograms of methane emitted per hour from the landfill surface into the atmospheric boundary layer."
          },
          {
            term: "Forecasting R²",
            unit: "0.8425",
            definition: "Coefficient of determination quantifying the proportion of ground toxic gas variance predicted 1 hour ahead."
          },
          {
            term: "Episode Alert F1",
            unit: "0.9995",
            definition: "Harmonic mean of precision and recall for classifying acute hazardous exceedance states (ROC-AUC 1.000)."
          }
        ]}
        actionableInsights={[
          "Confirms Ghazipur is Delhi's single largest point-source emitter of greenhouse and toxic trace gases.",
          "Demonstrates that spaceborne hyperspectral satellites can reliably track episodic dumpsite methane flaring events.",
          "Provides examiners and policy makers with verified multi-sensor evidence justifying bio-mining interventions."
        ]}
        dataSources={[
          "NASA EMIT (ISS Hyperspectral Spectrometer)",
          "ESA EnMAP (German Aerospace Hyperspectral Satellite)",
          "DPCC Anand Vihar CAAQMS Telemetry Station",
          "CPCB National Ambient Air Quality Registry"
        ]}
      />
    </div>
  );
};
