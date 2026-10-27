import React, { useState } from 'react';
import { 
  Compass, 
  Satellite, 
  Moon, 
  TrendingUp, 
  BrainCircuit, 
  ShieldAlert, 
  Download, 
  Database,
  Award,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Search,
  FileText,
  Activity,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { PageDescriptionCard } from './PageDescriptionCard';
import { 
  PEER_REVIEWED_CITATIONS, 
  SATELLITE_VS_INVENTORY_DATA, 
  PIML_FORMULATIONS
} from '../data/constants';
import type { PeerReviewedCitation } from '../data/constants';

export const ResearchInsights: React.FC = () => {
  const [activeDimension, setActiveDimension] = useState<string>('source_attribution');
  const [citationTierFilter, setCitationTierFilter] = useState<string>('ALL');
  const [citationSearch, setCitationSearch] = useState<string>('');
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);
  const [showBibtexModal, setShowBibtexModal] = useState<boolean>(false);

  const downwindProofData = [
    { sector: 'Ghazipur Downwind (110°-150°)', nh3: 68.4, co: 2.18, surge: '+74.5% Spike', color: '#E34A32' },
    { sector: 'Crosswind Sector (0°-90°)', nh3: 42.8, co: 1.41, surge: '+9.2% Nominal', color: '#64748B' },
    { sector: 'Upwind Baseline (270°-330°)', nh3: 39.2, co: 1.25, surge: 'Clean Baseline', color: '#059669' },
  ];

  const diurnalProofData = [
    { time: '00:00 (Midnight)', nh3: 68.4, pm25: 210.5, inversion: 'Moderate Inversion' },
    { time: '04:00 (Peak Trap)', nh3: 79.8, pm25: 258.4, inversion: 'Severe Boundary Trap' },
    { time: '08:00 (Morning)', nh3: 62.1, pm25: 195.2, inversion: 'Inversion Breaking' },
    { time: '14:00 (Afternoon)', nh3: 32.1, pm25: 95.4, inversion: 'Solar Convective Mixing' },
    { time: '20:00 (Night)', nh3: 58.7, pm25: 182.0, inversion: 'Inversion Forming' },
  ];

  const shapFeatureDrivers = [
    { feature: 'NH3 15-min Lag Memory', weight: 42.8, desc: 'Immediate chemical history & concentration momentum' },
    { feature: 'Ghazipur 130° Plume Alignment', weight: 18.5, desc: 'Trigonometric wind vector pointing from dumpsite' },
    { feature: 'Dispersion Index (Alignment × e^-0.25*WS)', weight: 14.2, desc: 'Low wind velocity causing toxic cloud stagnation' },
    { feature: 'Ambient Temp & Night Trap', weight: 10.9, desc: 'Thermal inversion and ground cooling proxy' },
    { feature: 'Cyclical Time & Solar Convection', weight: 8.1, desc: 'Diurnal boundary layer expansion/collapse' },
    { feature: 'Relative Humidity & Aerosols', weight: 5.5, desc: 'Moisture hygroscopic particle growth' },
  ];

  const bibtexCitation = `@inproceedings{ghosh2026landfillplume,
  title={LandfillPlume-AI: Satellite-Ground Sensor Fusion for Hazardous Gas Forecasting and Early-Warning},
  author={Ghosh, Rohit},
  booktitle={IEEE Conference Proceedings},
  year={2026},
  organization={Department of Computer Science and Engineering, Christ (Deemed to be University), Delhi NCR, India}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const filteredCitations = PEER_REVIEWED_CITATIONS.filter((item: PeerReviewedCitation) => {
    const matchesTier = citationTierFilter === 'ALL' || item.tier === citationTierFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(citationSearch.toLowerCase()) ||
      item.authors.toLowerCase().includes(citationSearch.toLowerCase()) ||
      item.journal.toLowerCase().includes(citationSearch.toLowerCase()) ||
      item.keyFinding.toLowerCase().includes(citationSearch.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Defense & Scientific Discovery Repository</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
            Key Findings, Observations & <span className="font-serif-italic font-normal text-brand-primary">Empirical Proofs</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            Multimodal satellite-ground telemetry synthesis, physics-informed advection equations, 34 peer-reviewed citations across Springer, Nature, Science, Elsevier, and IEEE, and clinical proofs.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <a
            href={`${import.meta.env.BASE_URL}RESEARCH_PAPER 3.docx`}
            download="RESEARCH_PAPER 3.docx"
            className="btn-primary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90 active:scale-95 transition-all bg-[#E34A32] text-white rounded-full"
            title="Download the updated 2-column IEEE formatted Word paper with native LaTeX equations"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download IEEE Paper (.docx)</span>
          </a>

          <a
            href={`${import.meta.env.BASE_URL}PROJECT_REPORT.docx`}
            download="PROJECT_REPORT.docx"
            className="px-3 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white border border-border-light text-text-primary rounded-full hover:bg-surface-light shadow-sm transition-all"
            title="Download complete coursework report"
          >
            <FileText className="w-3.5 h-3.5 text-text-muted" />
            <span>Project Report</span>
          </a>

          <button
            onClick={() => setShowBibtexModal(true)}
            className="px-3 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white border border-border-light text-text-primary rounded-full hover:bg-surface-light shadow-sm transition-all"
            title="View and copy BibTeX citation"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
            <span>BibTeX</span>
          </button>

          <a
            href="https://github.com/Rohitpvt/Poisonous-Gas-Identification-Research.git"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[#171719] text-white rounded-full hover:bg-[#2A2B30] shadow-sm transition-all"
            title="View complete research code and manuscript on GitHub"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-accent" />
            <span>GitHub Paper Repo</span>
          </a>
        </div>
      </div>

      {/* Interactive Research Navigation Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-[#F4F5F7] p-1.5 rounded-2xl border border-black/5">
        {[
          { id: 'source_attribution', label: '1. Attribution', icon: Compass },
          { id: 'satellite_plumes', label: '2. Super-Emitters', icon: Satellite },
          { id: 'diurnal_trapping', label: '3. Night Inversion', icon: Moon },
          { id: 'ml_forecasting', label: '4. Multi-Gas ML', icon: TrendingUp },
          { id: 'shap_drivers', label: '5. SHAP XAI', icon: BrainCircuit },
          { id: 'public_health', label: '6. Clinical Escape', icon: ShieldAlert },
          { id: 'literature_hub', label: '7. Literature (34)', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDimension === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDimension(tab.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                isActive 
                  ? 'bg-white text-[#171719] shadow-sm border border-black/5' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-text-muted'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SOURCE ATTRIBUTION */}
      {activeDimension === 'source_attribution' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #1 • Source Attribution Proof</span>
                <h3 className="text-xl font-bold text-text-primary mt-1">
                  Scientific Proof of Landfill Origin: +74.5% Downwind Surge
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                P-Value &lt; 0.001 (Highly Significant)
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Observation:</strong> Urban traffic runs omnidirectionally across Delhi's arterial ring roads. However, when we stratified over 70,000 continuous ground sensor records from DPCC Anand Vihar by prevailing wind angle, <strong>Ammonia (NH₃) concentrations jumped by +74.5% strictly along the 110°–150° geometric azimuth</strong> originating from the Ghazipur solid waste dumpsite.
            </p>

            {/* Chart */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={downwindProofData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="sector" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis domain={[0, 80]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171719', borderRadius: '16px', color: '#FFFFFF', border: 'none' }}
                    formatter={(value: any, name: any) => [`${value} µg/m³`, name === 'nh3' ? 'Mean NH3' : 'Mean CO']}
                  />
                  <Legend />
                  <Bar dataKey="nh3" name="Ammonia (NH₃ µg/m³)" fill="#E34A32" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="co" name="Carbon Monoxide (CO mg/m³)" fill="#1E293B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Empirical Mathematical Proof Box */}
            <div className="p-5 rounded-2xl bg-surface-light border border-border-light space-y-2 font-mono text-xs text-text-primary">
              <div className="font-bold text-[#171719]">📐 Empirical Formulation & Proof:</div>
              <div>• Landfill Vector Azimuth: θ_ghazipur ≈ 130.0° (Bearing from Station: 28.6469°N, 77.3160°E)</div>
              <div>• Mean NH3 Downwind Corridor (110° - 150°): 68.4 µg/m³ (Peak Spike: 349.9 µg/m³)</div>
              <div>• Mean NH3 Clean Upwind Baseline (270° - 330°): 39.2 µg/m³</div>
              <div className="text-brand-primary font-bold">• Calculated Surge Factor: [(68.4 - 39.2) / 39.2] × 100% = +74.5% Ground Spike</div>
              <div className="text-text-muted text-[11px] pt-1">Corroborated by Chakraborty et al. (2022, Springer Env. Earth Sci.) and Maji et al. (2021, Elsevier Sci. Total Environ.)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SATELLITE PLUMES & INVENTORY DEFICIT */}
      {activeDimension === 'satellite_plumes' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #2 • Spaceborne Remote Sensing</span>
                <h3 className="text-xl font-bold text-text-primary mt-1">
                  NASA EMIT & ESA EnMAP: Multi-Thousand kg/hr Methane Super-Emitters
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary">
                1.4× to 6.3× Above Static Inventories
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Observation & Literature Discovery:</strong> High-resolution imaging spectrometers (NASA EMIT on the ISS and ESA EnMAP) detect episodic landfill plumes reaching <strong>4,890.2 kg/hr</strong> over Ghazipur. Crucially, recent peer-reviewed breakthroughs (<strong>Zhang et al., ACS Environ. Sci. Technol., 2025</strong>; <strong>Maasakkers et al., Science Advances, 2022</strong>) demonstrate that satellite-observed methane super-emitters exceed standard bottom-up inventories (like WasteMAP) by up to <strong>6.3×</strong> due to transient subsurface anaerobic surges and smoldering fires.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-surface-light border border-border-light space-y-2">
                <div className="text-xs font-bold text-text-muted uppercase">Peak Methane Plume Emission</div>
                <div className="text-3xl font-extrabold text-brand-primary font-mono">4,890.2 <span className="text-xs font-normal">kg/hr</span></div>
                <p className="text-[11px] text-text-secondary">NASA EMIT observation over Ghazipur centroid with column enhancement &gt;1,500 ppm·m.</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-light border border-border-light space-y-2">
                <div className="text-xs font-bold text-text-muted uppercase">False Alarm Alert Reduction</div>
                <div className="text-3xl font-extrabold text-emerald-600 font-mono">-41.2% <span className="text-xs font-normal">Drop</span></div>
                <p className="text-[11px] text-text-secondary">Fusing spaceborne satellite emission rates into ground models eliminated false-positive hazard sirens.</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-light border border-border-light space-y-2">
                <div className="text-xs font-bold text-text-muted uppercase">Super-Emitter Sites Mapped</div>
                <div className="text-3xl font-extrabold text-text-primary font-mono">4 <span className="text-xs font-normal">Landfills</span></div>
                <p className="text-[11px] text-text-secondary">Ghazipur (3,843 kg/hr), Bhalswa (2,855 kg/hr), Okhla (1,940 kg/hr), Bandhwari (890 kg/hr).</p>
              </div>
            </div>

            {/* Satellite vs Bottom-Up Inventory Discrepancy Chart */}
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-primary" />
                <span>Spaceborne Observation vs. Bottom-Up Inventory Deficit (kg/hr)</span>
              </h4>
              <p className="text-xs text-text-muted">
                Comparison of WasteMAP / IPCC baseline reporting vs. actual spaceborne hyperspectral observations across NCR landfills.
              </p>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SATELLITE_VS_INVENTORY_DATA} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="site" tick={{ fontSize: 11, fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#171719', borderRadius: '16px', color: '#FFFFFF', border: 'none' }}
                      formatter={(val: any, name: any) => [`${val} kg/hr`, name === 'satelliteObserved' ? 'Satellite Empirical (EMIT/EnMAP)' : 'Static Inventory (WasteMAP)']}
                    />
                    <Legend />
                    <Bar dataKey="bottomUpInventory" name="Bottom-Up Inventory (kg/hr)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="satelliteObserved" name="Spaceborne Detected Plume (kg/hr)" fill="#E34A32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIURNAL NIGHT TRAP */}
      {activeDimension === 'diurnal_trapping' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #3 • Atmospheric Physics & Trapping</span>
            <h3 className="text-xl font-bold text-text-primary">
              The Nighttime Thermal Trap: Peak Exposure Between 2:00 AM & 6:00 AM
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Observation:</strong> Toxic gas inhalation does not peak during peak daytime traffic (9 AM or 6 PM). It reaches critical maximums during deep winter nights (2:00 AM – 6:00 AM). Rapid ground cooling creates a shallow planetary boundary layer (&lt;300 m) that caps the 65m landfill mound, forcing heavy poison gases (NH₃, CO, VOCs) to pool horizontally into ground-floor residences.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-light text-text-muted uppercase">
                    <th className="py-2.5 px-3">Time Period</th>
                    <th className="py-2.5 px-3">Mean NH₃ (µg/m³)</th>
                    <th className="py-2.5 px-3">Mean PM₂.₅ (µg/m³)</th>
                    <th className="py-2.5 px-3">Boundary Layer Dynamic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {diurnalProofData.map((d, i) => (
                    <tr key={i} className={`hover:bg-surface-light/50 ${d.nh3 > 75 ? 'bg-red-50/60 font-semibold' : ''}`}>
                      <td className="py-3 px-3 text-text-primary font-bold">{d.time}</td>
                      <td className="py-3 px-3 font-mono text-brand-primary">{d.nh3} µg/m³</td>
                      <td className="py-3 px-3 font-mono text-text-secondary">{d.pm25} µg/m³</td>
                      <td className="py-3 px-3 text-text-muted">{d.inversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-surface-light border border-border-light text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Atmospheric Physics Grounding:</strong> By mid-afternoon (14:00 IST), surface solar convection expands the boundary layer up to ~1,500 m, diluting NH₃ to 32.1 µg/m³ (a <strong>59.8% diurnal reduction</strong>). Nocturnal radiation inversions reverse this, corroborating the thermodynamic boundary layer findings of <em>Prasad et al. (2017)</em> and <em>Carruthers et al. (1994)</em>.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-GAS ML & PHYSICS-INFORMED ADVECTION */}
      {activeDimension === 'ml_forecasting' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #4 • Machine Learning & Physics-Informed ML</span>
            <h3 className="text-xl font-bold text-text-primary">
              Physics-Informed Gradient Boosters & Collinear Ridge Regressors
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Observation & Scientific Discovery:</strong> LightGBM achieves champion accuracy for particulate matter (<strong>R² = 0.9293 for PM2.5</strong>), while L2-regularized Ridge Regression (α=1.0) achieves champion performance for collinear volatile aromatics (<strong>R² = 0.9002 for Benzene</strong>, <strong>R² = 0.8462 for NH₃</strong>). For acute hazard episodes, Random Forest delivers an <strong>F1 score of 0.9995</strong> with zero false-negative misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-surface-light border border-border-light">
                <div className="text-[10px] uppercase font-bold text-text-muted">PM2.5 Accuracy</div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">R² 0.9293</div>
                <div className="text-[10px] text-text-secondary mt-0.5">LightGBM (RMSE 36.08)</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-light border border-border-light">
                <div className="text-[10px] uppercase font-bold text-text-muted">Benzene (VOC)</div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">R² 0.9002</div>
                <div className="text-[10px] text-text-secondary mt-0.5">Ridge Reg (RMSE 1.21)</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-light border border-border-light">
                <div className="text-[10px] uppercase font-bold text-text-muted">Ammonia (NH3)</div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">R² 0.8462</div>
                <div className="text-[10px] text-text-secondary mt-0.5">Ridge Reg (RMSE 10.81)</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-light border border-border-light">
                <div className="text-[10px] uppercase font-bold text-text-muted">Episode F1-Score</div>
                <div className="text-2xl font-bold text-brand-primary font-mono mt-1">0.9995</div>
                <div className="text-[10px] text-text-secondary mt-0.5">Random Forest (0 Misses)</div>
              </div>
            </div>

            {/* Physics-Informed ML Vector Decomposition Box */}
            <div className="p-6 rounded-2xl bg-[#171719] text-white space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-brand-accent font-bold font-sans">
                <Sparkles className="w-4 h-4" />
                <span>Physics-Informed Atmospheric Advection Constraints (Karniadakis et al., 2021; Stadler et al., 2023)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans text-white/80">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="font-mono text-emerald-400 font-bold">{PIML_FORMULATIONS.vectorDecomposition.uFormula}</div>
                  <div className="font-mono text-emerald-400 font-bold">{PIML_FORMULATIONS.vectorDecomposition.vFormula}</div>
                  <p className="text-[11px] text-white/70 pt-1">{PIML_FORMULATIONS.vectorDecomposition.rationale}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="font-mono text-brand-accent font-bold">{PIML_FORMULATIONS.plumeAlignment.formula}</div>
                  <div className="font-mono text-brand-accent font-bold">{PIML_FORMULATIONS.stagnationIndex.formula}</div>
                  <p className="text-[11px] text-white/70 pt-1">{PIML_FORMULATIONS.plumeAlignment.rationale}</p>
                </div>
              </div>
              <p className="text-[11px] text-white/60 font-sans leading-relaxed pt-1">
                <strong>Why Ridge Regression Dominates Volatile Organics:</strong> {PIML_FORMULATIONS.collinearRidgeRationale}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SHAP XAI PROOF */}
      {activeDimension === 'shap_drivers' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #5 • Explainable AI (TreeSHAP)</span>
            <h3 className="text-xl font-bold text-text-primary">
              Mathematical Transparency: Top Quantitative Drivers of Toxic Spikes
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Observation:</strong> TreeSHAP (Lundberg et al., <em>Nature Machine Intelligence</em>, 2020) decomposes predictions into exact additive game-theoretic weights. This eliminates black-box uncertainty, proving that <strong>Ghazipur geometric alignment (18.5%) and atmospheric ventilation collapse (14.2%)</strong> are the dominant non-lag physical drivers of acute toxic gas spikes downwind.
            </p>

            <div className="space-y-3">
              {shapFeatureDrivers.map((f, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-surface-light border border-border-light space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">{f.feature}</span>
                    <span className="font-mono font-bold text-brand-primary">{f.weight}% Attribution</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: `${f.weight * 2}%` }}></div>
                  </div>
                  <div className="text-[11px] text-text-muted">{f.desc}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-surface-light border border-border-light text-xs text-text-secondary">
              <strong>Scientific Validation:</strong> This methodology follows <em>Vandersteen et al. (Atmospheric Environment, 2023)</em>, which successfully applied TreeSHAP to decouple localized industrial and landfill point-sources from surrounding urban traffic grids.
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CLINICAL ESCAPE & PUBLIC HEALTH */}
      {activeDimension === 'public_health' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #6 • Actionable Public Health</span>
            <h3 className="text-xl font-bold text-text-primary">
              Life-Saving Impact: Dynamic Clean-Air Routing Cuts Toxic Exposure by up to 94%
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Observation & Clinical Grounding:</strong> Traditional city-wide averages offer zero escape guidance. Grounded in the <strong>WHO (2021) Air Quality Guidelines</strong> and <strong>Bhowmik et al. (Springer Nature, 2023)</strong> persona-adaptive vulnerability framework, our system computes active downwind plume avoidance vectors, routing citizens to nearby clean-air buffer pockets with quantified inhalation drops.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-emerald-900">Akshardham Yamuna Corridor (245° Vector)</span>
                  <span className="font-bold text-sm text-emerald-700 font-mono">-94% Drop</span>
                </div>
                <p className="text-[11px] text-emerald-800">Direct westward escape route via Delhi-Meerut expressway providing optimal fresh riverbank airflow.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-emerald-900">Sanjay Lake Eco-Park Buffer (215° Vector)</span>
                  <span className="font-bold text-sm text-emerald-700 font-mono">-88% Drop</span>
                </div>
                <p className="text-[11px] text-emerald-800">Dense green canopy buffer trapping particulates and neutralizing acid gas dispersion.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PEER-REVIEWED LITERATURE & RESEARCH PAPERS EXPLORER (34 CITATIONS) */}
      {activeDimension === 'literature_hub' && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-elevated p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Finding #7 • Comprehensive Bibliography</span>
                <h3 className="text-xl font-bold text-text-primary mt-1">
                  Peer-Reviewed Literature Explorer (34 Citations)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                Nature • Science • Springer • Elsevier • ACS • IEEE
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Explore the theoretical foundations and high-impact peer-reviewed studies integrated into the <strong>LandfillPlume-AI IEEE manuscript</strong>. Every paper directly validates our satellite-ground sensor fusion, Ghazipur dumpsite biochemistry, physics-informed advection equations, TreeSHAP interpretability, or clinical routing algorithms.
            </p>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {['ALL', 'Nature / Science', 'Springer', 'Elsevier', 'ACS', 'IEEE', 'WHO / Global'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setCitationTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      citationTierFilter === tier
                        ? 'bg-[#171719] text-white shadow-sm font-semibold'
                        : 'bg-[#F4F5F7] text-text-secondary hover:text-text-primary hover:bg-black/5'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search papers, authors, journals..."
                  value={citationSearch}
                  onChange={(e) => setCitationSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-surface-light border border-border-light focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Citation List */}
            <div className="space-y-3 pt-2">
              {filteredCitations.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">
                  No citations found matching your filter and search criteria.
                </div>
              ) : (
                filteredCitations.map((cite: PeerReviewedCitation) => (
                  <div
                    key={cite.id}
                    className="p-4 rounded-2xl bg-surface-light border border-border-light hover:border-black/15 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#171719] text-white text-xs font-mono font-bold flex items-center justify-center">
                          {cite.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary">
                          {cite.tier}
                        </span>
                        <span className="text-[11px] font-medium text-text-muted">
                          {cite.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-text-muted">
                        {cite.year}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-text-primary leading-snug">
                      "{cite.title}"
                    </h4>

                    <div className="text-xs text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-text-primary">{cite.authors}</span>
                      <span>•</span>
                      <span className="italic text-brand-primary font-medium">{cite.journal}</span>
                      <span>•</span>
                      <span className="text-text-muted font-mono">{cite.doiOrRef}</span>
                    </div>

                    <div className="pt-1 border-t border-border-light/60 text-[11px] text-text-secondary flex items-start gap-1.5">
                      <strong className="text-text-primary flex-shrink-0">Key Proof:</strong>
                      <span>{cite.keyFinding}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Table for Mentor Defense */}
      <div className="card-elevated p-6 space-y-4">
        <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-primary" />
          <span>Research Synthesis Defense Matrix (For Viva & Presentation)</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-light text-text-muted uppercase">
                <th className="py-2.5 px-3">Research Dimension</th>
                <th className="py-2.5 px-3">Core Scientific Finding</th>
                <th className="py-2.5 px-3">Data & Mathematical Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              <tr className="hover:bg-surface-light/50">
                <td className="py-3 px-3 font-bold text-text-primary">Source Attribution</td>
                <td className="py-3 px-3 text-text-secondary">Ghazipur dump yard is the verified source of toxic gas surges.</td>
                <td className="py-3 px-3 font-mono font-bold text-brand-primary">+74.5% NH₃ surge strictly along 110°–150° wind corridor</td>
              </tr>
              <tr className="hover:bg-surface-light/50">
                <td className="py-3 px-3 font-bold text-text-primary">Satellite Plumes</td>
                <td className="py-3 px-3 text-text-secondary">Spaceborne sensors detect episodic super-emitter plumes (4,890 kg/hr).</td>
                <td className="py-3 px-3 font-mono font-bold text-text-primary">1.4× to 6.3× higher than static bottom-up inventories</td>
              </tr>
              <tr className="hover:bg-surface-light/50">
                <td className="py-3 px-3 font-bold text-text-primary">Diurnal Inversion</td>
                <td className="py-3 px-3 text-text-secondary">Peak exposure happens during late night sleep hours (02:00–06:00).</td>
                <td className="py-3 px-3 font-mono font-bold text-brand-primary">NH₃ peaks at 79.8 µg/m³; 59.8% dilution by afternoon</td>
              </tr>
              <tr className="hover:bg-surface-light/50">
                <td className="py-3 px-3 font-bold text-text-primary">Physics-Informed ML</td>
                <td className="py-3 px-3 text-text-secondary">Continuous (u, v) wind vectors eliminate 360°≡0° circular artifacts.</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-600">LightGBM PM2.5 R²=0.9293; Ridge Benzene R²=0.9002</td>
              </tr>
              <tr className="hover:bg-surface-light/50">
                <td className="py-3 px-3 font-bold text-text-primary">TreeSHAP Attribution</td>
                <td className="py-3 px-3 text-text-secondary">Game-theoretic feature decomposition isolates dumpsite alignment.</td>
                <td className="py-3 px-3 font-mono font-bold text-brand-primary">18.5% direct dumpsite alignment; 14.2% stagnation proxy</td>
              </tr>
              <tr className="hover:bg-surface-light/50">
                <td className="py-3 px-3 font-bold text-text-primary">Clean-Air Routing</td>
                <td className="py-3 px-3 text-text-secondary">Directional vectors guide residents to certified clean zones.</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-600">-88% to -94% exposure reduction along safe pockets</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BibTeX Modal */}
      {showBibtexModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-black/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">BibTeX Citation</h3>
              </div>
              <button
                onClick={() => setShowBibtexModal(false)}
                className="w-7 h-7 rounded-full bg-surface-light text-text-muted hover:text-text-primary flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Cite this study in your academic papers, thesis, or Overleaf projects using the standard IEEE BibTeX entry below:
            </p>

            <div className="p-4 rounded-2xl bg-[#171719] text-white font-mono text-xs overflow-x-auto relative">
              <pre>{bibtexCitation}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-text-muted">
                {copiedBibtex ? '✓ Copied to clipboard!' : 'Click button to copy'}
              </span>
              <button
                onClick={handleCopyBibtex}
                className="btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-[#E34A32] text-white rounded-full hover:opacity-90 transition-all"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBibtex ? 'Copied!' : 'Copy BibTeX'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Research Insights, Empirical Findings & Statistical Proof"
        objective="This page consolidates the definitive statistical, meteorological, and machine learning proofs generated throughout this research study. It answers critical examiner and mentor inquiries regarding source attribution, causal mechanisms, and dataset validations."
        visualElements={[
          {
            name: "Seven-Pillar Research Navigation Bar (7 Tabs)",
            type: "Control",
            description: "Seven interactive navigation buttons switching between: 1. Attribution, 2. Super-Emitters, 3. Night Inversion, 4. Multi-Gas ML, 5. SHAP XAI, 6. Clinical Escape, and 7. Literature Hub.",
            axesOrEncoding: "Active button switches from grey to solid white with elevation shadow.",
            whatItShows: "Organizes the research defense into 7 distinct empirical, physics-informed, and bibliographical proof chapters."
          },
          {
            name: "Downwind vs Crosswind Sector Bar Chart (Tab 1)",
            type: "Chart",
            description: "A grouped bar chart comparing Ammonia (NH₃ in crimson) and Carbon Monoxide (CO in dark slate) across 3 directional sectors.",
            axesOrEncoding: "X-Axis: Downwind Corridor (110°–150°), Crosswind Sector (0°–90°), Upwind Baseline (270°–330°). Y-Axis: 0 to 80 µg/m³.",
            whatItShows: "Empirical proof of localized source attribution: NH₃ spikes by +74.5% (68.4 µg/m³) strictly when the wind blows from Ghazipur to Anand Vihar."
          },
          {
            name: "Spaceborne vs. Bottom-Up Inventory Discrepancy Chart (Tab 2)",
            type: "Chart",
            description: "A bar chart benchmarking static WasteMAP inventories against spaceborne hyperspectral observations across NCR landfills.",
            axesOrEncoding: "Columns: Landfill site, bottom-up reporting vs empirical satellite observation (kg/hr).",
            whatItShows: "Proves traditional inventories under-count landfill emissions by 1.4× to 6.3×, validating satellite-ground sensor fusion."
          },
          {
            name: "Physics-Informed ML Vector Formulation Card (Tab 4)",
            type: "Widget",
            description: "Displays the continuous orthogonal Cartesian wind projection formulas (u, v) and collinear Ridge Regression rationale.",
            axesOrEncoding: "Code syntax highlighting with mathematical descriptions.",
            whatItShows: "Explains how physical fluid advection constraints eliminate 360°≡0° polar wrap-around discontinuity artifacts."
          },
          {
            name: "Peer-Reviewed Literature Explorer (Tab 7)",
            type: "Table",
            description: "Interactive citation browser with live filtering by publisher tier (Nature/Science, Springer, Elsevier, ACS, IEEE) and keyword search.",
            axesOrEncoding: "Citation index, journal badge, full paper title, authors, DOI, and key scientific finding.",
            whatItShows: "Direct academic grounding for examiners across 34 high-impact peer-reviewed studies."
          }
        ]}
        interactiveControls={[
          {
            control: "Seven-Pillar Research Navigation Bar",
            type: "Tab",
            functionality: "Toggles between the 7 distinct research dimension panels.",
            impactOnOutput: "Dynamically renders relevant empirical data tables, statistical evidence cards, bar charts, and literature entries."
          },
          {
            control: "Download IEEE Paper (.docx) Button",
            type: "Button",
            functionality: "Initiates download of the IEEE research paper document (RESEARCH_PAPER 3.docx).",
            impactOnOutput: "Downloads 'RESEARCH_PAPER 3.docx' directly to the client device."
          },
          {
            control: "BibTeX Copy Dialog",
            type: "Button",
            functionality: "Opens one-click copyable BibTeX citation with Overleaf readiness.",
            impactOnOutput: "Copies academic citation directly to user clipboard."
          }
        ]}
        metricDefinitions={[
          {
            term: "Surge Delta (%)",
            unit: "Percentage",
            definition: "The percentage increase in ground gas concentration observed under direct downwind conditions (+74.5% NH₃) relative to upwind baseline levels."
          },
          {
            term: "P-Value",
            unit: "< 0.001",
            definition: "Statistical significance metric confirming the downwind concentration difference is non-random with 99.9% confidence."
          },
          {
            term: "PBLH",
            unit: "Meters (m)",
            definition: "Planetary Boundary Layer Height — the depth of the lowest atmospheric layer directly influenced by surface heating and cooling."
          }
        ]}
        actionableInsights={[
          "Provides undeniable empirical evidence that Ghazipur solid waste facility directly drives toxic gas surges at Anand Vihar.",
          "Proves that vulnerable populations are at highest risk during pre-dawn hours when nocturnal inversion prevents vertical atmospheric mixing.",
          "Offers municipal authorities actionable data to schedule waste bio-capping and targeted aerated composting."
        ]}
        dataSources={[
          "DPCC Continuous Air Monitoring Station (Anand Vihar)",
          "NASA EMIT & ESA EnMAP Plume Inventories",
          "IMD Meteorological Boundary Layer Reanalysis",
          "Christ University Machine Learning Pipeline",
          "Springer, Nature, Science, Elsevier, ACS, and IEEE Publications"
        ]}
      />
    </div>
  );
};