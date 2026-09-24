import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  Compass,
  Tag
} from 'lucide-react';

export interface VisualElementItem {
  name: string;
  type: 'Chart' | 'Map' | 'Table' | 'Widget' | 'Panel' | 'Control' | 'Diagram';
  description: string;
  axesOrEncoding?: string;
  whatItShows: string;
}

export interface SymbolGlossaryItem {
  symbol: string;
  label: string;
  category: 'Marker' | 'Status' | 'Badge' | 'Metric' | 'Zone' | 'Icon';
  meaning: string;
}

export interface ControlParameterItem {
  control: string;
  type: 'Slider' | 'Tab' | 'Button' | 'Dropdown' | 'Toggle';
  functionality: string;
  impactOnOutput: string;
}

export interface MetricDefinitionItem {
  term: string;
  unit?: string;
  definition: string;
}

export interface PageDescriptionProps {
  pageTitle: string;
  badgeText?: string;
  objective: string;
  // Core Figures, Charts & Visual Elements Breakdown
  visualElements: VisualElementItem[];
  // Complete Symbols & Icons Glossary
  symbolsAndIcons: SymbolGlossaryItem[];
  // Interactive Controls & Parameters
  interactiveControls?: ControlParameterItem[];
  // Metrics & Mathematical Terms
  metricDefinitions?: MetricDefinitionItem[];
  // Key Takeaways & Decision Impact
  actionableInsights: string[];
  // Data Sources & Provenance
  dataSources: string[];
}

export const PageDescriptionCard: React.FC<PageDescriptionProps> = ({
  pageTitle,
  badgeText = 'Comprehensive Element-by-Element Reference & Visual Glossary',
  objective,
  visualElements,
  symbolsAndIcons,
  interactiveControls,
  metricDefinitions,
  actionableInsights,
  dataSources,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="card-elevated p-6 sm:p-8 bg-gradient-to-br from-surface-card via-surface-light/95 to-surface-card border border-border-light shadow-lg mt-10 rounded-3xl transition-all">
      {/* Header with Title & Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-light/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <span>{pageTitle}</span>
            <span className="text-xs font-serif-italic font-normal text-brand-primary hidden md:inline">
              — Detailed Visual, Symbol & Mathematical Guide
            </span>
          </h3>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-xs font-semibold text-text-secondary hover:text-text-primary border border-border-light shadow-sm transition-all self-start sm:self-auto"
        >
          <span>{isExpanded ? 'Collapse Page Guide' : 'Expand Detailed Page Guide'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-7 pt-5 animate-fade-in text-xs sm:text-sm">
          {/* 1. Core Purpose & What This Page Represents */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-light/90 border border-border-light space-y-2">
            <div className="font-bold text-text-primary flex items-center gap-2 text-xs uppercase tracking-wider text-brand-primary">
              <Sparkles className="w-4 h-4" />
              <span>Page Mission & Scope</span>
            </div>
            <p className="text-text-secondary leading-relaxed text-xs sm:text-sm">
              {objective}
            </p>
          </div>

          {/* 2. Figures, Charts & Visual Elements Breakdown */}
          <div className="space-y-3">
            <div className="font-bold text-text-primary flex items-center justify-between text-xs uppercase tracking-wider text-text-muted">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-primary" />
                <span>Visual Elements & Figures Breakdown (What Every Chart & Component Represents)</span>
              </span>
              <span className="font-mono text-[10px] text-brand-primary font-bold">
                {visualElements.length} Visual Components
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {visualElements.map((el, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/80 border border-border-light space-y-2 shadow-2xs hover:border-brand-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border-light/60 pb-2">
                    <span className="font-bold text-text-primary text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span>{el.name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-light text-text-muted font-mono text-[10px] uppercase font-semibold border border-border-light">
                      {el.type}
                    </span>
                  </div>

                  <p className="text-text-secondary text-xs leading-relaxed">
                    {el.description}
                  </p>

                  {el.axesOrEncoding && (
                    <div className="p-2 rounded-xl bg-surface-light text-[11px] font-mono text-text-secondary border border-border-light/50">
                      <strong>Visual Encodings / Axes:</strong> {el.axesOrEncoding}
                    </div>
                  )}

                  <div className="text-[11px] text-brand-primary font-medium flex items-start gap-1">
                    <span className="font-bold text-text-primary">What It Demonstrates:</span>
                    <span>{el.whatItShows}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Symbols, Icons, Emojis & UI Badges Glossary */}
          <div className="space-y-3">
            <div className="font-bold text-text-primary flex items-center justify-between text-xs uppercase tracking-wider text-text-muted">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-primary" />
                <span>Symbols, Icons & UI Badges Glossary (Exact Meaning of Emojis & Markers)</span>
              </span>
              <span className="font-mono text-[10px] text-brand-primary font-bold">
                {symbolsAndIcons.length} Defined Symbols
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border-light bg-white/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-light text-text-muted border-b border-border-light uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-2.5 px-3 w-14 text-center">Symbol</th>
                    <th className="py-2.5 px-3 w-44">Label / Name</th>
                    <th className="py-2.5 px-3 w-28">Category</th>
                    <th className="py-2.5 px-3">Meaning & Clinical / Spatial Representation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light/70">
                  {symbolsAndIcons.map((sym, idx) => (
                    <tr key={idx} className="hover:bg-surface-light/40 transition-colors">
                      <td className="py-2.5 px-3 text-center text-base font-bold select-none">{sym.symbol}</td>
                      <td className="py-2.5 px-3 font-semibold text-text-primary">{sym.label}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-surface-light text-text-secondary text-[10px] font-mono border border-border-light">
                          {sym.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-text-secondary leading-relaxed">{sym.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Interactive Controls & Parameters Guide (if available) */}
          {interactiveControls && interactiveControls.length > 0 && (
            <div className="space-y-3">
              <div className="font-bold text-text-primary flex items-center justify-between text-xs uppercase tracking-wider text-text-muted">
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-primary" />
                  <span>Interactive Controls & User Inputs (How Manipulating Inputs Modifies Visuals)</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interactiveControls.map((ctrl, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-border-light space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-brand-primary" />
                        <span>{ctrl.control}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-mono text-[10px] font-bold">
                        {ctrl.type}
                      </span>
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed">
                      <strong>Functionality:</strong> {ctrl.functionality}
                    </p>
                    <p className="text-brand-primary text-[11px] leading-relaxed">
                      <strong>Impact on Output:</strong> {ctrl.impactOnOutput}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Metrics & Mathematical Terms Dictionary (if available) */}
          {metricDefinitions && metricDefinitions.length > 0 && (
            <div className="space-y-3">
              <div className="font-bold text-text-primary flex items-center justify-between text-xs uppercase tracking-wider text-text-muted">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-primary" />
                  <span>Metrics, Units & Mathematical Dictionary</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {metricDefinitions.map((met, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface-light border border-border-light space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary font-mono">{met.term}</span>
                      {met.unit && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-brand-primary font-mono font-bold border border-border-light">
                          {met.unit}
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed">
                      {met.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Key Actionable Insights & Decision Impacts */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
            <div className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Key Research Takeaways & Actionable Decision Impacts</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-950">
              {actionableInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 7. Provenance & Verified Data Sources */}
          <div className="pt-3 border-t border-border-light/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-text-secondary flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Verified Data Sources:</span>
              </span>
              {dataSources.map((source, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-white border border-border-light text-text-secondary font-mono text-[10px]"
                >
                  {source}
                </span>
              ))}
            </div>

            <div className="text-text-secondary flex items-center gap-1 font-mono text-[10px]">
              <span>Christ University Machine Learning Coursework</span>
              <span>• Ghazipur Landfill Super-Emitter Research</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
